<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class RentPaid implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $gameId;
    public int $tenantUserId;
    public string $tenantUserName;
    public int $ownerUserId;
    public string $ownerUserName;
    public int $rentAmount;
    public string $propertyName;
    public int $tenantCredits;
    public int $ownerCredits;

    public function __construct(
        int $gameId,
        int $tenantUserId,
        string $tenantUserName,
        int $ownerUserId,
        string $ownerUserName,
        int $rentAmount,
        string $propertyName,
        int $tenantCredits,
        int $ownerCredits
    ) {
        $this->gameId = $gameId;
        $this->tenantUserId = $tenantUserId;
        $this->tenantUserName = $tenantUserName;
        $this->ownerUserId = $ownerUserId;
        $this->ownerUserName = $ownerUserName;
        $this->rentAmount = $rentAmount;
        $this->propertyName = $propertyName;
        $this->tenantCredits = $tenantCredits;
        $this->ownerCredits = $ownerCredits;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('game.' . $this->gameId);
    }

    public function broadcastAs()
    {
        return 'rent.paid';
    }

    public function broadcastWith()
    {
        return [
            'game_id' => $this->gameId,
            'tenant_user_id' => $this->tenantUserId,
            'tenant_user_name' => $this->tenantUserName,
            'owner_user_id' => $this->ownerUserId,
            'owner_user_name' => $this->ownerUserName,
            'rent_amount' => $this->rentAmount,
            'property_name' => $this->propertyName,
            'tenant_credits' => $this->tenantCredits,
            'owner_credits' => $this->ownerCredits,
        ];
    }
}
