<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\GameController;
use App\Http\Controllers\API\QuestionController;
use App\Http\Controllers\API\PropertyController;
use App\Http\Controllers\API\LeaderboardController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    Route::post('/games', [GameController::class, 'store']);
    Route::post('/games/join', [GameController::class, 'join']);
    Route::get('/games/{id}/players', [GameController::class, 'player']);
    Route::post('/games/{id}/start', [GameController::class, 'start']);
    Route::get('/games/{id}/leaderboard', [LeaderboardController::class, 'show']);
    Route::get('/games/{id}/properties', [PropertyController::class, 'gameProperties']);
    Route::get('/games/{id}/turn', [GameController::class, 'currentTurn']);
    Route::post('/games/{id}/roll-dice', [GameController::class, 'rollDice']);
    Route::post('/games/{id}/end-turn', [GameController::class, 'endTurn']);
    Route::get('/my-games', [GameController::class, 'myGames']);
    Route::post('/games/{id}/end-game', [GameController::class, 'endGame']);
    Route::get('/games/{id}', [GameController::class, 'show']);
    
    Route::post('/games/{id}/scan-tile', [QuestionController::class, 'scanTile']);
    Route::post('/games/{id}/tiles/{tileId}/question', [QuestionController::class, 'getQuestionByDifficulty']);
    Route::post('/games/{id}/questions/{questionId}/submit', [QuestionController::class, 'submitAnswer']);
    Route::post('/properties/buy', [PropertyController::class, 'buy']);
    Route::post('/properties/buy-house', [PropertyController::class, 'buyHouse']);
    Route::post('/properties/buy-hotel', [PropertyController::class, 'buyHotel']);
    Route::post('/properties/pay-rent', [PropertyController::class, 'payRent']);
});