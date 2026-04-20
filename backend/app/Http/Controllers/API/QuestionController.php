<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Tile;
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
}
