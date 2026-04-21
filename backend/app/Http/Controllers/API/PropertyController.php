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

        $gameProperty = GameProperty::firstOrCreate(
            [
                'game_id' => $fields['game_id'],
                'property_id' => $fields['property_id'],
            ],
            [
                'owner_user_id' => null,
                'houses' => 0,
                'has_hotel' => false,
                'purchased_at' => null,
            ]
        );

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

        $gameProperty->owner_user_id = $user->id;
        $gameProperty->purchased_at = now();
        $gameProperty->save();

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

        $gamePlayer->credits -= $property->house_cost;
        $gamePlayer->save();

        $gameProperty->houses += 1;
        $gameProperty->save();

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

        $gameProperty->houses = 0;
        $gameProperty->has_hotel = true;
        $gameProperty->save();

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

        $tenant->credits -= $rentAmount;
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

        $properties = \App\Models\GameProperty::with(['property.tile', 'owner'])
            ->where('game_id', $id)
            ->get()
            ->map(function ($gameProperty) {
                return [
                    'game_property_id' => $gameProperty->id,
                    'property_id' => $gameProperty->property_id,
                    'tile_id' => $gameProperty->property ? $gameProperty->property->tile_id : null,
                    'tile_name' => $gameProperty->property && $gameProperty->property->tile
                        ? $gameProperty->property->tile->tile_name
                        : null,
                    'property_name' => $gameProperty->property ? $gameProperty->property->property_name : null,
                    'color_group' => $gameProperty->property ? $gameProperty->property->color_group : null,
                    'cost' => $gameProperty->property ? $gameProperty->property->cost : null,
                    'house_cost' => $gameProperty->property ? $gameProperty->property->house_cost : null,
                    'hotel_cost' => $gameProperty->property ? $gameProperty->property->hotel_cost : null,
                    'rent' => $gameProperty->property ? $gameProperty->property->rent : null,
                    'rent_1_house' => $gameProperty->property ? $gameProperty->property->rent_1_house : null,
                    'rent_2_houses' => $gameProperty->property ? $gameProperty->property->rent_2_houses : null,
                    'rent_3_houses' => $gameProperty->property ? $gameProperty->property->rent_3_houses : null,
                    'rent_4_houses' => $gameProperty->property ? $gameProperty->property->rent_4_houses : null,
                    'rent_hotel' => $gameProperty->property ? $gameProperty->property->rent_hotel : null,
                    'owner_user_id' => $gameProperty->owner_user_id,
                    'owner_name' => $gameProperty->owner ? $gameProperty->owner->name : null,
                    'houses' => $gameProperty->houses,
                    'has_hotel' => $gameProperty->has_hotel,
                    'purchased_at' => $gameProperty->purchased_at,
                ];
            });

        return response()->json([
            'game_id' => $game->id,
            'game_code' => $game->game_code,
            'status' => $game->status,
            'properties' => $properties,
        ]);
    }
}