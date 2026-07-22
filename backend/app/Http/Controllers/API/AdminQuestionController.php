<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AdminQuestionController extends Controller
{
    private int $maxQuestions = 84;

    public function index()
    {
        $questions = Question::with('tile')
            ->latest()
            ->get();

        return response()->json([
            'questions' => $questions,
            'current_total' => Question::count(),
            'maximum_allowed' => $this->maxQuestions,
        ]);
    }

    public function limitStatus()
    {
        $currentTotal = Question::count();
        $maximumAllowed = $this->maxQuestions;

        return response()->json([
            'current_total' => $currentTotal,
            'maximum_allowed' => $maximumAllowed,
            'can_add_question' => $currentTotal < $maximumAllowed,
            'message' => $currentTotal < $maximumAllowed
                ? 'Question creation is allowed.'
                : 'Question limit reached.',
        ]);
    }

    public function store(Request $request)
    {
        $currentTotal = Question::count();
        $maximumAllowed = $this->maxQuestions;

        if ($currentTotal >= $maximumAllowed) {
            return response()->json([
                'message' => 'Question limit reached. New question creation is blocked.',
                'current_total' => $currentTotal,
                'maximum_allowed' => $maximumAllowed,
            ], 403);
        }

        $fields = $request->validate([
            'tile_id' => ['required', 'exists:tiles,id'],
            'question_text' => ['required', 'string'],
            'question_type' => ['required', Rule::in(['mcq', 'structured'])],
            'difficulty' => ['required', Rule::in(['easy', 'intermediate', 'hard'])],
            'credits' => ['required', 'integer', 'min:0'],

            'option_a' => ['nullable', 'string'],
            'option_b' => ['nullable', 'string'],
            'option_c' => ['nullable', 'string'],
            'option_d' => ['nullable', 'string'],

            'correct_answer' => [
                'nullable',
                'required_if:question_type,mcq',
                'string',
            ],

            'expected_answer' => [
                'nullable',
                'required_if:question_type,structured',
                'string',
            ],

            'rubric' => [
                'nullable',
                'required_if:question_type,structured',
                'string',
            ],

            'max_score' => [
                'nullable',
                'required_if:question_type,structured',
                'integer',
                'min:1',
            ],
        ]);

        if ($fields['question_type'] === 'mcq') {
            $fields['expected_answer'] = null;
            $fields['rubric'] = null;
            $fields['max_score'] = 10;
        }

        if ($fields['question_type'] === 'structured') {
            $fields['option_a'] = null;
            $fields['option_b'] = null;
            $fields['option_c'] = null;
            $fields['option_d'] = null;
            $fields['correct_answer'] = null;
        }

        $question = Question::create($fields);

        return response()->json([
            'message' => 'Question added successfully',
            'question' => $question,
            'current_total' => $currentTotal + 1,
            'maximum_allowed' => $maximumAllowed,
        ], 201);
    }

    public function update(Request $request, Question $question)
    {
        $questionType = $request->input('question_type', $question->question_type);

        $fields = $request->validate([
            'tile_id' => ['sometimes', 'exists:tiles,id'],
            'question_text' => ['sometimes', 'string'],
            'question_type' => ['sometimes', Rule::in(['mcq', 'structured'])],
            'difficulty' => ['sometimes', Rule::in(['easy', 'intermediate', 'hard'])],
            'credits' => ['sometimes', 'integer', 'min:0'],

            'option_a' => ['nullable', 'string'],
            'option_b' => ['nullable', 'string'],
            'option_c' => ['nullable', 'string'],
            'option_d' => ['nullable', 'string'],

            'correct_answer' => [
                'nullable',
                Rule::requiredIf($questionType === 'mcq'),
                'string',
            ],

            'expected_answer' => [
                'nullable',
                Rule::requiredIf($questionType === 'structured'),
                'string',
            ],

            'rubric' => [
                'nullable',
                Rule::requiredIf($questionType === 'structured'),
                'string',
            ],

            'max_score' => [
                'nullable',
                Rule::requiredIf($questionType === 'structured'),
                'integer',
                'min:1',
            ],
        ]);

        if ($questionType === 'mcq') {
            $fields['expected_answer'] = null;
            $fields['rubric'] = null;
            $fields['max_score'] = 10;
        }

        if ($questionType === 'structured') {
            $fields['option_a'] = null;
            $fields['option_b'] = null;
            $fields['option_c'] = null;
            $fields['option_d'] = null;
            $fields['correct_answer'] = null;
        }

        $question->update($fields);

        return response()->json([
            'message' => 'Question updated successfully',
            'question' => $question,
        ]);
    }

    public function destroy(Question $question)
    {
        $question->delete();

        return response()->json([
            'message' => 'Question deleted successfully',
        ]);
    }
}