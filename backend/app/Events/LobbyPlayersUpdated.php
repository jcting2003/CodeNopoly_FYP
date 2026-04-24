<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LobbyPlayersUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $gameId;
    public array $players;

    public function __construct(int $gameId, array $players)
    {
        $this->gameId = $gameId;
        $this->players = $players;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('game.' . $this->gameId);
    }

    public function broadcastAs()
    {
        return 'lobby.players.updated';
    }

    public function broadcastWith()
    {
        return [
            'game_id' => $this->gameId,
            'players' => $this->players,
        ];
    }
}