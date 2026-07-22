<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    protected $fillable = [
        'tile_id',
        'question_text',
        'question_type',
        'difficulty',
        'credits',

        'option_a',
        'option_b',
        'option_c',
        'option_d',

        'correct_answer',
        'expected_answer',
        'rubric',
        'max_score',
    ];

    public function tile()
    {
        return $this->belongsTo(Tile::class);
    }
}