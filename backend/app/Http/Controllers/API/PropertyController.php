<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\GamePlayer;
use App\Models\GameProperty;
use App\Models\Property;
use App\Models\Game;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    public function buy(Request $request)
    {
        $fields = $request->validate([
            'game_id' => 'required|exists:games,id',
            'property_id' => 'required|exists:properties,id',
        ]);

        $user = $request->user();

        $gamePlayer = GamePlayer::where('game_id', $fields['game_id'])
            ->where('user_id', $user->id)
            ->first();

        if (! $gamePlayer) {
            return response()->json([
                'message' => 'Player is not part of this game',
            ], 404);
        }

        $property = Property::find($fields['property_id']);

        $gameProperty = GameProperty::where('game_id', $fields['game_id'])
            ->where('property_id', $fields['property_id'])
            ->first();

        if (! $gameProperty) {
            GameProperty::create([
                'game_id' => $fields['game_id'],
                'property_id' => $fields['property_id'],
                'owner_user_id' => null,
                'houses' => 0,
                'has_hotel' => false,
                'purchased_at' => null,
            ]);

            $gameProperty = GameProperty::where('game_id', $fields['game_id'])
                ->where('property_id', $fields['property_id'])
                ->first();
        }

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

        $gamePlayer->credits -= $property->cost;
        $gamePlayer->save();

        GameProperty::where('game_id', $fields['game_id'])
            ->where('property_id', $fields['property_id'])
            ->update([
                'owner_user_id' => $user->id,
                'purchased_at' => now(),
                'updated_at' => now(),
            ]);

        $gameProperty = GameProperty::where('game_id', $fields['game_id'])
            ->where('property_id', $fields['property_id'])
            ->first();

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

        $gamePlayer = GamePlayer::where('game_id', $fields['game_id'])
            ->where('user_id', $user->id)
            ->first();

        if (! $gamePlayer) {
            return response()->json([
                'message' => 'Player is not part of this game',
            ], 404);
        }

        $property = Property::find($fields['property_id']);

        $gameProperty = GameProperty::where('game_id', $fields['game_id'])
            ->where('property_id', $fields['property_id'])
            ->first();

        if (! $gameProperty || $gameProperty->owner_user_id !== $user->id) {
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

        $game = Game::find($fields['game_id']);

        if (! $game) {
            return response()->json([
                'message' => 'Game not found',
            ], 404);
        }

        if ($game->status !== 'started') {
            return response()->json([
                'message' => 'Game has not started yet',
            ], 400);
        }

        if ($game->current_turn_user_id !== $user->id) {
            return response()->json([
                'message' => 'It is not your turn',
            ], 403);
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

        GameProperty::where('game_id', $fields['game_id'])
            ->where('property_id', $fields['property_id'])
            ->update([
                'houses' => $gameProperty->houses + 1,
                'updated_at' => now(),
            ]);

        $gameProperty = GameProperty::where('game_id', $fields['game_id'])
            ->where('property_id', $fields['property_id'])
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

        $gamePlayer = GamePlayer::where('game_id', $fields['game_id'])
            ->where('user_id', $user->id)
            ->first();

        if (! $gamePlayer) {
            return response()->json([
                'message' => 'Player is not part of this game',
            ], 404);
        }

        $property = Property::find($fields['property_id']);

        $gameProperty = GameProperty::where('game_id', $fields['game_id'])
            ->where('property_id', $fields['property_id'])
            ->first();

        if (! $gameProperty || $gameProperty->owner_user_id !== $user->id) {
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

        $gamePlayer->credits -= $property->hotel_cost;
        $gamePlayer->save();

        GameProperty::where('game_id', $fields['game_id'])
            ->where('property_id', $fields['property_id'])
            ->update([
                'houses' => 0,
                'has_hotel' => true,
                'updated_at' => now(),
            ]);

        $gameProperty = GameProperty::where('game_id', $fields['game_id'])
            ->where('property_id', $fields['property_id'])
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

        $tenant = GamePlayer::where('game_id', $fields['game_id'])
            ->where('user_id', $user->id)
            ->first();

        if (! $tenant) {
            return response()->json([
                'message' => 'Player is not part of this game',
            ], 404);
        }

        $gameProperty = GameProperty::where('game_id', $fields['game_id'])
            ->where('property_id', $fields['property_id'])
            ->first();

        if (! $gameProperty || ! $gameProperty->owner_user_id) {
            return response()->json([
                'message' => 'This property has no owner',
            ], 400);
        }

        if ($gameProperty->owner_user_id === $user->id) {
            return response()->json([
                'message' => 'You do not pay rent on your own property',
            ], 400);
        }

        $owner = GamePlayer::where('game_id', $fields['game_id'])
            ->where('user_id', $gameProperty->owner_user_id)
            ->first();

        if (! $owner) {
            return response()->json([
                'message' => 'Property owner is not part of this game',
            ], 404);
        }

        $property = Property::find($fields['property_id']);

        if ($gameProperty->has_hotel) {
            $rentAmount = $property->rent_hotel;
        } elseif ($gameProperty->houses === 4) {
            $rentAmount = $property->rent_4_houses;
        } elseif ($gameProperty->houses === 3) {
            $rentAmount = $property->rent_3_houses;
        } elseif ($gameProperty->houses === 2) {
            $rentAmount = $property->rent_2_houses;
        } elseif ($gameProperty->houses === 1) {
            $rentAmount = $property->rent_1_house;
        } else {
            $rentAmount = $property->rent;
        }

        if ($tenant->credits < $rentAmount) {
            return response()->json([
                'message' => 'Not enough credits to pay rent',
                'required_rent' => $rentAmount,
                'current_credits' => $tenant->credits,
            ], 400);
        }

        $game = Game::find($fields['game_id']);

        if (! $game) {
            return response()->json([
                'message' => 'Game not found',
            ], 404);
        }

        if ($game->status !== 'started') {
            return response()->json([
                'message' => 'Game has not started yet',
            ], 400);
        }

        if ($game->current_turn_user_id !== $user->id) {
            return response()->json([
                'message' => 'It is not your turn',
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

        $tenant->credits -= $rentAmount;
        $tenant->last_rent_paid_turn = $game->turn_number;
        $tenant->last_rent_paid_property_id = $property->id;
        $tenant->save();

        $owner->credits += $rentAmount;
        $owner->total_credits += $rentAmount;
        $owner->save();

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
        ]);
    }

    public function gameProperties($id)
    {
        $game = Game::find($id);

        if (! $game) {
            return response()->json([
                'message' => 'Game not found',
            ], 404);
        }

        $properties = Property::with('tile')
            ->get()
            ->map(function ($property) use ($id) {
                $gameProperty = GameProperty::with('owner')
                    ->where('game_id', $id)
                    ->where('property_id', $property->id)
                    ->first();

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
}