<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\Question;
use App\Models\User;

class AdminDashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'total_users' => User::count(),
            'total_questions' => Question::count(),
            'total_games' => Game::count(),
            'active_games' => Game::where('status', 'started')->count(),
        ]);
    }
}