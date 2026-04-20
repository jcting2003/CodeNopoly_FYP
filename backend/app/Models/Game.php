<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Game extends Model
{
    use HasFactory;

    protected $fillable = [
        'host_id',
        'game_code',
        'status',
        'started_at',
        'ended_at',
    ];

    public function host(){
        return $this->belongsTo(User::class,'host_id');

    }

    public function players(){
        return $this->hasMany(GamePlayer::class);
    }
}
