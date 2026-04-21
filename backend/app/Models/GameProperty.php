<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GameProperty extends Model
{
    use HasFactory;

    protected $fillable = [
        'game_id',
        'property_id',
        'owner_user_id',
        'houses',
        'has_hotel',
        'purchased_at',
    ];

    public function property()
    {
        return $this->belongsTo(Property::class);
    }

    public function game()
    {
        return $this->belongsTo(Game::class);
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'owner_user_id');
    }

}
