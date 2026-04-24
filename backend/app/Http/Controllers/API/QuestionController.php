<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Events\LeaderboardUpdated;
use App\Models\Tile;
use App\Models\Question;
use App\Models\GamePlayer;
use App\Models\PlayerAnswer;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    public function scanTile(Request $request, $id)
    {
        $fields = $request->validate([
            'nfc_value' => 'required|string|exists:tiles,nfc_value',
        ]);

        $user = $request->user();

                $game = \App\Models\Game::find($id);

        if (! $game) {
            return response()->json([
                'message' => 'Game not found',
            ], 404);
        }

        if ($game->status !== 'started') {
            return response()->json([
                'message' => 'Game has not started yet',
            ], 400);
        }

        if ($game->current_turn_user_id !== $user->id) {
            return response()->json([
                'message' => 'It is not your turn',
            ], 403);
        }

        if ($game->last_dice_roll === null) {
            return response()->json([
                'message' => 'You must roll the dice before scanning a tile',
            ], 422);
        }

        $gamePlayer = GamePlayer::where('game_id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (! $gamePlayer) {
            return response()->json([
                'message' => 'Player is not part of this game',
            ], 404);
        }

        $tile = Tile::with('questions')
            ->where('nfc_value', $fields['nfc_value'])
            ->first();

        if (! $tile) {
            return response()->json([
                'message' => 'Tile not found',
            ], 404);
        }

        if ((int) $gamePlayer->position !== (int) $tile->tile_number) {
            return response()->json([
                'message' => 'Scanned tile does not match your current position',
                'expected_position' => $gamePlayer->position,
                'scanned_tile_number' => $tile->tile_number,
            ], 422);
        }

        if ($tile->tile_type !== 'question') {
            return response()->json([
                'message' => 'This tile does not contain a question',
                'tile' => [
                    'id' => $tile->id,
                    'tile_number' => $tile->tile_number,
                    'tile_name' => $tile->tile_name,
                    'tile_type' => $tile->tile_type,
                ],
            ], 422);
        }

        $question = $tile->questions()->inRandomOrder()->first();

        if (! $question) {
            return response()->json([
                'message' => 'No question found for this tile',
            ], 404);
        }

        $availableDifficulties = $tile->questions()
            ->select('difficulty')
            ->distinct()
            ->pluck('difficulty')
            ->values();

        if ($availableDifficulties->isEmpty()) {
            return response()->json([
                'message' => 'No question found for this tile',
            ], 404);
        }

        return response()->json([
            'message' => 'Tile verified successfully',
            'tile' => [
                'id' => $tile->id,
                'tile_number' => $tile->tile_number,
                'tile_name' => $tile->tile_name,
                'nfc_value' => $tile->nfc_value,
                'tile_type' => $tile->tile_type,
                'difficulty' => $tile->difficulty,
            ],
            'available_difficulties' => $availableDifficulties,
        ]);
    }

        public function getQuestionByDifficulty(Request $request, $id, $tileId)
    {
        $fields = $request->validate([
            'difficulty' => 'required|string|in:easy,intermediate,hard',
        ]);

        $user = $request->user();

        $game = \App\Models\Game::find($id);

        if (! $game) {
            return response()->json([
                'message' => 'Game not found',
            ], 404);
        }

        if ($game->status !== 'started') {
            return response()->json([
                'message' => 'Game has not started yet',
            ], 400);
        }

        if ($game->current_turn_user_id !== $user->id) {
            return response()->json([
                'message' => 'It is not your turn',
            ], 403);
        }

        $gamePlayer = GamePlayer::where('game_id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (! $gamePlayer) {
            return response()->json([
                'message' => 'Player is not part of this game',
            ], 404);
        }

        $tile = Tile::with('questions')->find($tileId);

        if (! $tile) {
            return response()->json([
                'message' => 'Tile not found',
            ], 404);
        }

        if ((int) $gamePlayer->position !== (int) $tile->tile_number) {
            return response()->json([
                'message' => 'Tile does not match player current position',
            ], 422);
        }

        $question = $tile->questions()
            ->where('difficulty', $fields['difficulty'])
            ->inRandomOrder()
            ->first();

        if (! $question) {
            return response()->json([
                'message' => 'No question found for this difficulty',
            ], 404);
        }

        $alreadyAnswered = PlayerAnswer::where('game_id', $id)
            ->where('user_id', $user->id)
            ->where('question_id', $question->id)
            ->exists();

        if ($alreadyAnswered) {
            return response()->json([
                'message' => 'You have already answered this question',
            ], 422);
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

    public function submitAnswer(Request $request, $id, $questionId)
    {
        $fields = $request->validate([
            'selected_answer' => 'required|string|in:A,B,C,D,a,b,c,d',
        ]);

        $user = $request->user();

        $question = Question::with('tile')->find($questionId);

        if (! $question) {
            return response()->json([
                'message' => 'Question not found',
            ], 404);
        }

        $gamePlayer = GamePlayer::where('game_id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (! $gamePlayer) {
            return response()->json([
                'message' => 'Player is not part of this game',
            ], 404);
        }

        if (! $question->tile || (int) $question->tile->tile_number !== (int) $gamePlayer->position) {
            return response()->json([
                'message' => 'Question does not match the player current tile',
            ], 422);
        }

        $alreadyAnswered = PlayerAnswer::where('game_id', $id)
            ->where('user_id', $user->id)
            ->where('question_id', $question->id)
            ->exists();

        if ($alreadyAnswered) {
            return response()->json([
                'message' => 'You have already answered this question',
            ], 422);
        }

        $selectedAnswer = strtoupper(trim($fields['selected_answer']));
        $correctAnswer = strtoupper(trim($question->correct_answer));

        $isCorrect = $selectedAnswer === $correctAnswer;
        $earnedCredits = $isCorrect ? $question->credits : 0;

        PlayerAnswer::create([
            'game_id' => $id,
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

        event(new LeaderboardUpdated(
            $id,
            $this->buildLeaderboardPayload($id)
        ));

        return response()->json([
            'message' => 'Answer submitted successfully',
            'is_correct' => $isCorrect,
            'earned_credits' => $earnedCredits,
            'current_credits' => $gamePlayer->credits,
            'total_credits' => $gamePlayer->total_credits,
        ]);
    }

        protected function buildLeaderboardPayload(int $gameId): array
    {
        return GamePlayer::with('user')
            ->where('game_id', $gameId)
            ->orderByDesc('total_credits')
            ->orderByDesc('credits')
            ->get()
            ->values()
            ->map(function ($player, $index) {
                return [
                    'rank' => $index + 1,
                    'user_id' => $player->user_id,
                    'user_name' => $player->user ? $player->user->name : 'Unknown',
                    'credits' => $player->credits,
                    'total_credits' => $player->total_credits,
                    'position' => $player->position,
                ];
            })
            ->toArray();
    }
}
