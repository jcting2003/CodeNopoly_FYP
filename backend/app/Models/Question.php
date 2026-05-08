<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    use HasFactory;

    protected $fillable = [
        'tile_id',
        'question_type',
        'question_text',

        // MCQ fields
        'option_a',
        'option_b',
        'option_c',
        'option_d',
        'correct_answer',

        // Structured question fields
        'expected_answer',
        'rubric',
        'max_score',

        'credits',
        'difficulty',
    ];

    public function tile()
    {
        return $this->belongsTo(Tile::class);
    }
}