<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\GamePlayer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'profile_photo_url' => $user->profile_photo_path
                ? asset('storage/' . $user->profile_photo_path)
                : null,
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $fields = $request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]);

        $user->update([
            'name' => $fields['name'],
        ]);

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'profile_photo_url' => $user->profile_photo_path
                    ? asset('storage/' . $user->profile_photo_path)
                    : null,
            ],
        ]);
    }

    public function uploadPhoto(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'profile_photo' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ]);

        if ($user->profile_photo_path) {
            Storage::disk('public')->delete($user->profile_photo_path);
        }

        $path = $request->file('profile_photo')->store('profile-photos', 'public');

        $user->update([
            'profile_photo_path' => $path,
        ]);

        return response()->json([
            'message' => 'Profile picture updated successfully',
            'profile_photo_url' => asset('storage/' . $path),
        ]);
    }

    public function stats(Request $request)
    {
        $user = $request->user();

        $joinedGames = GamePlayer::where('user_id', $user->id)->count();

        $endedGamePlayers = GamePlayer::where('user_id', $user->id)
            ->whereHas('game', function ($query) {
                $query->where('status', 'ended');
            })
            ->get();

        $totalCreditsEarned = $endedGamePlayers->sum('total_credits');

        $highestScore = $endedGamePlayers->max('total_credits') ?? 0;

        $endedGameIds = $endedGamePlayers
            ->pluck('game_id')
            ->unique()
            ->values();

        $topPlayersByGameId = GamePlayer::whereIn('game_id', $endedGameIds)
            ->orderBy('game_id')
            ->orderByDesc('total_credits')
            ->orderByDesc('credits')
            ->get()
            ->groupBy('game_id')
            ->map(function ($players) {
                return $players->first();
            });

        $wins = $endedGameIds->filter(function ($gameId) use ($topPlayersByGameId, $user) {
            $topPlayer = $topPlayersByGameId->get($gameId);

            return $topPlayer && $topPlayer->user_id === $user->id;
        })->count();

        $recentGames = GamePlayer::with('game')
            ->where('user_id', $user->id)
            ->latest('joined_at')
            ->limit(5)
            ->get()
            ->map(function ($player) {
                return [
                    'game_id' => $player->game_id,
                    'game_code' => $player->game?->game_code,
                    'status' => $player->game?->status,
                    'credits' => $player->credits,
                    'total_credits' => $player->total_credits,
                    'position' => $player->position,
                    'joined_at' => $player->joined_at,
                ];
            });

        return response()->json([
            'stats' => [
                'games_joined' => $joinedGames,
                'games_won' => $wins,
                'total_credits_earned' => $totalCreditsEarned,
                'highest_score' => $highestScore,
            ],
            'recent_games' => $recentGames,
        ]);
    }
}
