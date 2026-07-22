<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\GamePlayer;
use Illuminate\Http\Request;

class LeaderboardController extends Controller
{
    public function show(Request $request, $id)
    {
        $user = $request->user();

        $game = Game::with('currentTurnUser')->find($id);

        if (! $game) {
            return response()->json([
                'message' => 'Game not found',
            ], 404);
        }

        $isParticipant = GamePlayer::where('game_id', $game->id)
            ->where('user_id', $user->id)
            ->exists();

        if (! $isParticipant && $game->host_id !== $user->id) {
            return response()->json([
                'message' => 'You are not part of this game',
            ], 403);
        }

        $players = GamePlayer::with('user')
            ->where('game_id', $id)
            ->orderByDesc('total_credits')
            ->orderByDesc('credits')
            ->get();

        $leaderboard = $players->values()->map(function ($player, $index) {
            return [
                'rank' => $index + 1,
                'user_id' => $player->user_id,
                'user_name' => $player->user ? $player->user->name : 'Unknown',
                'email' => $player->user ? $player->user->email : null,
                'credits' => $player->credits,
                'total_credits' => $player->total_credits,
                'position' => $player->position,
                'last_property_bought_turn' => $player->last_property_bought_turn,
                'last_question_answered_turn' => $player->last_question_answered_turn,
                'last_card_scanned_turn' => $player->last_card_scanned_turn,
            ];
        });

        return response()->json([
            'game_id' => $game->id,
            'game_code' => $game->game_code,
            'status' => $game->status,
            'turn_number' => $game->turn_number,
            'current_turn_user_id' => $game->current_turn_user_id,
            'current_turn_user_name' => $game->currentTurnUser?->name,
            'last_dice_roll' => $game->last_dice_roll,
            'leaderboard' => $leaderboard,
        ]);
    }
}
