<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PlayerAnswer extends Model
{
    use HasFactory;

    protected $fillable = [
        'game_id',
        'user_id',
        'question_id',
        'selected_answer',
        'is_correct',
        'earned_credits',
        'answered_at',
    ];
    protected function casts():array{
        return[
            'is_correct' => 'boolean',
            'answered_at' => 'datetime',
        ];
    }

    public function game(){
        return $this->belongsTo(User::class);
    }

    public function user(){
        return $this->belongsTo(User::class);
    }

    public function question(){
        return $this->belongsTo(Question::class);
    }
}
