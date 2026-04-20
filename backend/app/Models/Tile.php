<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tile extends Model
{
    use HasFactory;

    protected $fillable = [
        'tile_number',
        'tile_name',
        'nfc_value',
        'tile_type',
        'difficulty',
    ];

    public function questions(){
        return $this->hasMany(Question::class);
    }
}
