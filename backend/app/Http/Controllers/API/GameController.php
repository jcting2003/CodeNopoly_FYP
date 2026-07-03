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
use App\Models\Tile;

class GameController extends Controller
{
    private const GO_REWARD = 100;

    public function store(Request $request){
        $fields = $request->validate([
            'join_as_player' => 'sometimes|boolean',
        ]);

        $user = $request -> user();

        $game = Game::create([
            'host_id' => $user->id,
            'game_code' => strtoupper(Str::random(6)),
            'status' => 'waiting',
        ]);

        if ((bool) ($fields['join_as_player'] ?? false)){
            GamePlayer::create([
                'game_id' => $game->id,
                'user_id' => $user->id,
                'credits' => 100,
                'total_credits' => 100,
                'joined_at' => now(),
            ]);
        }

        event(new LobbyPlayersUpdated(
            $game -> id,
            $this -> buildLobbyPlayersPayload($game->id)
        ));

        return response()->json([
            'message' => 'Game created successfully',
            'game' => [
                'id' => $game->id,
                'game_code' => $game->game_code,
                'status' => $game->status,
                'host_id' => $game->host_id,
                'host_joined_as_player' => (bool) ($fields['join_as_player'] ?? false),
                'started_at' => $game->started_at,
                'ended_at' => $game->ended_at,
            ],
        ], 201);
    }

    public function join(Request $request)
    {
        $fields = $request->validate([
            'game_code' => 'required|string',
        ]);

        $user = $request->user();

        $gameCode = strtoupper(trim($fields['game_code']));

        $game = Game::where('game_code', $gameCode)->first();

        if (! $game) {
            return response()->json([
                'message' => 'Game not found',
            ], 404);
        }

        $alreadyJoined = GamePlayer::where('game_id', $game->id)
            ->where('user_id', $user->id)
            ->exists();

        if ($alreadyJoined) {
            return response()->json([
                'message' => 'You are already in this game',
                'already_joined' => true,
                'game' => [
                    'id' => $game->id,
                    'game_code' => $game->game_code,
                    'status' => $game->status,
                    'host_id' => $game->host_id,
                    'started_at' => $game->started_at,
                    'ended_at' => $game->ended_at,
                ],
            ]);
        }

        if ($game->status !== 'waiting') {
            return response()->json([
                'message' => 'This game is no longer open for joining',
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
            'already_joined' => false,
            'game' => [
                'id' => $game->id,
                'game_code' => $game->game_code,
                'status' => $game->status,
                'host_id' => $game->host_id,
                'started_at' => $game->started_at,
                'ended_at' => $game->ended_at,
            ],
        ]);
    }

    public function player(Request $request, int $id){
        $game = Game::with('players.user')->find($id);

        if(!$game){
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
                'message' => 'You are not allowed to view this game',
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
            'players' => $game->players->map(function ($player) use ($game) {
                return [
                    'id' => $player->user_id,
                    'user_id' => $player->user_id,

                    'name' => $player->user?->name ?? 'Unknown Player',
                    'user_name' => $player->user?->name ?? 'Unknown Player',

                    'email' => $player->user?->email,
                    'status' => 'CONNECTED',
                    'is_host' => $player->user_id === $game->host_id,
                    'joined_at' => $player->joined_at,

                    'credits' => $player->credits,
                    'total_credits' => $player->total_credits,
                    'position' => $player->position,
                ];
            })->values(),
        ]);
    }

