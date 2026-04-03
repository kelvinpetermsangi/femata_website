<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::get('/admin/login', [AuthController::class, 'showLogin'])->name('admin.login');
Route::post('/admin/login', [AuthController::class, 'authenticate'])->name('admin.login.attempt');
Route::get('/admin/forgot-password', [AuthController::class, 'showForgotPassword'])->name('password.request');
Route::post('/admin/forgot-password', [AuthController::class, 'sendResetLink'])->name('password.email');
Route::get('/admin/reset-password/{token}', [AuthController::class, 'showResetPassword'])->name('password.reset');
Route::post('/admin/reset-password', [AuthController::class, 'resetPassword'])->name('password.update');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
