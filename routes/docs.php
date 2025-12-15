<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::redirect('docs', '/docs/getting-started/introduction');
Route::redirect('imprint', '/docs/legal/imprint')->name('imprint');

Route::get('/source/{path}', function (string $path) {
    $path = resource_path('js/pages/demos/'.$path);
    return file_get_contents($path);
})->where('path', '.*')->name('source');

Route::get('/component-source/{path}', function (string $path) {
    $path = resource_path('js/components/twc-ui/'.$path);
    return file_get_contents($path);
})->where('path', '.*')->name('component-source');

Route::get('/hook-source/{path}', function (string $path) {
    $path = resource_path('js/hooks/'.$path);
    return file_get_contents($path);
})->where('path', '.*')->name('hook-source');

Route::get('/lib-source/{path}', function (string $path) {
    $basePath = resource_path('js/lib/');
    $fullPath = realpath($basePath . $path);
    dump($fullPath);

    if (!$fullPath || !str_starts_with($fullPath, $basePath)) {
        abort(403);
    }

    return file_get_contents($fullPath);
})->where('path', '.*')->name('lib-source');

Route::get('/md/{path}', function (string $path) {
    $path = resource_path('js/pages/docs/md/'.$path);
    return file_get_contents($path);
})->where('path', '.*')->name('md');

Route::get('/docs/{path}', function (string $path) {
    $file = resource_path('js/docs/'.$path.'.mdx');
    if (!file_exists($file)) {
        abort(404);
    }
    return Inertia::render("docs/$path");
})->where('path', '[A-Za-z0-9\/_-]+')->name('docs');
