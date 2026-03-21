<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class AuthController extends Controller
{
    public function showLogin(): Response
    {
        return Inertia::render('Login');
    }

    public function authenticate(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (! Auth::attempt($credentials, $request->boolean('remember'))) {
            return back()->withErrors([
                'email' => 'The provided credentials do not match our records.',
            ])->with('error', 'Unable to sign in with those credentials.');
        }

        $request->session()->regenerate();

        if (! Auth::user()?->hasAdminAccess()) {
            Auth::logout();

            return back()->withErrors([
                'email' => 'Admin privileges are required to access the dashboard.',
            ])->with('error', 'Admin access required.');
        }

        return redirect()->intended('/admin/dashboard')->with('success', 'Welcome back.');
    }

    public function logout(Request $request): RedirectResponse
    {
        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/')->with('success', 'You have been logged out.');
    }
}
