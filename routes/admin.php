<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\AnnouncementController;
use App\Http\Controllers\Admin\DocumentController;
use App\Http\Controllers\Admin\GalleryController;
use App\Http\Controllers\Admin\LeaderController;
use App\Http\Controllers\Admin\NewsController;
use App\Http\Controllers\Admin\SiteSettingsController;
use Illuminate\Support\Facades\Route;

Route::get('/', fn () => redirect()->route('admin.dashboard'));
Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

Route::get('/announcements', [AnnouncementController::class, 'index'])->name('announcements.index');
Route::post('/announcements', [AnnouncementController::class, 'store'])->name('announcements.store');
Route::put('/announcements/{announcement}', [AnnouncementController::class, 'update'])->name('announcements.update');
Route::delete('/announcements/{announcement}', [AnnouncementController::class, 'destroy'])->name('announcements.destroy');
Route::get('/news', [NewsController::class, 'index'])->name('news.index');
Route::post('/news', [NewsController::class, 'store'])->name('news.store');
Route::put('/news/{newsPost}', [NewsController::class, 'update'])->name('news.update');
Route::delete('/news/{newsPost}', [NewsController::class, 'destroy'])->name('news.destroy');
Route::get('/leaders', [LeaderController::class, 'index'])->name('leaders.index');
Route::post('/leaders', [LeaderController::class, 'store'])->name('leaders.store');
Route::put('/leaders/{leader}', [LeaderController::class, 'update'])->name('leaders.update');
Route::delete('/leaders/{leader}', [LeaderController::class, 'destroy'])->name('leaders.destroy');
Route::get('/gallery', [GalleryController::class, 'index'])->name('gallery.index');
Route::post('/gallery', [GalleryController::class, 'store'])->name('gallery.store');
Route::put('/gallery/{galleryItem}', [GalleryController::class, 'update'])->name('gallery.update');
Route::delete('/gallery/{galleryItem}', [GalleryController::class, 'destroy'])->name('gallery.destroy');
Route::get('/documents', [DocumentController::class, 'index'])->name('documents.index');
Route::post('/documents', [DocumentController::class, 'store'])->name('documents.store');
Route::put('/documents/{documentFile}', [DocumentController::class, 'update'])->name('documents.update');
Route::delete('/documents/{documentFile}', [DocumentController::class, 'destroy'])->name('documents.destroy');
Route::get('/settings', [SiteSettingsController::class, 'index'])->name('settings.index');
Route::put('/settings', [SiteSettingsController::class, 'update'])->name('settings.update');
