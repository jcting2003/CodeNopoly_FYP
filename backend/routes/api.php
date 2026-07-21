<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\GameController;
use App\Http\Controllers\API\QuestionController;
use App\Http\Controllers\API\PropertyController;
use App\Http\Controllers\API\LeaderboardController;
use App\Http\Controllers\API\ProfileController;
use App\Http\Controllers\API\AdminDashboardController;
use App\Http\Controllers\API\AdminQuestionController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::get('/profile', [ProfileController::class, 'show']);
    Route::put('/profile', [ProfileController::class, 'update']);
    Route::post('/profile/photo', [ProfileController::class, 'uploadPhoto']);
    Route::get('/profile/stats', [ProfileController::class, 'stats']);

    Route::post('/games', [GameController::class, 'store']);
    Route::post('/games/join', [GameController::class, 'join']);
    Route::get('/games/{id}/players', [GameController::class, 'player']);
    Route::post('/games/{id}/start', [GameController::class, 'start']);
    Route::delete('/games/{id}', [GameController::class, 'cancel']);
    Route::get('/my-games', [GameController::class, 'myGames']);
    Route::get('/games/{id}', [GameController::class, 'show']);
    Route::post('/games/{game}/questions/{question}/hint', [QuestionController::class, 'getHint']);

    Route::middleware('throttle:gameplay')->group(function () {
        Route::get('/games/{id}/leaderboard', [LeaderboardController::class, 'show']);
        Route::get('/games/{id}/properties', [PropertyController::class, 'gameProperties']);
        Route::get('/games/{id}/my-properties', [PropertyController::class, 'myProperties']);
        Route::get('/games/{id}/turn', [GameController::class, 'currentTurn']);
        Route::post('/games/{id}/roll-dice', [GameController::class, 'rollDice']);
        Route::post('/games/{id}/end-turn', [GameController::class, 'endTurn']);
        Route::post('/games/{id}/end-game', [GameController::class, 'endGame']);
        Route::post('/games/{id}/declare-bankruptcy', [GameController::class, 'declareBankruptcy']);
        Route::post('/games/{id}/scan-tile', [QuestionController::class, 'scanTile']);
        Route::post('/games/{id}/scan-card', [QuestionController::class, 'scanCard']);
        Route::post('/games/{gameId}/properties/{propertyId}/sell-house', [PropertyController::class, 'sellHouse']);
        Route::post('/games/{gameId}/properties/{propertyId}/sell-hotel', [PropertyController::class, 'sellHotel']);
        Route::post('/games/{gameId}/properties/{propertyId}/sell', [PropertyController::class, 'sell']);
        Route::get('/games/{id}/tiles/by-number/{tileNumber}', [GameController::class, 'tileByNumber']);
        Route::post('/games/{id}/tiles/{tileId}/question', [QuestionController::class, 'getQuestionByDifficulty']);
        Route::post('/games/{id}/questions/{questionId}/submit', [QuestionController::class, 'submitAnswer']);
        Route::post('/properties/buy', [PropertyController::class, 'buy']);
        Route::post('/properties/buy-house', [PropertyController::class, 'buyHouse']);
        Route::post('/properties/buy-hotel', [PropertyController::class, 'buyHotel']);
        Route::post('/properties/pay-rent', [PropertyController::class, 'payRent']);
    });
});

Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index']);
    Route::get('/questions/limit-status', [AdminQuestionController::class, 'limitStatus']);

    Route::apiResource('questions', AdminQuestionController::class)->except(['show']);
});
