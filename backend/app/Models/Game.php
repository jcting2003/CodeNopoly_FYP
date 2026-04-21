<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    use HasFactory;

    protected $fillable = [
        'host_id',
        'current_turn_user_id',
        'game_code',
        'status',
        'turn_number',
        'last_dice_roll',
        'started_at',
        'ended_at',
    ];

    public function host(){
        return $this->belongsTo(User::class,'host_id');

    }

    public function players(){
        return $this->hasMany(GamePlayer::class);
    }

    public function currentTurnUser()
    {
        return $this->belongsTo(User::class, 'current_turn_user_id');
    }
}
