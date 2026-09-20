
# =======================================================================
# WearAura – Supabase Auth Config + Email Templates via Management API
# =======================================================================
# USAGE:
#   1. Get a Personal Access Token from:
#      https://supabase.com/dashboard/account/tokens
#   2. Run: $env:SUPABASE_ACCESS_TOKEN = "sbp_xxxx..."
#   3. Then run: .\lib\apply_supabase_config.ps1
# =======================================================================

$ProjectRef = "txxtnsvlnubitcotiqee"
$Token      = $env:SUPABASE_ACCESS_TOKEN

if (-not $Token) {
    Write-Host "ERROR: Set SUPABASE_ACCESS_TOKEN first." -ForegroundColor Red
    Write-Host "Get one from: https://supabase.com/dashboard/account/tokens" -ForegroundColor Yellow
    exit 1
}

$Headers = @{
    "Authorization" = "Bearer $Token"
    "Content-Type"  = "application/json"
}

function Invoke-SupabaseAPI($Method, $Path, $Body) {
    $url = "https://api.supabase.com/v1/$Path"
    try {
        if ($Body) {
            $json = $Body | ConvertTo-Json -Depth 20 -Compress
            return Invoke-RestMethod -Method $Method -Uri $url -Headers $Headers -Body $json
        } else {
            return Invoke-RestMethod -Method $Method -Uri $url -Headers $Headers
        }
    } catch {
        Write-Host "API ERROR [$Method $url]: $_" -ForegroundColor Red
        return $null
    }
}

# -----------------------------------------------------------------------
# STEP 1: Enable Email OTP (disable magic link, enable OTP)
# -----------------------------------------------------------------------
Write-Host "`n[1/5] Configuring auth: enabling Email OTP..." -ForegroundColor Cyan

$authConfig = @{
    mailer_otp_exp       = 600    # 10-minute OTP expiry
    mailer_autoconfirm   = $false # require email confirmation
    external_email_enabled = $true
}

$result = Invoke-SupabaseAPI "PATCH" "projects/$ProjectRef/config/auth" $authConfig
if ($result) {
    Write-Host "  Auth config updated: OTP expiry=600s" -ForegroundColor Green
} else {
    Write-Host "  Auth config update failed (may need different API path)" -ForegroundColor Yellow
}

# -----------------------------------------------------------------------
# STEP 2-5: Apply email templates
# -----------------------------------------------------------------------

function Apply-Template($TemplateName, $ApiType, $Subject, $HtmlBody) {
    Write-Host "`nApplying [$TemplateName] template..." -ForegroundColor Cyan

    $body = @{
        subject = $Subject
        content = $HtmlBody
    }

    $result = Invoke-SupabaseAPI "PUT" "projects/$ProjectRef/config/auth/templates/$ApiType" $body
    if ($result -ne $null) {
        Write-Host "  [$TemplateName] saved successfully." -ForegroundColor Green
    } else {
        Write-Host "  [$TemplateName] failed - check token permissions." -ForegroundColor Red
    }
}

# Read template files
$t1 = Get-Content "lib/template_1_extracted.html" -Raw
$t2 = Get-Content "lib/template_2_extracted.html" -Raw
$t3 = Get-Content "lib/template_3_extracted.html" -Raw
$t4 = Get-Content "lib/template_4_extracted.html" -Raw

# Apply all 4 templates
Apply-Template "Magic Link / OTP"  "magic_link"     "{{ .Token }} is your WearAura sign-in code"   $t1
Apply-Template "Confirm Signup"    "confirmation"   "Welcome to WearAura — Confirm your account"    $t2
Apply-Template "Reset Password"    "recovery"       "Reset your WearAura password"                  $t3
Apply-Template "Change Email"      "email_change"   "Confirm email address change — WearAura"       $t4

Write-Host "`n[DONE] All templates applied. Now test the OTP flow at your app." -ForegroundColor Green
Write-Host "  Signup OTP: http://localhost:3000/signup  (Passwordless/OTP tab)" -ForegroundColor Cyan
Write-Host "  Login OTP:  http://localhost:3000/login   (OTP/Magic Link tab)"   -ForegroundColor Cyan
