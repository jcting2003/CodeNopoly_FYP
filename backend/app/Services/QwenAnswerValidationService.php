<?php

namespace App\Services;

use App\Models\Question;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class QwenAnswerValidationService
{
    public function validateAnswer(Question $question, string $studentAnswer): array
    {
        $deterministicResult = $this->deterministicValidation($question, $studentAnswer);

        if ($deterministicResult !== null) {
            return $deterministicResult;
        }

        $baseUrl = rtrim(config('services.ollama.base_url'), '/');
        $model = config('services.ollama.model');
        $connectTimeout = (int) config('services.ollama.connect_timeout', 5);
        $timeout = (int) config('services.ollama.validation_timeout', 30);

        $prompt = $this->buildValidationPrompt($question, $studentAnswer);

        try {
            $response = Http::connectTimeout($connectTimeout)->timeout($timeout)->post($baseUrl . '/api/generate', [
                'model' => $model,
                'prompt' => $prompt,
                'stream' => false,
                'format' => 'json',
                'options' => [
                    'temperature' => 0,
                    'top_p' => 0.2,
                ],
            ]);

            if (! $response->successful()) {
                Log::error('Qwen validation HTTP failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return $this->fallbackValidationResult('AI validation service failed to respond.');
            }

            $aiText = $response->json('response');

            if (! is_string($aiText) || trim($aiText) === '') {
                Log::error('Qwen returned empty validation response', [
                    'response' => $response->json(),
                ]);

                return $this->fallbackValidationResult('AI validation returned an empty response.');
            }

            $result = json_decode($aiText, true);

            if (! is_array($result)) {
                Log::error('Qwen returned invalid validation JSON', [
                    'raw_response' => $aiText,
                ]);

                return $this->fallbackValidationResult('AI validation returned invalid JSON.');
            }

            return $this->normalizeValidationResult($result);
        } catch (\Throwable $e) {
            Log::error('Qwen validation exception', [
                'message' => $e->getMessage(),
            ]);

            return $this->fallbackValidationResult('AI validation is currently unavailable.');
        }
    }

    public function generateHint(Question $question): array
    {
        $baseUrl = rtrim(config('services.ollama.base_url'), '/');
        $model = config('services.ollama.model');
        $connectTimeout = (int) config('services.ollama.connect_timeout', 5);
        $timeout = (int) config('services.ollama.hint_timeout', 20);

        $prompt = $this->buildHintPrompt($question);

        try {
            $response = Http::connectTimeout($connectTimeout)->timeout($timeout)->post($baseUrl . '/api/generate', [
                'model' => $model,
                'prompt' => $prompt,
                'stream' => false,
                'format' => 'json',
                'options' => [
                    'temperature' => 0.3,
                    'top_p' => 0.4,
                ],
            ]);

            if (! $response->successful()) {
                Log::error('Qwen hint generation HTTP failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                ]);

                return $this->fallbackHintResult('Think about the main Python concept required by the question.');
            }

            $aiText = $response->json('response');

            if (! is_string($aiText) || trim($aiText) === '') {
                Log::error('Qwen returned empty hint response', [
                    'response' => $response->json(),
                ]);

                return $this->fallbackHintResult('Focus on the key Python concept mentioned in the question.');
            }

            $result = json_decode($aiText, true);

            if (! is_array($result)) {
                Log::error('Qwen returned invalid hint JSON', [
                    'raw_response' => $aiText,
                ]);

                return $this->fallbackHintResult('Focus on the main requirement of the question.');
            }

            $hint = trim((string) ($result['hint'] ?? ''));

            if ($hint === '') {
                $hint = 'Think about the main Python concept required by the question.';
            }

            if ($this->hintLooksTooDetailed($hint, $question)) {
                $hint = $this->genericSafeHint($question);
            }

            return [
                'hint' => $hint,
            ];
        } catch (\Throwable $e) {
            Log::error('Qwen hint generation exception', [
                'message' => $e->getMessage(),
            ]);

            return $this->fallbackHintResult('Hint is currently unavailable. Try reading the question carefully.');
        }
    }

    private function buildValidationPrompt(Question $question, string $studentAnswer): string
    {
        $questionText = $this->sanitizePromptSection($question->question_text ?? '');
        $expectedAnswer = $this->sanitizePromptSection($question->expected_answer ?? '');
        $rubric = $this->sanitizePromptSection($question->rubric ?? '');
        $studentAnswer = $this->sanitizePromptSection($studentAnswer);

        return <<<PROMPT
You are grading a beginner Python answer for a learning game.

Decide only whether the student answer satisfies the required rubric items.

Rules:
1. Use the rubric as the main grading guide.
2. The expected answer is only a reference example, not the only correct answer.
3. Accept equivalent correct Python code.
4. Do NOT require exact wording, exact formatting, exact variable names, or exact file names unless the question explicitly requires them.
5. Extra harmless code such as print(), storing in a variable first, or using a different file name is acceptable unless the question forbids it.
6. Check the rubric items one by one before deciding.
7. Mark correct only if all required rubric items are satisfied.
8. Mark incorrect if any required rubric item is missing or the answer is unrelated.
9. Keep feedback short, clear, and student-friendly.

Return ONLY valid JSON.
Do not include markdown.
Do not include code fences.
Do not include explanation outside JSON.

Required JSON format:
{
  "is_correct": true,
  "feedback": "Short feedback for the student."
}

QUESTION_START
{$questionText}
QUESTION_END

RUBRIC_START
{$rubric}
RUBRIC_END

REFERENCE_ANSWER_START
{$expectedAnswer}
REFERENCE_ANSWER_END

STUDENT_ANSWER_START
{$studentAnswer}
STUDENT_ANSWER_END

Now evaluate the student answer.
Return JSON only.
PROMPT;
    }

    private function buildHintPrompt(Question $question): string
    {
        $questionText = $question->question_text ?? '';
        $rubric = $question->rubric ?? '';

        return <<<PROMPT
You are an AI tutor for a Python programming learning game.

Your task is to give ONE small hint that guides the student without making the answer obvious.

The hint must help the student think, not show them what to type.

Strict hint rules:
1. Do NOT reveal the full answer.
2. Do NOT provide complete code.
3. Do NOT provide partial code.
4. Do NOT provide examples.
5. Do NOT provide sample input.
6. Do NOT provide sample output.
7. Do NOT include Python code syntax.
8. Do NOT include code-like patterns such as function_name(), variable = value, if condition:, list.append(value), or print(value).
9. Do NOT reuse specific variable names, string values, numbers, or identifiers from the question.
10. Do NOT give a template where the student can simply replace values.
11. Do NOT mention the exact final method, function, keyword, or operator if that would directly solve the question.
12. Do NOT say "use append", "use print", "use def", "use if", "use for", "use while", or similar direct coding instructions.
13. The hint should only point to the general concept or the next thinking step.
14. The hint must be beginner-friendly.
15. The hint must be one sentence only.
16. Return ONLY valid JSON.
17. Do not include markdown.
18. Do not include code fences.
19. Do not include explanation outside JSON.

Good hint examples:
- "Think about which Python structure is used to store multiple values together."
- "Focus on the decision that needs to be checked before choosing what happens next."
- "Break the problem into storing the value first, then changing how it is displayed."
- "Think about how repeated actions can be grouped so they can be reused later."
- "Consider what kind of data is being changed before it is shown."

Bad hint examples:
- "Use append() to add the item to the list."
- "You can write print(text.upper())."
- "Use if x > 3 and then print Yes."
- "Define a function using def and put the print statement inside."
- "Create a list, then call list_name.append(value)."
- "Use .upper() to convert the string."
- "Use a for loop to repeat through the list."

Required JSON format:
{
  "hint": "One short non-code hint here."
}

Question:
{$questionText}

Rubric:
{$rubric}

Now generate one hint only.
Return JSON only.
PROMPT;
    }

    private function deterministicValidation(Question $question, string $studentAnswer): ?array
    {
        if ($this->matchesFileReadQuestion($question)) {
            return $this->validateFileReadAnswer($studentAnswer);
        }

        return null;
    }

    private function matchesFileReadQuestion(Question $question): bool
    {
        $questionText = strtolower($question->question_text ?? '');
        $rubric = strtolower($question->rubric ?? '');

        return str_contains($questionText, 'with open') &&
            str_contains($questionText, 'file for reading') &&
            str_contains($rubric, 'read mode') &&
            str_contains($rubric, 'read or access file content');
    }

    private function validateFileReadAnswer(string $studentAnswer): array
    {
        $normalized = strtolower(str_replace(["\r", "\n", "\t"], ' ', $studentAnswer));
        $normalized = preg_replace('/\s+/', ' ', $normalized) ?? $normalized;

        $usesWithOpen = str_contains($normalized, 'with open(');
        $usesReadMode =
            str_contains($normalized, '"r"') ||
            str_contains($normalized, "'r'") ||
            preg_match('/,\s*r\s*\)/', $normalized) === 1;
        $accessesContent =
            str_contains($normalized, '.read(') ||
            preg_match('/for\s+\w+\s+in\s+\w+/', $normalized) === 1;

        if ($usesWithOpen && $usesReadMode && $accessesContent) {
            return [
                'status' => 'ok',
                'is_correct' => true,
                'feedback' => 'Your answer correctly opens the file for reading using with open(...) and accesses the file content.',
            ];
        }

        return [
            'status' => 'ok',
            'is_correct' => false,
            'feedback' => 'Your answer needs to use with open(...), specify read mode "r", and read or access the file content.',
        ];
    }

    private function hintLooksTooDetailed(string $hint, Question $question): bool
    {
        $questionText = strtolower($question->question_text ?? '');
        $hintLower = strtolower($hint);

        $blockedPatterns = [
            'print(',
            'append(',
            'upper(',
            'lower(',
            'split(',
            'strip(',
            'replace(',
            'len(',
            'range(',
            'input(',
            'int(',
            'str(',
            'float(',
            'def ',
            'if ',
            'else',
            'elif',
            'for ',
            'while ',
            'return ',
            'import ',
            '=',
            '==',
            '!=',
            '>=',
            '<=',
            '>',
            '<',
            ':',
            'example',
            'for example',
            'such as',
            'e.g.',
            'like this',
            'you can write',
        ];

        foreach ($blockedPatterns as $pattern) {
            if (str_contains($hintLower, $pattern)) {
                return true;
            }
        }

        preg_match_all('/["\']([^"\']+)["\']/', $questionText, $quotedValues);

        foreach ($quotedValues[1] ?? [] as $value) {
            $value = strtolower(trim($value));

            if ($value !== '' && str_contains($hintLower, $value)) {
                return true;
            }
        }

        preg_match_all('/\b[a-zA-Z_][a-zA-Z0-9_]*\b/', $questionText, $words);

        $commonWords = [
            'write',
            'create',
            'make',
            'use',
            'using',
            'python',
            'program',
            'code',
            'answer',
            'question',
            'a',
            'an',
            'the',
            'to',
            'and',
            'or',
            'in',
            'of',
            'with',
            'that',
            'this',
            'then',
            'show',
            'display',
            'value',
            'values',
            'number',
            'numbers',
            'text',
            'string',
            'list',
            'function',
            'loop',
            'condition',
            'statement',
            'read',
            'from',
            'into',
            'after',
            'before',
            'called',
            'named',
        ];

        foreach ($words[0] ?? [] as $word) {
            $wordLower = strtolower($word);

            if (
                strlen($wordLower) >= 4 &&
                ! in_array($wordLower, $commonWords, true) &&
                str_contains($hintLower, $wordLower)
            ) {
                return true;
            }
        }

        return false;
    }

    private function genericSafeHint(Question $question): string
    {
        $text = strtolower($question->question_text ?? '');

        if (str_contains($text, 'list') || str_contains($text, 'array')) {
            return 'Think about which Python structure is used to store multiple values together.';
        }

        if (
            str_contains($text, 'if') ||
            str_contains($text, 'condition') ||
            str_contains($text, 'check') ||
            str_contains($text, 'greater') ||
            str_contains($text, 'less')
        ) {
            return 'Focus on the decision that needs to be checked before choosing what happens next.';
        }

        if (
            str_contains($text, 'function') ||
            str_contains($text, 'method') ||
            str_contains($text, 'reusable')
        ) {
            return 'Think about how a group of instructions can be named and reused.';
        }

        if (
            str_contains($text, 'loop') ||
            str_contains($text, 'repeat') ||
            str_contains($text, 'each') ||
            str_contains($text, 'every')
        ) {
            return 'Think about how Python can repeat an action without writing it many times.';
        }

        if (
            str_contains($text, 'string') ||
            str_contains($text, 'text') ||
            str_contains($text, 'uppercase') ||
            str_contains($text, 'lowercase')
        ) {
            return 'Think about how text values can be changed before they are displayed.';
        }

        if (
            str_contains($text, 'dictionary') ||
            str_contains($text, 'key') ||
            str_contains($text, 'value')
        ) {
            return 'Think about how Python can store related information in pairs.';
        }

        if (
            str_contains($text, 'class') ||
            str_contains($text, 'object')
        ) {
            return 'Think about how related data and actions can be grouped together.';
        }

        if (
            str_contains($text, 'file') ||
            str_contains($text, 'read') ||
            str_contains($text, 'write')
        ) {
            return 'Think about how Python interacts with stored information outside the program.';
        }

        return 'Focus on the main Python concept needed to solve the task.';
    }

    private function normalizeValidationResult(array $result): array
    {
        $isCorrect = (bool) ($result['is_correct'] ?? false);

        $feedback = trim((string) ($result['feedback'] ?? ''));

        if ($feedback === '') {
            $feedback = $isCorrect
                ? 'Your answer satisfies the question requirement.'
                : 'Your answer does not fully satisfy the question requirement.';
        }

        return [
            'status' => 'ok',
            'is_correct' => $isCorrect,
            'feedback' => $feedback,
        ];
    }

    private function fallbackValidationResult(string $message): array
    {
        return [
            'status' => 'unavailable',
            'is_correct' => false,
            'feedback' => $message,
        ];
    }

    private function fallbackHintResult(string $message): array
    {
        return [
            'hint' => $message,
        ];
    }

    private function sanitizePromptSection(string $value): string
    {
        $value = str_replace(
            [
                'QUESTION_START',
                'QUESTION_END',
                'RUBRIC_START',
                'RUBRIC_END',
                'REFERENCE_ANSWER_START',
                'REFERENCE_ANSWER_END',
                'STUDENT_ANSWER_START',
                'STUDENT_ANSWER_END',
            ],
            '',
            $value
        );

        return trim($value);
    }
}
