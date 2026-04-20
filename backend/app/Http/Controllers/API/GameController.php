<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\GamePlayer;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class GameController extends Controller
{
    public function store(Request $request){
        $user = $request->user();
        $game = Game::create([
            'host_id' => $user -> id,
            'game_code' => strtoupper(Str::random(6)),
            'status' => 'waiting',

        ]);

        GamePlayer::create([
            'game_id' => $game->id,
            'user_id' => $user->id,
            'credits' => 100,
            'total_credits' => 100,
            'joined_at' => now(),
        ]);

        return response()->json([
            'message' => 'Game created successfully',
            'game' => $game,
        ], 201);
    }

    public function join(Request $request){
        $fields = $request->validate([
            'game_code' => 'required|string|exists:games,game_code',
        ]);

        $user = $request->user();
        $game = Game::where('game_code', $fields['game_code'])->first();

        if($game->status !== 'waiting'){
            return response()->json([
                'message' => 'This game is no longer open for joining',
            ], 400);
        }

        $alreadyJoined = GamePlayer::where('game_id', $game->id)
            ->where('user_id', $user->id)
            ->exists();

        if($alreadyJoined){
            return response()->json([
                'message' => 'You have already joined this game',
            ], 400);
        }

        GamePlayer::create([
            'game_id' => $game->id,
            'user_id' => $user->id,
            'credits' => 100,
            'total_credits' => 100,
            'joined_at' => now(),
        ]);

        return response()->json([
            'message' => 'Joined game successfully',
            'game' => $game,
        ]);
    }

    public function player($id){
        $game = Game::with('players.user')->find($id);

        if(!$game){
            return response()->json([
                'message' => 'Game not found',
            ], 404);
        }

        return response()->json([
            'game' => $game,
            'game_code' => $game-> game_code,
            'status' => $game->status,
            'players' => $game->players,
        ]);
    }
}
