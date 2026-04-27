<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Events\LeaderboardUpdated;
use App\Models\Tile;
use App\Models\Question;
use App\Models\GamePlayer;
use App\Models\PlayerAnswer;
use Illuminate\Http\Request;
use App\Models\Card;
use App\Models\Game;


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

    public function scanCard(Request $request, $id)
    {
        $fields = $request->validate([
            'card_code' => 'required|string|exists:cards,card_code',
        ]);

        $user = $request->user();

        $game = Game::find($id);

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
                'message' => 'Player not found in this game',
            ], 404);
        }

        $tile = Tile::where('tile_number', $gamePlayer->position)->first();

        if (! $tile) {
            return response()->json([
                'message' => 'Current tile not found',
            ], 404);
        }

        $card = Card::where('card_code', $fields['card_code'])
            ->where('is_active', true)
            ->first();

        if (! $card) {
            return response()->json([
                'message' => 'Card not found',
            ], 404);
        }

        if ($card->card_type === 'community_chest' && $tile->tile_type !== 'community_chest') {
            return response()->json([
                'message' => 'You are not on a Community Chest tile',
            ], 422);
        }

        if ($card->card_type === 'chance' && $tile->tile_type !== 'chance') {
            return response()->json([
                'message' => 'You are not on a Chance tile',
            ], 422);
        }

        $resultMessage = null;

        if ($card->effect_type === 'credits_add') {
            $gamePlayer->credits += $card->effect_value;
            $gamePlayer->total_credits += $card->effect_value;
            $gamePlayer->save();

            $resultMessage = 'Credits added successfully';
        } elseif ($card->effect_type === 'credits_deduct') {
            $gamePlayer->credits -= $card->effect_value;

            if ($gamePlayer->credits < 0) {
                $gamePlayer->credits = 0;
            }

            $gamePlayer->save();

            $resultMessage = 'Credits deducted successfully';
        } elseif ($card->effect_type === 'move_forward') {
            $newPosition = ($gamePlayer->position + $card->effect_value) % 40;
            $gamePlayer->position = $newPosition;
            $gamePlayer->save();

            $resultMessage = 'Player moved forward';
        } elseif ($card->effect_type === 'move_backward') {
            $newPosition = $gamePlayer->position - $card->effect_value;

            while ($newPosition < 0) {
                $newPosition += 40;
            }

            $gamePlayer->position = $newPosition;
            $gamePlayer->save();

            $resultMessage = 'Player moved backward';
        } elseif ($card->effect_type === 'move_to_tile') {
            $gamePlayer->position = $card->target_tile_number;
            $gamePlayer->save();

            $resultMessage = 'Player moved to target tile';
        } elseif ($card->effect_type === 'move_to_go') {
            $gamePlayer->position = 0;
            $gamePlayer->credits += 200;
            $gamePlayer->total_credits += 200;
            $gamePlayer->save();

            $resultMessage = 'Player moved to GO and collected reward';
        } else {
            return response()->json([
                'message' => 'Unsupported card effect type',
            ], 422);
        }

        return response()->json([
            'message' => 'Card scanned successfully',
            'card' => [
                'id' => $card->id,
                'card_code' => $card->card_code,
                'card_type' => $card->card_type,
                'title' => $card->title,
                'description' => $card->description,
                'effect_type' => $card->effect_type,
                'effect_value' => $card->effect_value,
                'target_tile_number' => $card->target_tile_number,
            ],
            'result' => [
                'message' => $resultMessage,
                'current_credits' => $gamePlayer->credits,
                'total_credits' => $gamePlayer->total_credits,
                'new_position' => $gamePlayer->position,
            ],
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
