<?php

use App\Models\Game;
use App\Models\GamePlayer;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('game.{gameId}', function ($user, $gameId) {
    $isHost = Game::where('id', $gameId)
        ->where('host_id', $user->id)
        ->exists();

    $isPlayer = GamePlayer::where('game_id', $gameId)
        ->where('user_id', $user->id)
        ->exists();

    return $isHost || $isPlayer;
});