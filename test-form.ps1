$body = @{
    name = "Test User"
    email = "test@example.com"
    message = "Test submission"
    _subject = "Test - Wirral Carpet Cleaning"
    _captcha = "false"
} | ConvertTo-Json

$headers = @{
    "Accept" = "application/json"
}

try {
    $response = Invoke-RestMethod -Uri "https://formsubmit.co/ajax/contact@wirralcarpetcleaning.com" -Method Post -ContentType "application/json" -Headers $headers -Body $body
    Write-Output "SUCCESS:"
    Write-Output ($response | ConvertTo-Json)
} catch {
    Write-Output "FAILED:"
    Write-Output $_.Exception.Message
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        Write-Output $reader.ReadToEnd()
    }
}
