<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'ollama' => [
        'base_url' => env('OLLAMA_BASE_URL', 'http://ollama:11434'),
        'model' => env('OLLAMA_MODEL', 'qwen2.5-coder:1.5b'),
        'connect_timeout' => (int) env('OLLAMA_CONNECT_TIMEOUT', 5),
        'validation_timeout' => (int) env('OLLAMA_VALIDATION_TIMEOUT', 30),
        'hint_timeout' => (int) env('OLLAMA_HINT_TIMEOUT', 20),
    ],

];
