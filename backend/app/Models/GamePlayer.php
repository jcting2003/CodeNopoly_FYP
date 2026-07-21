<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GamePlayer extends Model
{
    use HasFactory;

    protected $fillable = [
        'game_id',
        'user_id',
        'credits',
        'total_credits',
        'position',
        'joined_at',
        'last_rent_paid_turn',
        'last_rent_paid_property_id',
        'last_hotel_purchase_turn',
        'last_property_bought_turn',
        'last_property_bought_property_id',
        'skip_turns',
        'last_question_answered_turn',
        'last_card_scanned_turn',
        'is_bankrupt',
        'bankrupt_at',
        'pending_rent_amount',
        'pending_rent_property_id',
        'pending_rent_owner_id',
    ];

    public function casts(): array{
        return[
            'joined_at' => 'datetime',
            'bankrupt_at' => 'datetime',
            'is_bankrupt' => 'boolean',
        ];
    }

    public function game(){
        return $this-> belongsTo(Game::class);
    }

    public function user(){
        return $this->belongsTo(User::class);
    }
}
