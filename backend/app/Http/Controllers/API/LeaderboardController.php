<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\GamePlayer;
use Illuminate\Http\Request;

class LeaderboardController extends Controller
{
    public function show($id)
    {
        $game = Game::find($id);

        if (! $game) {
            return response()->json([
                'message' => 'Game not found',
            ], 404);
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
                'name' => $player->user ? $player->user->name : 'Unknown',
                'email' => $player->user ? $player->user->email : null,
                'credits' => $player->credits,
                'total_credits' => $player->total_credits,
                'position' => $player->position,
            ];
        });

        return response()->json([
            'game_id' => $game->id,
            'game_code' => $game->game_code,
            'status' => $game->status,
            'leaderboard' => $leaderboard,
        ]);
    }
}