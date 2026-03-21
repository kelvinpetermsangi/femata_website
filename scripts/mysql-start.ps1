$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$tmpDir = Join-Path $root ".tmp"
$pidFile = Join-Path $tmpDir "mysql.pid"
$mysqld = "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqld.exe"
$ini = "C:\ProgramData\MySQL\MySQL Server 8.4\my.ini"

if (!(Test-Path $tmpDir)) {
    New-Item -ItemType Directory -Force -Path $tmpDir | Out-Null
}

if (Get-Process -Name mysqld -ErrorAction SilentlyContinue) {
    Write-Host "MySQL already running."
    exit 0
}

if (!(Test-Path $mysqld)) {
    Write-Error "mysqld not found at $mysqld"
    exit 1
}

if (!(Test-Path $ini)) {
    Write-Error "my.ini not found at $ini"
    exit 1
}

$proc = Start-Process -WindowStyle Hidden -FilePath $mysqld -ArgumentList "--defaults-file=$ini", "--console" -PassThru
$proc.Id | Set-Content -Path $pidFile
Start-Sleep -Seconds 5

$tcp = Test-NetConnection -ComputerName 127.0.0.1 -Port 3306
if (-not $tcp.TcpTestSucceeded) {
    Write-Error "MySQL did not start on 127.0.0.1:3306."
    exit 1
}

Write-Host "MySQL started (PID $($proc.Id))."
