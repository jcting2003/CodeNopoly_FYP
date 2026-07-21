<?php

namespace App\Services;

use App\Models\Question;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class QwenAnswerValidationService
{
    public function validateAnswer(Question $question, string $studentAnswer): array
    {
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
        $questionText = $question->question_text ?? '';
        $expectedAnswer = $question->expected_answer ?? '';
        $rubric = $question->rubric ?? '';

        return <<<PROMPT
You are an AI validator for a Python programming learning game.

Your job is to decide whether the student's answer satisfies the programming question.

You must be fair, consistent, and practical.

Important grading rules:
1. Do NOT require exact wording.
2. Do NOT require the student's code to be identical to the expected answer.
3. Accept equivalent correct Python code.
4. Extra valid code such as print() is acceptable unless the question forbids it.
5. If the user's code performs the required task correctly, mark it correct.
6. If the answer is unrelated, incomplete, or does not satisfy the main task, mark it incorrect.
7. Do not contradict yourself.
8. Do not say an answer is wrong and then provide the same answer as the correction.
9. The expected answer is a reference answer, not the only possible answer.
10. Use the rubric as the main marking guide.

Special Python validation examples:
- If the question asks to create a list called items and append "apple", then this is correct:
  items = []
  items.append("apple")
  print(items)

- If the question asks to convert "python" to uppercase and print it, then this is correct:
  print("python".upper())

- If the question asks for an if statement checking x > 3 and printing "Yes", then this is correct:
  if x > 3:
      print("Yes")

- If the question asks for a function named greet that prints "Hello", then this is correct:
  def greet():
      print("Hello")

Return ONLY valid JSON.
Do not include markdown.
Do not include code fences.
Do not include explanation outside JSON.

Required JSON format:
{
  "is_correct": true,
  "score": 100,
  "feedback": "Short feedback for the student."
}

Scoring rules:
- score must be an integer from 0 to 100.
- Use 100 when the answer fully satisfies the question.
- Use 50 to 79 only when the answer is partially correct but not enough for full correctness.
- Use 0 when the answer is wrong or unrelated.
- is_correct should be true only when the score is 80 or above.

Question:
{$questionText}

Expected Answer:
{$expectedAnswer}

Rubric:
{$rubric}

Student Answer:
{$studentAnswer}

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
            'write',
            'type',
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
        $score = (int) ($result['score'] ?? 0);
        $score = max(0, min(100, $score));

        $isCorrect = (bool) ($result['is_correct'] ?? false);

        if ($score >= 80) {
            $isCorrect = true;
        }

        if ($score < 80) {
            $isCorrect = false;
        }

        $feedback = trim((string) ($result['feedback'] ?? ''));

        if ($feedback === '') {
            $feedback = $isCorrect
                ? 'Your answer satisfies the question requirement.'
                : 'Your answer does not fully satisfy the question requirement.';
        }

        return [
            'is_correct' => $isCorrect,
            'score' => $score,
            'feedback' => $feedback,
        ];
    }

    private function fallbackValidationResult(string $message): array
    {
        return [
            'is_correct' => false,
            'score' => 0,
            'feedback' => $message,
        ];
    }

    private function fallbackHintResult(string $message): array
    {
        return [
            'hint' => $message,
        ];
    }
}