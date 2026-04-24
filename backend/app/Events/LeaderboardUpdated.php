<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LeaderboardUpdated implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $gameId;
    public array $leaderboard;

    public function __construct(int $gameId, array $leaderboard)
    {
        $this->gameId = $gameId;
        $this->leaderboard = $leaderboard;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('game.' . $this->gameId);
    }

    public function broadcastAs()
    {
        return 'leaderboard.updated';
    }

    public function broadcastWith()
    {
        return [
            'game_id' => $this->gameId,
            'leaderboard' => $this->leaderboard,
        ];
    }
}