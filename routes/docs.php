<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::redirect('docs', 'docs/introduction');

Route::get('/source/{path}', function (string $path) {
    $path = resource_path('js/pages/demos/'.$path);
    return file_get_contents($path);
})->where('path', '.*')->name('source');

Route::get('/component-source/{path}', function (string $path) {
    $path = resource_path('js/components/twc-ui/'.$path.'.tsx');
    return file_get_contents($path);
})->where('path', '.*')->name('component-source');

Route::get('/md/{path}', function (string $path) {
    $path = resource_path('js/pages/docs/md/'.$path);
    return file_get_contents($path);
})->where('path', '.*')->name('md');

Route::get('/docs/{path}', function (string $path) {
    return Inertia::render("docs/$path");
})->where('path', '.*')->name('docs');


Route::get('/demos/{path}', function (string $path) {
    $tsxFile = resource_path('js/pages/demos/'.$path.'.tsx');
    if (!file_exists($tsxFile)) {
        abort(404);
    }
    return Inertia::render("demos/$path");
})->where('path', '[A-Za-z0-9\/_-]+')->name('demo');
