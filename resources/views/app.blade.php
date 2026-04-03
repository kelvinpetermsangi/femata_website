<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <meta name="theme-color" content="#0d6a4b">
        <title inertia>{{ config('app.name', 'FEMATA') }}</title>
        <link rel="icon" type="image/x-icon" href="/favicon.ico">
        <link rel="icon" type="image/png" sizes="32x32" href="/brand/femata-logo-32.png">
        <link rel="icon" type="image/png" sizes="256x256" href="/brand/femata-logo-256.png">
        <link rel="apple-touch-icon" sizes="180x180" href="/brand/femata-logo-180.png">

        @viteReactRefresh
        @vite(['resources/css/app.css', 'resources/js/app.tsx'])
        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
