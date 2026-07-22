<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    use HasFactory;

    private const NON_UPGRADABLE_GROUPS = ['railroad', 'utility'];

    public $timestamps = false;

    protected $fillable = [
        'tile_id',
        'property_name',
        'cost',
        'house_cost',
        'hotel_cost',
        'rent',
        'rent_1_house',
        'rent_2_houses',
        'rent_3_houses',
        'rent_4_houses',
        'rent_hotel',
        'color_group',
    ];

    public function tile(){
        return $this->belongsTo(Tile::class);
    }

    public function gameProperties()
    {
        return $this->hasMany(GameProperty::class);
    }

    public function supportsUpgrades(): bool
    {
        return ! in_array($this->color_group, self::NON_UPGRADABLE_GROUPS, true)
            && (int) $this->house_cost > 0
            && (int) $this->hotel_cost > 0;
    }
}
