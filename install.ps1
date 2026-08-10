# =============================================================================
# SAP BTP Agent Kit — Installer for Windows (PowerShell)
# Repo: https://github.com/GinesMr/sap-btp-agent-kit
# Run: Set-ExecutionPolicy Bypass -Scope Process; .\install.ps1
# =============================================================================

$RepoUrl    = "https://github.com/GinesMr/sap-btp-agent-kit.git"
$RepoName   = "sap-btp-agent-kit"
$DefaultDir = Join-Path $env:USERPROFILE $RepoName
$ClaudeSkillsDir = Join-Path $env:USERPROFILE ".claude\skills"

function Write-Info    { param($m) Write-Host "[INFO]  $m" -ForegroundColor Cyan }
function Write-Ok      { param($m) Write-Host "[OK]    $m" -ForegroundColor Green }
function Write-Warn    { param($m) Write-Host "[WARN]  $m" -ForegroundColor Yellow }
function Write-Err     { param($m) Write-Host "[ERROR] $m" -ForegroundColor Red; exit 1 }

Write-Host ""
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host "  SAP BTP Agent Kit - Windows Installer" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

# ── 1. Check git ──────────────────────────────────────────────────────────────
Write-Info "Checking dependencies..."
try {
    $gitVersion = git --version
    Write-Ok "git found: $gitVersion"
} catch {
    Write-Err "git not found. Install from https://git-scm.com/download/win"
}

# ── 2. Check Claude Code CLI ──────────────────────────────────────────────────
$HasClaude = $false
try {
    $null = Get-Command claude -ErrorAction Stop
    Write-Ok "Claude Code CLI found."
    $HasClaude = $true
} catch {
    Write-Warn "Claude Code CLI not found. Skills won't be auto-registered."
    Write-Warn "Install from: https://claude.ai/code"
}

# ── 3. Install directory ──────────────────────────────────────────────────────
Write-Host ""
$InstallDir = Read-Host "Install directory [$DefaultDir]"
if ([string]::IsNullOrWhiteSpace($InstallDir)) { $InstallDir = $DefaultDir }

if (Test-Path (Join-Path $InstallDir ".git")) {
    Write-Info "Repository already exists — pulling latest..."
    git -C $InstallDir pull origin main
    Write-Ok "Updated."
} else {
    Write-Info "Cloning into $InstallDir ..."
    git clone $RepoUrl $InstallDir
    Write-Ok "Cloned successfully."
}

# ── 4. Register skills ────────────────────────────────────────────────────────
if ($HasClaude) {
    Write-Host ""
    Write-Info "Registering SAP BTP skills with Claude Code..."
    New-Item -ItemType Directory -Force -Path $ClaudeSkillsDir | Out-Null

    $Skills = @(
        "sap-btp-platform-architect",
        "sap-btp-developer",
        "sap-btp-security",
        "sap-btp-integration",
        "sap-btp-ai",
        "sap-btp-operations",
        "sap-b1-btp-integration"
    )

    foreach ($Skill in $Skills) {
        $Src  = Join-Path $InstallDir "skills\$Skill\SKILL.md"
        $Dest = Join-Path $ClaudeSkillsDir $Skill
        if (Test-Path $Src) {
            New-Item -ItemType Directory -Force -Path $Dest | Out-Null
            Copy-Item $Src (Join-Path $Dest "SKILL.md") -Force
            Write-Ok "Skill registered: $Skill"
        } else {
            Write-Warn "Skill not found: $Src"
        }
    }
}

# ── 5. PowerShell profile aliases ─────────────────────────────────────────────
Write-Host ""
Write-Info "Adding aliases to PowerShell profile..."

$AliasBlock = @"

# SAP BTP Agent Kit
`$env:SAP_BTP_KB = "$InstallDir"
function btp-kit    { Set-Location `$env:SAP_BTP_KB }
function btp-catalog { Get-Content (Join-Path `$env:SAP_BTP_KB "catalog\agent-service-index.yaml") }
function btp-update  { git -C `$env:SAP_BTP_KB pull origin main }
function btp-skills  { Get-ChildItem (Join-Path `$env:SAP_BTP_KB "skills") -Directory | Select-Object Name }
"@

$ProfilePath = $PROFILE
if (-not (Test-Path $ProfilePath)) {
    New-Item -ItemType File -Force -Path $ProfilePath | Out-Null
}

$ProfileContent = Get-Content $ProfilePath -Raw -ErrorAction SilentlyContinue
if ($ProfileContent -notmatch "SAP BTP Agent Kit") {
    Add-Content -Path $ProfilePath -Value $AliasBlock
    Write-Ok "Aliases added to $ProfilePath"
    Write-Info "Run: . `$PROFILE  (to reload)"
} else {
    Write-Info "Aliases already present in profile."
}

# ── 6. Summary ────────────────────────────────────────────────────────────────
$FileCount = (Get-ChildItem $InstallDir -Recurse -File).Count

Write-Host ""
Write-Host "==============================================" -ForegroundColor Green
Write-Host "  SAP BTP Agent Kit installed!" -ForegroundColor Green
Write-Host "==============================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Location:     $InstallDir"
Write-Host "  AGENTS.md:    $InstallDir\AGENTS.md"
Write-Host "  Service YAML: $InstallDir\catalog\agent-service-index.yaml"
Write-Host "  Skills:       $InstallDir\skills\"
Write-Host "  Files:        $FileCount"
Write-Host ""
Write-Host "  Commands (after reloading profile):"
Write-Host "    btp-kit       -> navigate to knowledge base"
Write-Host "    btp-catalog   -> view service index YAML"
Write-Host "    btp-update    -> pull latest updates"
Write-Host "    btp-skills    -> list skills"
Write-Host ""
Write-Host "  Update: git -C $InstallDir pull origin main"
Write-Host ""
