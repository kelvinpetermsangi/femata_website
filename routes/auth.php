<?php

use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;

Route::get('/admin/login', [AuthController::class, 'showLogin'])->name('admin.login');
Route::post('/admin/login', [AuthController::class, 'authenticate'])->name('admin.login.attempt');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
