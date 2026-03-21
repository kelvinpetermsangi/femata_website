<?php

namespace App\Support;

class YouTube
{
    public static function parseVideoId(?string $url): ?string
    {
        if (! $url) {
            return null;
        }

        $parts = parse_url($url);

        if (! is_array($parts)) {
            return null;
        }

        $host = strtolower($parts['host'] ?? '');
        $path = trim($parts['path'] ?? '', '/');

        if ($host === 'youtu.be' && $path !== '') {
            return strtok($path, '/');
        }

        if (str_contains($host, 'youtube.com')) {
            parse_str($parts['query'] ?? '', $query);

            if (! empty($query['v']) && is_string($query['v'])) {
                return $query['v'];
            }

            if (str_starts_with($path, 'embed/')) {
                return substr($path, 6);
            }

            if (str_starts_with($path, 'shorts/')) {
                return substr($path, 7);
            }
        }

        return null;
    }
}
