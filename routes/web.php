<?php

use App\Http\Controllers\PublicController;
use Illuminate\Support\Facades\Route;

Route::controller(PublicController::class)->group(function () {
    Route::get('/', 'home')->name('home');
    Route::get('/about', 'about')->name('about');
    Route::get('/leadership', 'leadership')->name('leadership');
    Route::get('/associations', 'associations')->name('associations.index');
    Route::get('/associations/{association:slug}', 'associationSingle')->name('associations.show');
    Route::get('/associations/{association:slug}/{page}', 'associationPage')->name('associations.page');
    Route::get('/news', 'news')->name('news.index');
    Route::get('/news/{newsPost:slug}', 'newsSingle')->name('news.show');
    Route::get('/announcements', 'announcements')->name('announcements');
    Route::get('/gallery', 'gallery')->name('gallery');
    Route::get('/documents', 'documents')->name('documents.index');
    Route::get('/documents/{document:slug}', 'documentSingle')->name('documents.show');
    Route::get('/documents/{document:slug}/download', 'downloadDocument')->name('documents.download');
    Route::get('/contact', 'contact')->name('contact');
    Route::post('/contact', 'submitContact')->name('contact.submit');
});
