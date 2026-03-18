$root = Split-Path -Parent $PSScriptRoot
$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add('http://127.0.0.1:4180/')
$listener.Start()

try {
    while ($listener.IsListening) {
        try {
            $context = $listener.GetContext()
            $requestPath = [System.Uri]::UnescapeDataString($context.Request.Url.AbsolutePath.TrimStart('/'))

            if ([string]::IsNullOrWhiteSpace($requestPath)) {
                $requestPath = 'preview.html'
            }

            if ($requestPath.StartsWith('storage/')) {
                $target = Join-Path $root ('storage/app/public/' + $requestPath.Substring(8))
            } else {
                $target = Join-Path $root $requestPath
            }

            if ((Test-Path $target) -and -not (Get-Item $target).PSIsContainer) {
                $filePath = $target
            } else {
                $filePath = Join-Path $root 'preview.html'
            }

            $ext = [System.IO.Path]::GetExtension($filePath).ToLowerInvariant()
            $contentType = switch ($ext) {
                '.html' { 'text/html; charset=utf-8' }
                '.js' { 'application/javascript; charset=utf-8' }
                '.css' { 'text/css; charset=utf-8' }
                '.json' { 'application/json; charset=utf-8' }
                '.svg' { 'image/svg+xml' }
                '.png' { 'image/png' }
                '.jpg' { 'image/jpeg' }
                '.jpeg' { 'image/jpeg' }
                '.pdf' { 'application/pdf' }
                default { 'application/octet-stream' }
            }

            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            $context.Response.StatusCode = 200
            $context.Response.ContentType = $contentType
            $context.Response.ContentLength64 = $bytes.Length
            $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
            $context.Response.OutputStream.Close()
        } catch {
        }
    }
} finally {
    $listener.Stop()
}
