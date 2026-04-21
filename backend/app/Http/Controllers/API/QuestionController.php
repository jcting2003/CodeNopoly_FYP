<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Tile;
use App\Models\Question;
use App\Models\GamePlayer;
use App\Models\PlayerAnswer;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    public function scanTile(Request $request){
        $fields = $request->validate([
            'nfc_value' => 'required|string|exists:tiles,nfc_value',
        ]);

        $tile = Tile::with('questions')->where('nfc_value', $fields['nfc_value'])->first();

        if(!$tile){
            return response()-> json([
                'message' => 'Tile not found',
            ],400);
        }

        $question = $tile->questions()->inRandomOrder()->first();

        if(!$question){
            return response() -> json([
                'message' => 'No question found for this tile',
            ],400);
        }

        return response()->json([
            'message' => 'Question retrieved successfully',
            'tile' => [
                'id' => $tile->id,
                'tile_number' => $tile->tile_number,
                'tile_name' => $tile->tile_name,
                'nfc_value' => $tile->nfc_value,
                'tile_type' => $tile->tile_type,
                'difficulty' => $tile->difficulty,
            ],
            'question' => [
                'id' => $question->id,
                'question_text' => $question->question_text,
                'option_a' => $question->option_a,
                'option_b' => $question->option_b,
                'option_c' => $question->option_c,
                'option_d' => $question->option_d,
                'credits' => $question->credits,
                'difficulty' => $question->difficulty,
            ],
        ]);
    }

    public function submitAnswer(Request $request, $id)
    {
        $fields = $request->validate([
            'game_id' => 'required|exists:games,id',
            'selected_answer' => 'required|string',
        ]);

        $user = $request->user();

        $question = \App\Models\Question::find($id);

        if (!$question) {
            return response()->json([
                'message' => 'Question not found',
            ], 404);
        }

        $gamePlayer = \App\Models\GamePlayer::where('game_id', $fields['game_id'])
            ->where('user_id', $user->id)
            ->first();

        if (!$gamePlayer) {
            return response()->json([
                'message' => 'Player is not part of this game',
            ], 404);
        }

        $selectedAnswer = strtoupper(trim($fields['selected_answer']));
        $correctAnswer = strtoupper(trim($question->correct_answer));

        $isCorrect = $selectedAnswer === $correctAnswer;
        $earnedCredits = $isCorrect ? $question->credits :0;

        \App\Models\PlayerAnswer::create([
            'game_id' => $fields['game_id'],
            'user_id' => $user->id,
            'question_id' => $question->id,
            'selected_answer' => $selectedAnswer,
            'is_correct' => $isCorrect,
            'earned_credits' => $earnedCredits,
            'answered_at' => now(),
        ]);

        if ($isCorrect) {
            $gamePlayer->credits = ($gamePlayer->credits ?? 0) + $earnedCredits;
            $gamePlayer->total_credits = ($gamePlayer->total_credits ?? 0) + $earnedCredits;
            $gamePlayer->save();
        }

        return response()->json([
            'message' => 'Answer submitted successfully',
            'is_correct' => $isCorrect,
            'correct_answer' => $question->correct_answer,
            'earned_credits' => $earnedCredits,
            'current_credits' => $gamePlayer->credits,
            'total_credits' => $gamePlayer->total_credits,
        ]);
    }
}
