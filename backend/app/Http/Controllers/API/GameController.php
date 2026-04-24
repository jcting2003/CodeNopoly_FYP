<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Events\DiceRolled;
use App\Events\GameEnded;
use App\Events\GameStarted;
use App\Events\LeaderboardUpdated;
use App\Events\LobbyPlayersUpdated;
use App\Events\TurnChanged;
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

        event(new LobbyPlayersUpdated(
            $game->id,
            $this->buildLobbyPlayersPayload($game->id)
        ));

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

        event(new LobbyPlayersUpdated(
            $game->id,
            $this->buildLobbyPlayersPayload($game->id)
        ));

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

    public function start(Request $request, $id)
    {
        $user = $request->user();

        $game = Game::with('players')->find($id);

        if (! $game) {
            return response()->json([
                'message' => 'Game not found',
            ], 404);
        }

        if ($game->host_id !== $user->id) {
            return response()->json([
                'message' => 'Only the host can start the game',
            ], 403);
        }

        if ($game->status !== 'waiting') {
            return response()->json([
                'message' => 'Game cannot be started',
            ], 400);
        }

        $firstPlayer = GamePlayer::with('user')
            ->where('game_id', $game->id)
            ->orderBy('joined_at')
            ->first();

        if (! $firstPlayer) {
            return response()->json([
                'message' => 'No players found in this game',
            ], 400);
        }

        $game->status = 'started';
        $game->started_at = now();
        $game->current_turn_user_id = $firstPlayer->user_id;
        $game->turn_number = 1;
        $game->last_dice_roll = null;
        $game->save();

        event(new GameStarted($game));

        event(new TurnChanged(
            $game->id,
            $game->turn_number,
            $game->current_turn_user_id,
            $firstPlayer->user?->name
        ));

        event(new LeaderboardUpdated(
            $game->id,
            $this->buildLeaderboardPayload($game->id)
        ));

        return response()->json([
            'message' => 'Game started successfully',
            'game' => $game,
            'current_turn_user_id' => $game->current_turn_user_id,
        ]);
    }

    public function endGame(Request $request, $id)
    {
        $game = Game::find($id);

        if (! $game) {
            return response()->json([
                'message' => 'Game not found',
            ], 404);
        }

        if ($game->host_id !== $request->user()->id) {
            return response()->json([
                'message' => 'Only the host can end the game',
            ], 403);
        }

        if ($game->status === 'ended') {
            return response()->json([
                'message' => 'Game is already ended',
            ], 400);
        }

        $game->status = 'ended';
        $game->ended_at = now();
        $game->save();

        event(new GameEnded(
            $game->id,
            $game->status
        ));

        event(new LeaderboardUpdated(
            $game->id,
            $this->buildLeaderboardPayload($game->id)
        ));

        return response()->json([
            'message' => 'Game ended successfully',
            'game' => [
                'id' => $game->id,
                'game_code' => $game->game_code,
                'status' => $game->status,
                'ended_at' => $game->ended_at,
            ],
        ]);
    }

    public function currentTurn($id)
    {
        $game = Game::with('currentTurnUser')->find($id);

        if (! $game) {
            return response()->json([
                'message' => 'Game not found',
            ], 404);
        }

        return response()->json([
            'game_id' => $game->id,
            'status' => $game->status,
            'turn_number' => $game->turn_number,
            'last_dice_roll' => $game->last_dice_roll,
            'current_turn_user_id' => $game->current_turn_user_id,
            'current_turn_user_name' => $game->currentTurnUser?->name,
        ]);
    }

    public function rollDice(Request $request, $id)
    {
        $user = $request->user();

        $game = Game::find($id);

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

        // Prevent rolling more than once in the same turn
        if ($game->last_dice_roll !== null) {
            return response()->json([
                'message' => 'You have already rolled this turn',
            ], 400);
        }

        $gamePlayer = GamePlayer::where('game_id', $game->id)
            ->where('user_id', $user->id)
            ->first();

        if (! $gamePlayer) {
            return response()->json([
                'message' => 'Player is not part of this game',
            ], 404);
        }

        $diceOne = random_int(1, 6);
        $diceTwo = random_int(1, 6);
        $diceRoll = $diceOne + $diceTwo;

        $gamePlayer->position = ($gamePlayer->position + $diceRoll) % 40;
        $gamePlayer->save();

        $game->last_dice_roll = $diceRoll;
        $game->save();

        event(new DiceRolled(
            $game->id,
            $user->id,
            $user->name,
            $diceRoll,
            $gamePlayer->position
        ));

        event(new LeaderboardUpdated(
            $game->id,
            $this->buildLeaderboardPayload($game->id)
        ));

        return response()->json([
            'message' => 'Dice rolled successfully',
            'dice_one' => $diceOne,
            'dice_two' => $diceTwo,
            'dice_roll' => $diceRoll,
            'last_dice_roll' => $diceRoll,
            'current_position' => $gamePlayer->position,
            'new_position' => $gamePlayer->position,
            'user_id' => $user->id,
        ]);
    }

    public function endTurn(Request $request, $id)
    {
        $user = $request->user();

        $game = Game::find($id);

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

        if ($game->current_turn_user_id !== $user->id) {
            return response()->json([
                'message' => 'It is not your turn',
            ], 403);
        }

        $players = GamePlayer::with('user')
            ->where('game_id', $game->id)
            ->orderBy('joined_at')
            ->get();

        if ($players->isEmpty()) {
            return response()->json([
                'message' => 'No players found in this game',
            ], 400);
        }

        $currentIndex = $players->search(function ($player) use ($user) {
            return $player->user_id === $user->id;
        });

        if ($currentIndex === false) {
            return response()->json([
                'message' => 'Current player not found in turn order',
            ], 400);
        }

        $nextIndex = ($currentIndex + 1) % $players->count();
        $nextPlayer = $players[$nextIndex];

        $game->current_turn_user_id = $nextPlayer->user_id;
        $game->turn_number += 1;
        $game->last_dice_roll = null;
        $game->save();

        event(new TurnChanged(
            $game->id,
            $game->turn_number,
            $game->current_turn_user_id,
            $nextPlayer->user?->name
        ));

        event(new LeaderboardUpdated(
            $game->id,
            $this->buildLeaderboardPayload($game->id)
        ));

        return response()->json([
            'message' => 'Turn ended successfully',
            'next_turn_user_id' => $nextPlayer->user_id,
            'next_turn_user_name' => $nextPlayer->user?->name,
            'turn_number' => $game->turn_number,
        ]);
    }

    public function show(Request $request, $id)
    {
        $game = Game::find($id);

        if (! $game) {
            return response()->json([
                'message' => 'Game not found',
            ], 404);
        }

        $isPlayerInGame = GamePlayer::where('game_id', $game->id)
            ->where('user_id', $request->user()->id)
            ->exists();

        if (! $isPlayerInGame) {
            return response()->json([
                'message' => 'You are not part of this game',
            ], 403);
        }

        return response()->json([
            'game' => [
                'id' => $game->id,
                'host_id' => $game->host_id,
                'game_code' => $game->game_code,
                'status' => $game->status,
                'started_at' => $game->started_at,
                'ended_at' => $game->ended_at,
            ],
        ]);
    }

    public function myGames(Request $request)
    {
        $user = $request->user();

        $games = \App\Models\GamePlayer::with('game')
            ->where('user_id', $user->id)
            ->get()
            ->map(function ($gamePlayer) use ($user) {
                $game = $gamePlayer->game;

                if (! $game) {
                    return null;
                }

                return [
                    'game_id' => $game->id,
                    'game_code' => $game->game_code,
                    'status' => $game->status,
                    'is_host' => $game->host_id === $user->id,
                    'credits' => $gamePlayer->credits,
                    'total_credits' => $gamePlayer->total_credits,
                    'position' => $gamePlayer->position ?? null,
                    'created_at' => $game->created_at,
                    'started_at' => $game->started_at,
                    'ended_at' => $game->ended_at,
                ];
            })
            ->filter()
            ->values();

        return response()->json([
            'user_id' => $user->id,
            'games' => $games,
        ]);
    }

    protected function buildLobbyPlayersPayload(int $gameId): array
    {
        $game = Game::with('players.user')->find($gameId);

        if (! $game) {
            return [];
        }

        return $game->players
            ->sortBy('joined_at')
            ->values()
            ->map(function ($player) use ($game) {
                return [
                    'id' => $player->user?->id ?? $player->user_id,
                    'name' => $player->user?->name ?? ('Player ' . $player->user_id),
                    'status' => 'CONNECTED',
                    'is_host' => $player->user_id === $game->host_id,
                ];
            })
            ->toArray();
    }
}