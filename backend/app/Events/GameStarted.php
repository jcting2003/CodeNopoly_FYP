<?php

namespace App\Events;

use App\Models\Game;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class GameStarted implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public Game $game;

    public function __construct(Game $game)
    {
        $this->game = $game;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('game.' . $this->game->id);
    }

    public function broadcastAs()
    {
        return 'game.started';
    }

    public function broadcastWith()
    {
        return [
            'game_id' => $this->game->id,
            'status' => $this->game->status,
            'current_turn_user_id' => $this->game->current_turn_user_id,
            'turn_number' => $this->game->turn_number,
        ];
    }
}