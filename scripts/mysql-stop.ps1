$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$tmpDir = Join-Path $root ".tmp"
$pidFile = Join-Path $tmpDir "mysql.pid"

if (Test-Path $pidFile) {
    $pid = Get-Content -Path $pidFile -ErrorAction SilentlyContinue
    if ($pid) {
        Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
    }
    Remove-Item -Path $pidFile -Force -ErrorAction SilentlyContinue
}

$procs = Get-Process -Name mysqld -ErrorAction SilentlyContinue
if ($procs) {
    $procs | Stop-Process -Force -ErrorAction SilentlyContinue
    Write-Host "MySQL stopped."
    exit 0
}

Write-Host "MySQL was not running."
