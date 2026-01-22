<?php

use App\Http\Controllers\Contact\ContactCreateController;
use App\Http\Controllers\Contact\ContactStoreController;
use App\Http\Controllers\Contact\DialogContactCreateController;
use App\Http\Controllers\Contact\PasswordStoreController;
use Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('web')->group(function () {

    Route::get('form-demos/contact-create', ContactCreateController::class)->name('contact.create');
    Route::post('form-demos/contact-store',
        ContactStoreController::class)->name('contact.store')->middleware([HandlePrecognitiveRequests::class]);

    Route::get('dialog-demos/contact-create', DialogContactCreateController::class)->name('contact.dialog');

    Route::put('form-demos/password',
        PasswordStoreController::class)->name('password-store')->middleware([HandlePrecognitiveRequests::class]);

    Route::get('/demos/{path}', function (string $path) {
        $file = resource_path('js/pages/demos/'.$path.'.tsx');
        if (!file_exists($file)) {
            abort(404);
        }
        return Inertia::render("demos/$path");
    })->where('path', '[A-Za-z0-9\/_-]+')->name('demo');


});
