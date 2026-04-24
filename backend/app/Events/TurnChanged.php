<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class TurnChanged implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $gameId;
    public int $turnNumber;
    public $currentTurnUserId;
    public $currentTurnUserName;

    public function __construct(int $gameId, int $turnNumber, $currentTurnUserId, $currentTurnUserName)
    {
        $this->gameId = $gameId;
        $this->turnNumber = $turnNumber;
        $this->currentTurnUserId = $currentTurnUserId;
        $this->currentTurnUserName = $currentTurnUserName;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('game.' . $this->gameId);
    }

    public function broadcastAs()
    {
        return 'turn.changed';
    }

    public function broadcastWith()
    {
        return [
            'game_id' => $this->gameId,
            'turn_number' => $this->turnNumber,
            'current_turn_user_id' => $this->currentTurnUserId,
            'current_turn_user_name' => $this->currentTurnUserName,
        ];
    }
}