<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class AuthController extends Controller
{
    private function formatUser(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
            'profile_photo_path' => $user->profile_photo_path,
            'profile_photo_url' => $user->profile_photo_path
                ? url(Storage::url($user->profile_photo_path))
                : null,
        ];
    }

    public function register(Request $request)
    {
        $fields = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'device_name' => 'nullable|string|max:255',
        ]);

        $user = User::create([
            'name' => $fields['name'],
            'email' => $fields['email'],
            'password' => Hash::make($fields['password']),
        ]);

        // Mobile / Expo registration: return Sanctum token
        if (!empty($fields['device_name'])) {
            $user->tokens()->where('name', $fields['device_name'])->delete();
            $token = $user->createToken($fields['device_name'])->plainTextToken;

            return response()->json([
                'message' => 'Registration successful',
                'token' => $token,
                'user' => $this->formatUser($user),
            ], 201);
        }

        // Web registration
        return response()->json([
            'message' => 'Registration successful',
            'user' => $this->formatUser($user),
        ], 201);
    }

    public function login(Request $request)
    {
        $fields = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
            'device_name' => 'nullable|string|max:255',
        ]);

        $user = User::where('email', $fields['email'])->first();

        if (! $user || ! Hash::check($fields['password'], $user->password)) {
            return response()->json([
                'message' => 'Invalid credentials',
            ], 401);
        }

        // Mobile / Expo login: return Sanctum token
        if (!empty($fields['device_name'])) {
            $user->tokens()->where('name', $fields['device_name'])->delete();
            $token = $user->createToken($fields['device_name'])->plainTextToken;

            return response()->json([
                'message' => 'Login successful',
                'token' => $token,
                'user' => $this->formatUser($user),
            ]);
        }

        // Web login: keep session-based login
        Auth::login($user);

        if ($request->hasSession()) {
            $request->session()->regenerate();
        }

        return response()->json([
            'message' => 'Login successful',
            'user' => $this->formatUser($user),
        ]);
    }
    
    public function logout(Request $request)
    {
        // Mobile / token logout
        if ($request->user() && $request->bearerToken()) {
            $request->user()->currentAccessToken()?->delete();

            return response()->json([
                'message' => 'Logged out successfully',
            ]);
        }

        // Web / session logout
        Auth::guard('web')->logout();

        if ($request->hasSession()) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    public function user(Request $request)
    {
        if (! $request->user()) {
            return response()->json([
                'message' => 'Unauthenticated',
            ], 401);
        }

        return response()->json([
            'user' => $this->formatUser($request->user()),
        ]);
    }
}