$ErrorActionPreference = 'Stop'

if (-not $env:ANDROID_HOME) {
  Write-Error 'ANDROID_HOME is not set. Set it to your Android SDK directory.'
  exit 1
}

$adb = Join-Path $env:ANDROID_HOME 'platform-tools\adb.exe'
if (-not (Test-Path $adb)) {
  Write-Error "Android Debug Bridge was not found at '$adb'."
  exit 1
}

$apk = Join-Path $PSScriptRoot '..\android\app\build\outputs\apk\debug\app-debug.apk'
if (-not (Test-Path $apk)) {
  Write-Error "Debug APK was not found at '$apk'. Run 'npm run android:build' first."
  exit 1
}

& $adb install -r (Resolve-Path $apk).Path
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}

& $adb shell monkey -p com.morningflow.app 1
exit $LASTEXITCODE
