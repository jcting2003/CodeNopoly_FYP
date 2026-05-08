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

        $prompt = $this->buildValidationPrompt($question, $studentAnswer);

        try {
            $response = Http::timeout(90)->post($baseUrl . '/api/generate', [
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

        $prompt = $this->buildHintPrompt($question);

        try {
            $response = Http::timeout(60)->post($baseUrl . '/api/generate', [
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

Your task is to give ONE helpful hint to guide the student.

Important rules:
1. Do NOT reveal the full answer.
2. Do NOT provide the complete code solution.
3. Do NOT include exact final code.
4. Give only a gentle clue about the concept or next step.
5. The hint must be beginner-friendly.
6. The hint must be one or two sentences only.
7. Return ONLY valid JSON.
8. Do not include markdown.
9. Do not include code fences.
10. Do not include explanation outside JSON.

Required JSON format:
{
  "hint": "Short helpful hint here."
}

Question:
{$questionText}

Rubric:
{$rubric}

Now generate one hint only.
Return JSON only.
PROMPT;
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