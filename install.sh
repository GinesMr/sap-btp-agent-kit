#!/usr/bin/env bash
# =============================================================================
# SAP BTP Agent Kit — Installer
# Compatible: Linux, macOS, Raspberry Pi (ARM), Windows Git Bash / WSL
# Repo: https://github.com/GinesMr/sap-btp-agent-kit
# =============================================================================

set -e

REPO_URL="https://github.com/GinesMr/sap-btp-agent-kit.git"
REPO_NAME="sap-btp-agent-kit"
CLAUDE_SKILLS_DIR="$HOME/.claude/skills"
CLAUDE_PROJECTS_DIR="$HOME/.claude/projects"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m'

info()    { echo -e "${CYAN}[INFO]${NC}  $1"; }
success() { echo -e "${GREEN}[OK]${NC}    $1"; }
warn()    { echo -e "${YELLOW}[WARN]${NC}  $1"; }
error()   { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

echo ""
echo "=============================================="
echo "  SAP BTP Agent Kit — Installer"
echo "=============================================="
echo ""

# ── 1. Detect OS ──────────────────────────────────────────────────────────────
OS="unknown"
ARCH=$(uname -m 2>/dev/null || echo "unknown")
case "$(uname -s 2>/dev/null)" in
    Linux*)  OS="linux" ;;
    Darwin*) OS="macos" ;;
    CYGWIN*|MINGW*|MSYS*) OS="windows-bash" ;;
esac

info "Detected OS: $OS | Arch: $ARCH"
if [[ "$ARCH" == "armv7l" || "$ARCH" == "aarch64" ]]; then
    info "Raspberry Pi / ARM detected"
fi

# ── 2. Check dependencies ─────────────────────────────────────────────────────
info "Checking dependencies..."

command -v git >/dev/null 2>&1 || error "git is not installed. Install it: sudo apt install git"
success "git found: $(git --version)"

# Check Claude Code CLI (optional but recommended)
if command -v claude >/dev/null 2>&1; then
    success "Claude Code CLI found: $(claude --version 2>/dev/null | head -1 || echo 'installed')"
    HAS_CLAUDE=true
else
    warn "Claude Code CLI not found. Skills won't be auto-registered."
    warn "Install Claude Code: https://claude.ai/code"
    HAS_CLAUDE=false
fi

# ── 3. Choose install directory ───────────────────────────────────────────────
DEFAULT_DIR="$HOME/$REPO_NAME"
echo ""
read -r -p "Install directory [${DEFAULT_DIR}]: " INSTALL_DIR
INSTALL_DIR="${INSTALL_DIR:-$DEFAULT_DIR}"

if [[ -d "$INSTALL_DIR/.git" ]]; then
    info "Repository already exists at $INSTALL_DIR — pulling latest..."
    git -C "$INSTALL_DIR" pull origin main
    success "Updated to latest version."
else
    info "Cloning into $INSTALL_DIR ..."
    git clone "$REPO_URL" "$INSTALL_DIR"
    success "Cloned successfully."
fi

# ── 4. Register skills with Claude Code (if available) ───────────────────────
if [[ "$HAS_CLAUDE" == true ]]; then
    echo ""
    info "Registering SAP BTP skills with Claude Code..."

    mkdir -p "$CLAUDE_SKILLS_DIR"

    SKILLS=(
        "sap-btp-platform-architect"
        "sap-btp-developer"
        "sap-btp-security"
        "sap-btp-integration"
        "sap-btp-ai"
        "sap-btp-operations"
        "sap-b1-btp-integration"
    )

    for SKILL in "${SKILLS[@]}"; do
        SRC="$INSTALL_DIR/skills/$SKILL/SKILL.md"
        DEST_DIR="$CLAUDE_SKILLS_DIR/$SKILL"
        if [[ -f "$SRC" ]]; then
            mkdir -p "$DEST_DIR"
            cp "$SRC" "$DEST_DIR/SKILL.md"
            success "Skill registered: $SKILL"
        else
            warn "Skill file not found: $SRC"
        fi
    done
fi

# ── 5. Create shell aliases ───────────────────────────────────────────────────
echo ""
info "Creating shell aliases..."

ALIAS_FILE=""
if [[ "$OS" == "linux" || "$OS" == "macos" || "$OS" == "windows-bash" ]]; then
    if [[ -f "$HOME/.zshrc" ]]; then
        ALIAS_FILE="$HOME/.zshrc"
    elif [[ -f "$HOME/.bashrc" ]]; then
        ALIAS_FILE="$HOME/.bashrc"
    elif [[ -f "$HOME/.bash_profile" ]]; then
        ALIAS_FILE="$HOME/.bash_profile"
    fi
fi

BTP_ALIAS_BLOCK="
# SAP BTP Agent Kit aliases
export SAP_BTP_KB=\"$INSTALL_DIR\"
alias btp-kit='cd \$SAP_BTP_KB'
alias btp-catalog='cat \$SAP_BTP_KB/catalog/agent-service-index.yaml'
alias btp-update='git -C \$SAP_BTP_KB pull origin main'
alias btp-skills='ls \$SAP_BTP_KB/skills/'
"

if [[ -n "$ALIAS_FILE" ]]; then
    if ! grep -q "SAP BTP Agent Kit aliases" "$ALIAS_FILE" 2>/dev/null; then
        echo "$BTP_ALIAS_BLOCK" >> "$ALIAS_FILE"
        success "Aliases added to $ALIAS_FILE"
        info "Run: source $ALIAS_FILE  (or open a new terminal)"
    else
        info "Aliases already present in $ALIAS_FILE"
    fi
else
    warn "Could not detect shell config file. Add these manually:"
    echo "$BTP_ALIAS_BLOCK"
fi

# ── 6. Verify installation ────────────────────────────────────────────────────
echo ""
info "Verifying installation..."
FILE_COUNT=$(find "$INSTALL_DIR" -type f | wc -l)
success "Files installed: $FILE_COUNT"
success "Location: $INSTALL_DIR"

# ── 7. Summary ────────────────────────────────────────────────────────────────
echo ""
echo "=============================================="
echo -e "${GREEN}  SAP BTP Agent Kit installed successfully!${NC}"
echo "=============================================="
echo ""
echo "  Location:     $INSTALL_DIR"
echo "  AGENTS.md:    $INSTALL_DIR/AGENTS.md"
echo "  Service YAML: $INSTALL_DIR/catalog/agent-service-index.yaml"
echo "  Skills:       $INSTALL_DIR/skills/"
echo ""
echo "  Quick commands (after sourcing shell config):"
echo "    btp-kit        → navigate to knowledge base"
echo "    btp-catalog    → view service index YAML"
echo "    btp-update     → pull latest updates"
echo "    btp-skills     → list available skills"
echo ""
echo "  Update: git -C $INSTALL_DIR pull origin main"
echo ""
