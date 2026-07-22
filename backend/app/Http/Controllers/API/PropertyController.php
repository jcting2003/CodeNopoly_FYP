<?php

namespace App\Http\Controllers\API;

use App\Events\LeaderboardUpdated;
use App\Events\RentPaid;
use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\GamePlayer;
use App\Models\GameProperty;
use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class PropertyController extends Controller
{
    private const RESALE_DIVISOR = 2;

    public function buy(Request $request)
    {
        $fields = $request->validate([
            'game_id' => 'required|exists:games,id',
            'property_id' => 'required|exists:properties,id',
        ]);

        $user = $request->user();
        $game = Game::find($fields['game_id']);

        if (! $game) {
            return response()->json([
                'message' => 'Game not found',
            ], 404);
        }

        $gamePlayer = $this->findGamePlayer($game->id, $user->id);

        if (! $gamePlayer) {
            return response()->json([
                'message' => 'Player is not part of this game',
            ], 404);
        }

        if ($gamePlayer->is_bankrupt) {
            return response()->json([
                'message' => 'Bankrupt players cannot buy property',
            ], 422);
        }

        if ($pendingRentResponse = $this->pendingRentBlockedResponse($gamePlayer, 'buy property')) {
            return $pendingRentResponse;
        }

        $property = Property::with('tile')->find($fields['property_id']);
        $gameProperty = $this->findOrCreateGameProperty($game->id, $property->id);

        if ($gameProperty->owner_user_id) {
            return response()->json([
                'message' => 'Property is already owned',
            ], 400);
        }

        if ($gamePlayer->credits < $property->cost) {
            return response()->json([
                'message' => 'Not enough credits to buy this property',
            ], 400);
        }

        if ($game->status !== 'started') {
            return response()->json([
                'message' => 'Game has not started yet',
            ], 400);
        }

        if ((int) $game->current_turn_user_id !== (int) $user->id) {
            return response()->json([
                'message' => 'It is not your turn',
            ], 403);
        }

        if ($game->last_dice_roll === null) {
            return response()->json([
                'message' => 'You must roll the dice before buying a property',
            ], 422);
        }

        if (
            $gamePlayer->last_question_answered_turn !== null &&
            (int) $gamePlayer->last_question_answered_turn === (int) $game->turn_number
        ) {
            return response()->json([
                'message' => 'You cannot buy a property after answering a question in the same turn',
            ], 422);
        }

        if (! $property->tile || (int) $gamePlayer->position !== (int) $property->tile->tile_number) {
            return response()->json([
                'message' => 'You can only buy the property you are currently standing on',
                'current_position' => $gamePlayer->position,
                'property_tile_number' => $property->tile?->tile_number,
            ], 403);
        }

        $gamePlayer->credits -= $property->cost;
        $gamePlayer->last_property_bought_turn = $game->turn_number;
        $gamePlayer->last_property_bought_property_id = $property->id;
        $gamePlayer->save();

        GameProperty::where('game_id', $game->id)
            ->where('property_id', $property->id)
            ->update([
                'owner_user_id' => $user->id,
                'purchased_at' => now(),
                'updated_at' => now(),
            ]);

        return response()->json([
            'message' => 'Property purchased successfully',
            'property' => [
                'id' => $property->id,
                'property_name' => $property->property_name,
                'cost' => $property->cost,
                'rent' => $property->rent,
            ],
            'remaining_credits' => $gamePlayer->credits,
            'total_credits' => $gamePlayer->total_credits,
        ]);
    }

    public function buyHouse(Request $request)
    {
        $fields = $request->validate([
            'game_id' => 'required|exists:games,id',
            'property_id' => 'required|exists:properties,id',
        ]);

        $user = $request->user();
        $game = Game::find($fields['game_id']);

        if (! $game) {
            return response()->json([
                'message' => 'Game not found',
            ], 404);
        }

        $gamePlayer = $this->findGamePlayer($game->id, $user->id);

        if (! $gamePlayer) {
            return response()->json([
                'message' => 'Player is not part of this game',
            ], 404);
        }

        if ($gamePlayer->is_bankrupt) {
            return response()->json([
                'message' => 'Bankrupt players cannot buy houses',
            ], 422);
        }

        if ($pendingRentResponse = $this->pendingRentBlockedResponse($gamePlayer, 'buy a house')) {
            return $pendingRentResponse;
        }

        $property = Property::find($fields['property_id']);

        if (! $property->supportsUpgrades()) {
            return response()->json([
                'message' => 'This property cannot be upgraded with houses',
            ], 422);
        }

        $gameProperty = GameProperty::where('game_id', $game->id)
            ->where('property_id', $property->id)
            ->first();

        if (! $gameProperty || (int) $gameProperty->owner_user_id !== (int) $user->id) {
            return response()->json([
                'message' => 'You do not own this property',
            ], 403);
        }

        if ($gameProperty->has_hotel) {
            return response()->json([
                'message' => 'This property already has a hotel',
            ], 400);
        }

        if ($gameProperty->houses >= 4) {
            return response()->json([
                'message' => 'Maximum 4 houses reached. Buy a hotel instead.',
            ], 400);
        }

        if ($gamePlayer->credits < $property->house_cost) {
            return response()->json([
                'message' => 'Not enough credits to buy a house',
            ], 400);
        }

        if (
            $gamePlayer->last_property_bought_turn !== null &&
            (int) $gamePlayer->last_property_bought_turn === (int) $game->turn_number
        ) {
            return response()->json([
                'message' => 'You cannot buy a house in the same turn you bought a property',
            ], 422);
        }

        if ($game->status !== 'started') {
            return response()->json([
                'message' => 'Game has not started yet',
            ], 400);
        }

        if ((int) $game->current_turn_user_id !== (int) $user->id) {
            return response()->json([
                'message' => 'It is not your turn',
            ], 403);
        }

        if ($game->last_dice_roll === null) {
            return response()->json([
                'message' => 'You must roll the dice before buying a house',
            ], 422);
        }

        if (
            $gamePlayer->last_house_bought_turn !== null &&
            (int) $gamePlayer->last_house_bought_turn === (int) $game->turn_number
        ) {
            return response()->json([
                'message' => 'You can only buy one house per turn',
            ], 422);
        }

        $gamePlayer->credits -= $property->house_cost;
        $gamePlayer->last_house_bought_turn = $game->turn_number;
        $gamePlayer->last_house_bought_property_id = $property->id;
        $gamePlayer->save();

        GameProperty::where('game_id', $game->id)
            ->where('property_id', $property->id)
            ->update([
                'houses' => $gameProperty->houses + 1,
                'updated_at' => now(),
            ]);

        $gameProperty = GameProperty::where('game_id', $game->id)
            ->where('property_id', $property->id)
            ->first();

        return response()->json([
            'message' => 'House purchased successfully',
            'property_id' => $property->id,
            'houses' => $gameProperty->houses,
            'has_hotel' => $gameProperty->has_hotel,
            'remaining_credits' => $gamePlayer->credits,
            'total_credits' => $gamePlayer->total_credits,
        ]);
    }

    public function buyHotel(Request $request)
    {
        $fields = $request->validate([
            'game_id' => 'required|exists:games,id',
            'property_id' => 'required|exists:properties,id',
        ]);

        $user = $request->user();
        $game = Game::find($fields['game_id']);

        if (! $game) {
            return response()->json([
                'message' => 'Game not found',
            ], 404);
        }

        $gamePlayer = $this->findGamePlayer($game->id, $user->id);

        if (! $gamePlayer) {
            return response()->json([
                'message' => 'Player is not part of this game',
            ], 404);
        }

        if ($gamePlayer->is_bankrupt) {
            return response()->json([
                'message' => 'Bankrupt players cannot buy hotels',
            ], 422);
        }

        if ($pendingRentResponse = $this->pendingRentBlockedResponse($gamePlayer, 'buy a hotel')) {
            return $pendingRentResponse;
        }

        $property = Property::find($fields['property_id']);

        if (! $property->supportsUpgrades()) {
            return response()->json([
                'message' => 'This property cannot be upgraded with a hotel',
            ], 422);
        }

        $gameProperty = GameProperty::where('game_id', $game->id)
            ->where('property_id', $property->id)
            ->first();

        if (! $gameProperty || (int) $gameProperty->owner_user_id !== (int) $user->id) {
            return response()->json([
                'message' => 'You do not own this property',
            ], 403);
        }

        if ($gameProperty->has_hotel) {
            return response()->json([
                'message' => 'This property already has a hotel',
            ], 400);
        }

        if ($gameProperty->houses < 4) {
            return response()->json([
                'message' => 'You need 4 houses before buying a hotel',
            ], 400);
        }

        if ($gamePlayer->credits < $property->hotel_cost) {
            return response()->json([
                'message' => 'Not enough credits to buy a hotel',
            ], 400);
        }

        if ($game->status !== 'started') {
            return response()->json([
                'message' => 'Game has not started yet',
            ], 400);
        }

        if ((int) $game->current_turn_user_id !== (int) $user->id) {
            return response()->json([
                'message' => 'It is not your turn',
            ], 403);
        }

        if ($game->last_dice_roll === null) {
            return response()->json([
                'message' => 'You must roll the dice before buying a hotel',
            ], 422);
        }

        $gamePlayer->credits -= $property->hotel_cost;
        $gamePlayer->save();

        GameProperty::where('game_id', $game->id)
            ->where('property_id', $property->id)
            ->update([
                'houses' => 4,
                'has_hotel' => true,
                'updated_at' => now(),
            ]);

        $gameProperty = GameProperty::where('game_id', $game->id)
            ->where('property_id', $property->id)
            ->first();

        return response()->json([
            'message' => 'Hotel purchased successfully',
            'property_id' => $property->id,
            'houses' => $gameProperty->houses,
            'has_hotel' => $gameProperty->has_hotel,
            'remaining_credits' => $gamePlayer->credits,
            'total_credits' => $gamePlayer->total_credits,
        ]);
    }

    public function payRent(Request $request)
    {
        $fields = $request->validate([
            'game_id' => 'required|exists:games,id',
            'property_id' => 'required|exists:properties,id',
        ]);

        $user = $request->user();
        $game = Game::find($fields['game_id']);

        if (! $game) {
            return response()->json([
                'message' => 'Game not found',
            ], 404);
        }

        $tenant = $this->findGamePlayer($game->id, $user->id);

        if (! $tenant) {
            return response()->json([
                'message' => 'Player is not part of this game',
            ], 404);
        }

        if ($tenant->is_bankrupt) {
            return response()->json([
                'message' => 'Bankrupt players cannot pay rent',
            ], 422);
        }

        $gameProperty = GameProperty::where('game_id', $game->id)
            ->where('property_id', $fields['property_id'])
            ->first();

        if (! $gameProperty || ! $gameProperty->owner_user_id) {
            return response()->json([
                'message' => 'This property has no owner',
            ], 400);
        }

        if ((int) $gameProperty->owner_user_id === (int) $user->id) {
            return response()->json([
                'message' => 'You do not pay rent on your own property',
            ], 400);
        }

        $owner = $this->findGamePlayer($game->id, $gameProperty->owner_user_id);

        if (! $owner || $owner->is_bankrupt) {
            return response()->json([
                'message' => 'Property owner is not part of this game',
            ], 404);
        }

        $property = Property::with('tile')->find($fields['property_id']);
        $rentAmount = $this->calculateCurrentRent($property, $gameProperty);

        if ($game->status !== 'started') {
            return response()->json([
                'message' => 'Game has not started yet',
            ], 400);
        }

        if ((int) $game->current_turn_user_id !== (int) $user->id) {
            return response()->json([
                'message' => 'It is not your turn',
            ], 403);
        }

        if ($game->last_dice_roll === null) {
            return response()->json([
                'message' => 'You must roll the dice before paying rent',
            ], 422);
        }

        if (! $property->tile || (int) $tenant->position !== (int) $property->tile->tile_number) {
            return response()->json([
                'message' => 'You can only pay rent for the property you are currently standing on',
                'current_position' => $tenant->position,
                'property_tile_number' => $property->tile?->tile_number,
            ], 403);
        }

        if (
            $tenant->last_rent_paid_turn !== null &&
            (int) $tenant->last_rent_paid_turn === (int) $game->turn_number &&
            $tenant->last_rent_paid_property_id !== null &&
            (int) $tenant->last_rent_paid_property_id === (int) $property->id
        ) {
            return response()->json([
                'message' => 'Rent has already been paid for this property this turn',
            ], 422);
        }

        if ($tenant->credits < $rentAmount) {
            $tenant->pending_rent_amount = $rentAmount;
            $tenant->pending_rent_property_id = $property->id;
            $tenant->pending_rent_owner_id = $owner->user_id;
            $tenant->save();

            return response()->json([
                'message' => 'Not enough credits to pay rent. Sell assets or declare bankruptcy.',
                'pending_rent' => [
                    'amount' => $rentAmount,
                    'property_id' => $property->id,
                    'property_name' => $property->property_name,
                    'owner_user_id' => $owner->user_id,
                    'owner_name' => $owner->user?->name ?? 'Unknown Player',
                    'current_credits' => $tenant->credits,
                    'shortfall' => $rentAmount - $tenant->credits,
                ],
            ], 409);
        }

        $tenant->credits -= $rentAmount;
        $tenant->last_rent_paid_turn = $game->turn_number;
        $tenant->last_rent_paid_property_id = $property->id;
        $this->clearPendingRent($tenant);
        $tenant->save();

        $owner->credits += $rentAmount;
        $owner->total_credits += $rentAmount;
        $owner->save();

        $leaderboard = $this->buildLeaderboardPayload($game->id);

        event(new LeaderboardUpdated($game->id, $leaderboard));
        event(new RentPaid(
            $game->id,
            (int) $tenant->user_id,
            $tenant->user?->name ?? 'Unknown Player',
            (int) $owner->user_id,
            $owner->user?->name ?? 'Unknown Player',
            (int) $rentAmount,
            $property->property_name,
            (int) $tenant->credits,
            (int) $owner->credits
        ));

        return response()->json([
            'message' => 'Rent paid successfully',
            'property_id' => $property->id,
            'property_name' => $property->property_name,
            'rent_paid' => $rentAmount,
            'tenant' => [
                'user_id' => $tenant->user_id,
                'remaining_credits' => $tenant->credits,
                'total_credits' => $tenant->total_credits,
            ],
            'owner' => [
                'user_id' => $owner->user_id,
                'current_credits' => $owner->credits,
                'total_credits' => $owner->total_credits,
            ],
            'leaderboard' => $leaderboard,
        ]);
    }

    public function myProperties(Request $request, int $id)
    {
        $game = Game::find($id);

        if (! $game) {
            return response()->json([
                'message' => 'Game not found',
            ], 404);
        }

        $gamePlayer = $this->findGamePlayer($game->id, $request->user()->id);

        if (! $gamePlayer) {
            return response()->json([
                'message' => 'Player is not part of this game',
            ], 404);
        }

        $ownedProperties = GameProperty::with('property.tile')
            ->where('game_id', $game->id)
            ->where('owner_user_id', $request->user()->id)
            ->get()
            ->map(function (GameProperty $gameProperty) {
                $property = $gameProperty->property;

                if (! $property) {
                    return null;
                }

                return $this->buildMyPropertyPayload($property, $gameProperty);
            })
            ->filter()
            ->sortBy(fn (array $property) => $property['tile_number'] ?? PHP_INT_MAX)
            ->values();

        return response()->json([
            'game_id' => $game->id,
            'player' => [
                'user_id' => $gamePlayer->user_id,
                'credits' => $gamePlayer->credits,
                'total_credits' => $gamePlayer->total_credits,
                'is_bankrupt' => (bool) $gamePlayer->is_bankrupt,
                'pending_rent_amount' => $gamePlayer->pending_rent_amount,
                'pending_rent_property_id' => $gamePlayer->pending_rent_property_id,
                'pending_rent_owner_id' => $gamePlayer->pending_rent_owner_id,
            ],
            'properties' => $ownedProperties,
        ]);
    }

    public function sellHouse(Request $request, int $gameId, int $propertyId)
    {
        return $this->sellAsset($request, $gameId, $propertyId, 'house');
    }

    public function sellHotel(Request $request, int $gameId, int $propertyId)
    {
        return $this->sellAsset($request, $gameId, $propertyId, 'hotel');
    }

    public function sell(Request $request, int $gameId, int $propertyId)
    {
        return $this->sellAsset($request, $gameId, $propertyId, 'property');
    }

    public function gameProperties(Request $request, int $id)
    {
        $game = Game::find($id);

        if (! $game) {
            return response()->json([
                'message' => 'Game not found',
            ], 404);
        }

        $isHost = (int) $game->host_id === (int) $request->user()->id;
        $isPlayerInGame = GamePlayer::where('game_id', $game->id)
            ->where('user_id', $request->user()->id)
            ->exists();

        if (! $isHost && ! $isPlayerInGame) {
            return response()->json([
                'message' => 'You are not part of this game',
            ], 403);
        }

        $gamePropertiesByPropertyId = GameProperty::with('owner')
            ->where('game_id', $id)
            ->get()
            ->keyBy('property_id');

        $properties = Property::with('tile')
            ->get()
            ->map(function ($property) use ($gamePropertiesByPropertyId) {
                $gameProperty = $gamePropertiesByPropertyId->get($property->id);

                return [
                    'game_property_id' => $gameProperty ? ($gameProperty->game_id . '-' . $gameProperty->property_id) : null,
                    'property_id' => $property->id,
                    'tile_id' => $property->tile_id,
                    'tile_name' => $property->tile ? $property->tile->tile_name : null,
                    'tile_number' => $property->tile ? $property->tile->tile_number : null,
                    'property_name' => $property->property_name,
                    'color_group' => $property->color_group,
                    'cost' => $property->cost,
                    'house_cost' => $property->house_cost,
                    'hotel_cost' => $property->hotel_cost,
                    'rent' => $property->rent,
                    'rent_1_house' => $property->rent_1_house,
                    'rent_2_houses' => $property->rent_2_houses,
                    'rent_3_houses' => $property->rent_3_houses,
                    'rent_4_houses' => $property->rent_4_houses,
                    'rent_hotel' => $property->rent_hotel,
                    'can_upgrade' => $property->supportsUpgrades(),
                    'owner_user_id' => $gameProperty ? $gameProperty->owner_user_id : null,
                    'owner_name' => $gameProperty && $gameProperty->owner ? $gameProperty->owner->name : null,
                    'houses' => $gameProperty ? $gameProperty->houses : 0,
                    'hotel' => $gameProperty ? (bool) $gameProperty->has_hotel : false,
                    'purchased_at' => $gameProperty ? $gameProperty->purchased_at : null,
                ];
            })
            ->values();

        return response()->json([
            'game_id' => $game->id,
            'game_code' => $game->game_code,
            'status' => $game->status,
            'properties' => $properties,
        ]);
    }

    protected function buildLeaderboardPayload(int $gameId): array
    {
        return GamePlayer::with('user')
            ->where('game_id', $gameId)
            ->orderBy('is_bankrupt')
            ->orderByDesc('total_credits')
            ->orderByDesc('credits')
            ->get()
            ->values()
            ->map(function ($player, $index) {
                return [
                    'rank' => $index + 1,
                    'user_id' => $player->user_id,
                    'user_name' => $player->user ? $player->user->name : 'Unknown',
                    'credits' => $player->credits,
                    'total_credits' => $player->total_credits,
                    'position' => $player->position,
                    'last_property_bought_turn' => $player->last_property_bought_turn,
                    'last_question_answered_turn' => $player->last_question_answered_turn,
                    'last_card_scanned_turn' => $player->last_card_scanned_turn,
                    'is_bankrupt' => (bool) $player->is_bankrupt,
                    'bankrupt_at' => $this->formatDateForPayload($player->bankrupt_at),
                    'pending_rent_amount' => $player->pending_rent_amount,
                    'pending_rent_property_id' => $player->pending_rent_property_id,
                    'pending_rent_owner_id' => $player->pending_rent_owner_id,
                ];
            })
            ->toArray();
    }

    private function findGamePlayer(int $gameId, int $userId): ?GamePlayer
    {
        return GamePlayer::where('game_id', $gameId)
            ->where('user_id', $userId)
            ->first();
    }

    private function findOrCreateGameProperty(int $gameId, int $propertyId): GameProperty
    {
        $gameProperty = GameProperty::where('game_id', $gameId)
            ->where('property_id', $propertyId)
            ->first();

        if ($gameProperty) {
            return $gameProperty;
        }

        return GameProperty::create([
            'game_id' => $gameId,
            'property_id' => $propertyId,
            'owner_user_id' => null,
            'houses' => 0,
            'has_hotel' => false,
            'purchased_at' => null,
        ]);
    }

    private function pendingRentBlockedResponse(GamePlayer $gamePlayer, string $action)
    {
        if (! $gamePlayer->pending_rent_amount || ! $gamePlayer->pending_rent_property_id) {
            return null;
        }

        return response()->json([
            'message' => "You must resolve pending rent before you can {$action}",
            'pending_rent' => [
                'amount' => $gamePlayer->pending_rent_amount,
                'property_id' => $gamePlayer->pending_rent_property_id,
                'owner_user_id' => $gamePlayer->pending_rent_owner_id,
            ],
        ], 422);
    }

    private function calculateCurrentRent(Property $property, GameProperty $gameProperty): int
    {
        if ($gameProperty->has_hotel) {
            return (int) $property->rent_hotel;
        }

        return match ((int) $gameProperty->houses) {
            4 => (int) $property->rent_4_houses,
            3 => (int) $property->rent_3_houses,
            2 => (int) $property->rent_2_houses,
            1 => (int) $property->rent_1_house,
            default => (int) $property->rent,
        };
    }

    private function clearPendingRent(GamePlayer $gamePlayer): void
    {
        $gamePlayer->pending_rent_amount = null;
        $gamePlayer->pending_rent_property_id = null;
        $gamePlayer->pending_rent_owner_id = null;
    }

    private function buildMyPropertyPayload(Property $property, GameProperty $gameProperty): array
    {
        return [
            'property_id' => $property->id,
            'property_name' => $property->property_name,
            'tile_number' => $property->tile?->tile_number,
            'color_group' => $property->color_group,
            'owner_name' => $gameProperty->owner?->name,
            'purchase_price' => $property->cost,
            'base_rent' => $property->rent,
            'rent_1_house' => $property->rent_1_house,
            'rent_2_houses' => $property->rent_2_houses,
            'rent_3_houses' => $property->rent_3_houses,
            'rent_4_houses' => $property->rent_4_houses,
            'rent_hotel' => $property->rent_hotel,
            'house_purchase_cost' => $property->house_cost,
            'hotel_purchase_cost' => $property->hotel_cost,
            'can_upgrade' => $property->supportsUpgrades(),
            'houses' => $gameProperty->houses,
            'has_hotel' => (bool) $gameProperty->has_hotel,
            'house_resale_value' => $this->resaleValue((int) $property->house_cost),
            'hotel_resale_value' => $this->resaleValue((int) $property->hotel_cost),
            'property_resale_value' => $this->resaleValue((int) $property->cost),
            'current_expected_rent' => $this->calculateCurrentRent($property, $gameProperty),
            'can_sell_house' => (int) $gameProperty->houses > 0,
            'can_sell_hotel' => (bool) $gameProperty->has_hotel,
            'can_sell_property' => (int) $gameProperty->houses === 0 && ! $gameProperty->has_hotel,
        ];
    }

    private function resaleValue(int $amount): int
    {
        return (int) floor($amount / self::RESALE_DIVISOR);
    }

    private function formatDateForPayload($value): ?string
    {
        if ($value === null) {
            return null;
        }

        if ($value instanceof Carbon) {
            return $value->toISOString();
        }

        if (is_string($value)) {
            try {
                return Carbon::parse($value)->toISOString();
            } catch (\Throwable) {
                return $value;
            }
        }

        return method_exists($value, 'toISOString')
            ? $value->toISOString()
            : (string) $value;
    }

    private function sellAsset(Request $request, int $gameId, int $propertyId, string $assetType)
    {
        $user = $request->user();
        $game = Game::find($gameId);

        if (! $game) {
            return response()->json([
                'message' => 'Game not found',
            ], 404);
        }

        if ($game->status !== 'started') {
            return response()->json([
                'message' => 'Game is not active',
            ], 400);
        }

        $gamePlayer = $this->findGamePlayer($game->id, $user->id);

        if (! $gamePlayer) {
            return response()->json([
                'message' => 'Player is not part of this game',
            ], 404);
        }

        if ($gamePlayer->is_bankrupt) {
            return response()->json([
                'message' => 'Bankrupt players cannot sell assets',
            ], 422);
        }

        if ((int) $game->current_turn_user_id !== (int) $user->id) {
            return response()->json([
                'message' => 'It is not your turn',
            ], 403);
        }

        $gameProperty = GameProperty::with('property.tile')
            ->where('game_id', $game->id)
            ->where('property_id', $propertyId)
            ->first();

        if (! $gameProperty || (int) $gameProperty->owner_user_id !== (int) $user->id || ! $gameProperty->property) {
            return response()->json([
                'message' => 'You do not own this property',
            ], 403);
        }

        $property = $gameProperty->property;

        $result = DB::transaction(function () use ($assetType, $gameProperty, $gamePlayer, $property, $game) {
            if ($assetType === 'house') {
                if ((int) $gameProperty->houses <= 0) {
                    return response()->json([
                        'message' => 'This property has no houses to sell',
                    ], 422);
                }

                $creditsGained = $this->resaleValue((int) $property->house_cost);
                GameProperty::where('game_id', $game->id)
                    ->where('property_id', $property->id)
                    ->update([
                        'houses' => max(0, $gameProperty->houses - 1),
                        'updated_at' => now(),
                    ]);
            } elseif ($assetType === 'hotel') {
                if (! $gameProperty->has_hotel) {
                    return response()->json([
                        'message' => 'This property has no hotel to sell',
                    ], 422);
                }

                $creditsGained = $this->resaleValue((int) $property->hotel_cost);
                GameProperty::where('game_id', $game->id)
                    ->where('property_id', $property->id)
                    ->update([
                        'has_hotel' => false,
                        'houses' => 0,
                        'updated_at' => now(),
                    ]);
            } else {
                if ($gameProperty->has_hotel || (int) $gameProperty->houses > 0) {
                    return response()->json([
                        'message' => 'You must sell all houses and hotels before selling the property',
                    ], 422);
                }

                $creditsGained = $this->resaleValue((int) $property->cost);
                GameProperty::where('game_id', $game->id)
                    ->where('property_id', $property->id)
                    ->update([
                        'owner_user_id' => null,
                        'houses' => 0,
                        'has_hotel' => false,
                        'purchased_at' => null,
                        'updated_at' => now(),
                    ]);
            }

            $gamePlayer->credits += $creditsGained;
            $gamePlayer->save();

            $gameProperty = GameProperty::with('property.tile')
                ->where('game_id', $game->id)
                ->where('property_id', $property->id)
                ->firstOrFail();

            $leaderboard = $this->buildLeaderboardPayload($game->id);
            event(new LeaderboardUpdated($game->id, $leaderboard));

            return response()->json([
                'message' => ucfirst($assetType) . ' sold successfully',
                'asset_type' => $assetType,
                'property' => $this->buildMyPropertyPayload($property, $gameProperty),
                'credits_gained' => $creditsGained,
                'current_credits' => $gamePlayer->credits,
                'pending_rent_amount' => $gamePlayer->pending_rent_amount,
                'can_pay_pending_rent' => $gamePlayer->pending_rent_amount !== null
                    ? $gamePlayer->credits >= $gamePlayer->pending_rent_amount
                    : false,
                'leaderboard' => $leaderboard,
            ]);
        });

        return $result;
    }
}
