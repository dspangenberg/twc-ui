<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/demo', function () {

    return Inertia::render('demo');
})->name('code');

Route::get('/source/:path', function (string $path) {


    $path = resource_path('js/pages/'.$path);
    return file_get_contents($path);
})->name('source');


Route::get('/code', function () {


    $path = resource_path('js/pages/demo.tsx');
    $code = file_get_contents($path);
    $docFile = resource_path('js/pages/doc.md');
    $documentation = file_get_contents($docFile);


    $fileName = pathinfo($path)['basename'];

    return Inertia::render('code', ['documentation' => $documentation, 'code'=>$code, 'path' => $fileName, 'title' => 'HeadingSmall.tsx']);
})->name('code');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
