<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('landing');
})->name('home');

Route::get('/blocks', function () {
    return Inertia::render('blocks');
})->name('blocks');

Route::get('/legal', function () {
    return Inertia::render('legal');
})->name('legal');

Route::get('/style', function () {
    return Inertia::render('style');
})->name('style');

Route::get('/demo', function () {

    return Inertia::render('demo');
})->name('code');

Route::get('/code', function () {
    return Inertia::render('code');
})->name('code');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/docs.php';
require __DIR__.'/demos.php';
