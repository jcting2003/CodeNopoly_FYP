<?php

use App\Models\GamePlayer;
use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('game.{gameId}', function (User $user, int $gameId) {
    return GamePlayer::where('game_id', $gameId)
        ->where('user_id', $user->id)
        ->exists();
});