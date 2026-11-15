$path = 'c:\Users\fauzi\Documents\github\mutabaah-pwa\ikhtiar-langit-istri\lib\constants\activityInfo.ts'  
$lines = Get-Content $path  
$new = @()  
for ($i = 0; $i -lt 949; $i++) { $new += $lines[$i] }  
$new += '};'  
[System.IO.File]::WriteAllLines($path, $new, [System.Text.Encoding]::UTF8)  
Write-Host 'Done' 