    public function start(Request $request, int $id)
    {
        $user = $request->user();

        $game = Game::with('players')->find($id);

        if (! $game) {
            return response()->json([
                'message' => 'Game not found',
            ], 404);
        }

        if ($game->players->count() < 2) {
            return response()->json([
                'message' => 'At least 2 players are required to start the game',
            ], 400);
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

    public function endGame(Request $request, int $id)
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

    public function currentTurn(Request $request,int $id)
    {
        $game = Game::with('currentTurnUser')->find($id);

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
                'message' => 'You are not allowed to view this game',
            ], 403);
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

    public function rollDice(Request $request, int $id)
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

        $gamePlayer = GamePlayer::where('game_id', $game->id)
            ->where('user_id', $user->id)
            ->first();

        if (! $gamePlayer) {
            return response()->json([
                'message' => 'Player is not part of this game',
            ], 404);
        }

        // Prevent rolling more than once in the same turn
        if ($game->last_dice_roll !== null) {
            return response()->json([
                'message' => 'You have already rolled this turn',
            ], 400);
        }

        $diceOne = random_int(1, 6);
        $diceTwo = random_int(1, 6);
        $diceRoll = $diceOne + $diceTwo;


        $oldPosition = (int) ($gamePlayer->position ?? 0);
        $rawPosition = $oldPosition + $diceRoll;
        $newPosition = $rawPosition % 40;

        // Grant GO reward when passing or landing on GO
        if ($rawPosition >= 40) {
            $gamePlayer->credits += self::GO_REWARD;
            $gamePlayer->total_credits += self::GO_REWARD;
        }

        $gamePlayer->position = $newPosition;

        // If player lands on Go To Jail (tile 30), send them to Jail (tile 10)
        // and make them skip 1 round
        if ($newPosition === 30) {
            $gamePlayer->position = 10;
            $gamePlayer->skip_turns = 1;
        }

        $gamePlayer->save();

        $game->last_dice_roll = $diceRoll;
        $game->save();

        $tile = Tile::where('tile_number', $gamePlayer->position)->first();

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
            'tile_name' => $tile?->tile_name,
            'tile_type' => $tile?->tile_type,
            'user_id' => $user->id,
        ]);
    }

    public function endTurn(Request $request, int $id)
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

        $gamePlayer = GamePlayer::where('game_id', $game->id)
            ->where('user_id', $user->id)
            ->first();

        if (! $gamePlayer) {
            return response()->json([
                'message' => 'Player is not part of this game',
            ], 404);
        }

        if ($game->last_dice_roll === null) {
            return response()->json([
                'message' => 'You must roll the dice before ending your turn',
            ], 422);
        }

        $currentTile = Tile::where('tile_number', $gamePlayer->position)->first();

        if (
            $currentTile &&
            in_array($currentTile->tile_type, ['chance', 'community_chest']) &&
            (
                $gamePlayer->last_card_scanned_turn === null ||
                (int) $gamePlayer->last_card_scanned_turn !== (int) $game->turn_number
            )
        ) {
            return response()->json([
                'message' => 'You must draw a card before ending your turn',
                'tile_type' => $currentTile->tile_type,
            ], 422);
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

        $playerCount = $players->count();
        $nextPlayer = null;

        for ($step = 1; $step <= $playerCount; $step++) {
            $candidateIndex = ($currentIndex + $step) % $playerCount;
            $candidate = $players[$candidateIndex];

            if (($candidate->skip_turns ?? 0) > 0) {
                $candidate->skip_turns = max(0, $candidate->skip_turns - 1);
                $candidate->save();
                continue;
            }

            $nextPlayer = $candidate;
            break;
        }

        if (! $nextPlayer) {
            return response()->json([
                'message' => 'No eligible next player found',
            ], 400);
        }

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

        $leaderboard = $this->buildLeaderboardPayload($game->id);

        event(new LeaderboardUpdated(
            $game->id,
            $leaderboard
        ));

        return response()->json([
            'message' => 'Turn ended successfully',
            'next_turn_user_id' => $nextPlayer->user_id,
            'next_turn_user_name' => $nextPlayer->user?->name,
            'current_turn_user_id' => $nextPlayer->user_id,
            'current_turn_user_name' => $nextPlayer->user?->name,
            'turn_number' => $game->turn_number,
            'last_dice_roll' => $game->last_dice_roll,
            'leaderboard' => $leaderboard,
        ]);
    }

    public function show(Request $request, int $id)
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
                'message' => 'You are not allowed to view this game',
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

        $games = Game::query()
            ->where(function ($query) use ($user) {
                $query->where('host_id', $user->id)
                    ->orWhereHas('players', function ($playerQuery) use ($user) {
                        $playerQuery->where('user_id', $user->id);
                    });
            })
            ->with([
                'host:id,name',
                'players' => function ($query) use ($user) {
                    $query->where('user_id', $user->id);
                },
            ])
            ->latest()
            ->get()
            ->map(function ($game) use ($user) {
                $playerRecord = $game->players->first();

                return [
                    'id' => $game->id,
                    'game_code' => $game->game_code,
                    'status' => $game->status,
                    'host_id' => $game->host_id,
                    'host_name' => $game->host?->name,
                    'is_host' => $game->host_id === $user->id,
                    'credits' => $playerRecord?->credits ?? 0,
                    'total_credits' => $playerRecord?->total_credits ?? 0,
                    'position' => $playerRecord?->position,
                    'started_at' => $game->started_at,
                    'ended_at' => $game->ended_at,
                    'created_at' => $game->created_at,
                ];
            });

        return response()->json([
            'games' => $games,
        ]);
    }

    public function tileByNumber(Request $request, int $id, int $tileNumber)
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
                'message' => 'You are not allowed to view this game',
            ], 403);
        }

        $tile = Tile::where('tile_number', $tileNumber)->first();

        if (! $tile) {
            return response()->json([
                'message' => 'Tile not found',
            ], 404);
        }

        return response()->json([
            'tile' => [
                'id' => $tile->id,
                'tile_number' => $tile->tile_number,
                'tile_name' => $tile->tile_name,
                'tile_type' => $tile->tile_type,
                'nfc_value' => $tile->nfc_value,
                'difficulty' => $tile->difficulty,
            ],
        ]);
    }

    private function buildLobbyPlayersPayload($gameId)
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
                    'id' => $player->user_id,
                    'user_id' => $player->user_id,

                    'name' => $player->user?->name ?? 'Unknown Player',
                    'user_name' => $player->user?->name ?? 'Unknown Player',

                    'email' => $player->user?->email,
                    'status' => 'CONNECTED',
                    'is_host' => $player->user_id === $game->host_id,

                    'joined_at' => $player->joined_at,
                    'credits' => $player->credits,
                    'total_credits' => $player->total_credits,
                    'position' => $player->position,
                ];
            })
            ->toArray();
    }

    private function buildLeaderboardPayload($gameId)
    {
        return GamePlayer::with('user')
            ->where('game_id', $gameId)
            ->orderByDesc('total_credits')
            ->orderByDesc('credits')
            ->get()
            ->values()
            ->map(function ($player, $index) {
                return [
                    'rank' => $index + 1,
                    'user_id' => $player->user_id,
                    'user_name' => $player->user?->name ?? 'Unknown',
                    'credits' => $player->credits,
                    'total_credits' => $player->total_credits,
                    'position' => $player->position,
                    'last_property_bought_turn' => $player->last_property_bought_turn,
                    'last_question_answered_turn' => $player->last_question_answered_turn,
                    'last_card_scanned_turn' => $player->last_card_scanned_turn,
                ];
            })
            ->toArray();
    }

}
