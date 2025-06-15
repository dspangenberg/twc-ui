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

Route::get('/tabs/tab-one', function () {
    return Inertia::render('tabs/tab-one');
})->name('tab-one');

Route::get('/tabs/tab-two', function () {
    return Inertia::render('tabs/tab-two');
})->name('tab-two');

Route::get('/tabs/tab-three', function () {
    return Inertia::render('tabs/tab-three');
})->name('tab-three');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/docs.php';
require __DIR__.'/demos.php';
