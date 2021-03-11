Add-Type -AssemblyName System.Web
$innaurl = $args[0]
$eurl = $innaurl -replace "^.*url="
$url = [System.Web.HttpUtility]::UrlDecode($eurl)
$arguments = @()
$arguments += $url
Start-Process -FilePath "C:\Program Files (x86)\K-Lite Codec Pack\MPC-HC64\mpc-hc64.exe" -ArgumentList $arguments # Change path for MPC

# If 'not digitally signed' error, run as admin: Set-ExecutionPolicy Unrestricted