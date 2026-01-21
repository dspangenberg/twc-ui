<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{-- Inline script to detect system dark mode preference and apply it immediately --}}
    <script>
      (function () {
        const appearance = '{{ $appearance ?? "system" }}'

        if (appearance === 'system') {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

          if (prefersDark) {
            document.documentElement.classList.add('dark')
          }
        }
      })()
    </script>

    {{-- Inline style to set the HTML background color based on our theme in app.css --}}
    <style>
        html {
            background-color: oklch(1 0 0);
        }

        html.dark {
            background-color: oklch(0.145 0 0);
        }
    </style>

    <title inertia>{{ config('app.name', 'Laravel') }}</title>

    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">

    @routes
    @viteReactRefresh
    @vite(['resources/js/app.tsx'])
    @inertiaHead
</head>
<body class="font-sans antialiased">
@inertia
</body>
<script defer src="https://umami.twiceware.cloud/script.js" data-website-id="3aeec79f-10f5-4eb6-8e9c-6e3148f86c8c"
></script>
</html>
