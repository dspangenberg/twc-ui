<?php

use Illuminate\Contracts\Filesystem\FileNotFoundException;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

Route::redirect('docs', '/docs/getting-started/introduction');
Route::redirect('imprint', '/docs/legal/imprint')->name('imprint');

Route::get('/source/{path}', function (string $path) {
    $path = resource_path('js/pages/demos/'.$path);
    return file_get_contents($path);
})->where('path', '.*')->name('source');

Route::get('/component-source/{path}', function (string $path) {
    $path = resource_path('js/components/twc-ui/'.$path.'.tsx');
    return file_get_contents($path);
})->where('path', '.*')->name('component-source');

Route::get('/hook-source/{path}', function (string $path) {
    $path = resource_path('js/hooks/'.$path);
    return file_get_contents($path);
})->where('path', '.*')->name('hook-source');

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

Route::get('api/docs/structure', function () {
    $docsPath = resource_path('js/docs');

    if (!File::exists($docsPath)) {
        return response()->json(['error' => 'Docs directory not found'], 404);
    }

    $structure = buildDocsStructure($docsPath);

    return response()->json($structure);
});

/**
 * @throws FileNotFoundException
 */
function buildDocsStructure($basePath, $relativePath = ''): array
{
    $items = [];
    $fullPath = $basePath.($relativePath ? '/'.$relativePath : '');

    if (!File::exists($fullPath)) {
        return $items;
    }

    $entries = File::directories($fullPath);
    $files = File::files($fullPath);

    // Verzeichnisse verarbeiten
    foreach ($entries as $directory) {
        $dirName = basename($directory);
        $childPath = $relativePath ? $relativePath.'/'.$dirName : $dirName;

        $item = [
            'title' => ucfirst(str_replace(['-', '_'], ' ', $dirName)),
            'type' => 'directory',
            'path' => $childPath,
            'children' => buildDocsStructure($basePath, $childPath)
        ];

        $items[] = $item;
    }

    // MDX-Dateien verarbeiten
    foreach ($files as $file) {
        if (pathinfo($file, PATHINFO_EXTENSION) === 'mdx') {
            $fileName = pathinfo($file, PATHINFO_FILENAME);
            $filePath = $relativePath ? $relativePath.'/'.$fileName : $fileName;

            $frontmatter = extractFrontmatter($file);

            $item = [
                'title' => $frontmatter['title'] ?? ucfirst(str_replace(['-', '_'], ' ', $fileName)),
                'type' => 'file',
                'path' => $filePath,
                'route' => '/docs/'.$filePath,
                'frontmatter' => $frontmatter
            ];

            $items[] = $item;
        }
    }

    return $items;
}

/**
 * @throws FileNotFoundException
 */
function extractFrontmatter($filePath): array
{
    $content = File::get($filePath);

    // Frontmatter extrahieren (zwischen --- und ---)
    if (preg_match('/^---\s*\n(.*?)\n---\s*\n/s', $content, $matches)) {
        $frontmatterContent = $matches[1];

        // Einfaches YAML-Parsing für grundlegende Eigenschaften
        $frontmatter = [];
        $lines = explode("\n", $frontmatterContent);

        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line)) {
                continue;
            }

            if (str_contains($line, ':')) {
                [$key, $value] = explode(':', $line, 2);
                $key = trim($key);
                $value = trim($value, ' "\'');

                // Arrays handhaben (einfache Implementierung)
                if ($key === 'tags' && str_contains($value, '[')) {
                    $value = str_replace(['[', ']', '"', "'"], '', $value);
                    $value = array_map('trim', explode(',', $value));
                }

                $frontmatter[$key] = $value;
            }
        }

        return $frontmatter;
    }

    return [];
}

