<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Card extends Model
{
    use HasFactory;

    protected $fillable = [
        'card_code',
        'card_type',
        'title',
        'description',
        'effect_type',
        'effect_value',
        'target_tile_number',
        'is_active',
    ];
}