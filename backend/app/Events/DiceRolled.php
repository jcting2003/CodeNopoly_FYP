<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DiceRolled implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $gameId;
    public int $userId;
    public string $userName;
    public int $diceValue;
    public int $newPosition;

    public function __construct(int $gameId, int $userId, string $userName, int $diceValue, int $newPosition)
    {
        $this->gameId = $gameId;
        $this->userId = $userId;
        $this->userName = $userName;
        $this->diceValue = $diceValue;
        $this->newPosition = $newPosition;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('game.' . $this->gameId);
    }

    public function broadcastAs()
    {
        return 'dice.rolled';
    }

    public function broadcastWith()
    {
        return [
            'game_id' => $this->gameId,
            'user_id' => $this->userId,
            'user_name' => $this->userName,
            'dice_value' => $this->diceValue,
            'new_position' => $this->newPosition,
        ];
    }
}