#!/usr/bin/env node
// SAP BTP Agent Kit — NPX installer
// Usage: npx sap-btp-agent-kit [--dir <path>] [--no-skills] [--no-aliases] [--update]

'use strict';

const path  = require('path');
const fs    = require('fs');
const os    = require('os');
const { execSync, spawnSync } = require('child_process');

// ── CLI argument parsing ────────────────────────────────────────────────────
const args = process.argv.slice(2);
const flags = {
  dir:       argValue('--dir'),
  noSkills:  args.includes('--no-skills'),
  noAliases: args.includes('--no-aliases'),
  update:    args.includes('--update'),
  help:      args.includes('--help') || args.includes('-h'),
};

function argValue(flag) {
  const i = args.indexOf(flag);
  return (i !== -1 && args[i + 1]) ? args[i + 1] : null;
}

// ── Colors ──────────────────────────────────────────────────────────────────
const isWindows = process.platform === 'win32';
const c = {
  cyan:   s => `\x1b[36m${s}\x1b[0m`,
  green:  s => `\x1b[32m${s}\x1b[0m`,
  yellow: s => `\x1b[33m${s}\x1b[0m`,
  red:    s => `\x1b[31m${s}\x1b[0m`,
  bold:   s => `\x1b[1m${s}\x1b[0m`,
};

const info  = m => console.log(c.cyan('[INFO] ') + m);
const ok    = m => console.log(c.green('[OK]   ') + m);
const warn  = m => console.log(c.yellow('[WARN] ') + m);
const err   = m => { console.error(c.red('[ERROR] ') + m); process.exit(1); };
const sep   = () => console.log(c.cyan('='.repeat(50)));

// ── Help ────────────────────────────────────────────────────────────────────
if (flags.help) {
  console.log(`
${c.bold('SAP BTP Agent Kit')} — Agent-friendly SAP BTP knowledge base

${c.bold('Usage:')}
  npx sap-btp-agent-kit [options]

${c.bold('Options:')}
  --dir <path>     Install directory (default: ~/sap-btp-agent-kit)
  --no-skills      Skip Claude Code skill registration
  --no-aliases     Skip shell alias injection
  --update         Pull latest changes if already installed
  --help, -h       Show this help

${c.bold('Examples:')}
  npx sap-btp-agent-kit
  npx sap-btp-agent-kit --dir /opt/sap-btp-agent-kit
  npx sap-btp-agent-kit --update
`);
  process.exit(0);
}

// ── Entry point ─────────────────────────────────────────────────────────────
console.log('');
sep();
console.log(c.bold('  SAP BTP Agent Kit — Installer'));
console.log(c.cyan('  npx sap-btp-agent-kit'));
sep();
console.log('');

main().catch(e => err(e.message));

async function main() {
  const installDir = await resolveInstallDir();
  await cloneOrUpdate(installDir);
  if (!flags.noSkills) registerSkills(installDir);
  if (!flags.noAliases) injectAliases(installDir);
  printSummary(installDir);
}

// ── Step 1: resolve install directory ───────────────────────────────────────
async function resolveInstallDir() {
  if (flags.dir) return path.resolve(flags.dir);

  const defaultDir = path.join(os.homedir(), 'sap-btp-agent-kit');

  if (process.stdin.isTTY) {
    const readline = require('readline');
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(resolve => {
      rl.question(`Install directory [${defaultDir}]: `, answer => {
        rl.close();
        resolve(answer.trim() || defaultDir);
      });
    });
  }

  info(`Non-interactive mode — installing to ${defaultDir}`);
  return defaultDir;
}

// ── Step 2: clone or update ──────────────────────────────────────────────────
async function cloneOrUpdate(installDir) {
  checkGit();

  const gitDir = path.join(installDir, '.git');
  const repoUrl = 'https://github.com/GinesMr/sap-btp-agent-kit.git';

  if (fs.existsSync(gitDir)) {
    if (flags.update || true) {
      info(`Repository exists at ${installDir} — pulling latest...`);
      run('git', ['-C', installDir, 'pull', 'origin', 'main']);
      ok('Updated to latest version.');
    }
  } else {
    info(`Cloning SAP BTP Agent Kit into ${installDir} ...`);
    fs.mkdirSync(installDir, { recursive: true });
    run('git', ['clone', repoUrl, installDir]);
    ok('Cloned successfully.');
  }
}

// ── Step 3: register Claude Code skills ─────────────────────────────────────
function registerSkills(installDir) {
  console.log('');
  const claudeSkillsDir = path.join(os.homedir(), '.claude', 'skills');

  if (!hasClaudeCLI()) {
    warn('Claude Code CLI not found — skipping skill registration.');
    warn('Install Claude Code: https://claude.ai/code');
    return;
  }

  info('Registering SAP BTP skills with Claude Code...');
  fs.mkdirSync(claudeSkillsDir, { recursive: true });

  const skills = [
    'sap-btp-platform-architect',
    'sap-btp-developer',
    'sap-btp-security',
    'sap-btp-integration',
    'sap-btp-ai',
    'sap-btp-operations',
    'sap-b1-btp-integration',
  ];

  for (const skill of skills) {
    const src  = path.join(installDir, 'skills', skill, 'SKILL.md');
    const dest = path.join(claudeSkillsDir, skill);
    if (fs.existsSync(src)) {
      fs.mkdirSync(dest, { recursive: true });
      fs.copyFileSync(src, path.join(dest, 'SKILL.md'));
      ok(`Skill registered: ${skill}`);
    } else {
      warn(`Skill file not found: ${src}`);
    }
  }
}

// ── Step 4: inject shell aliases ─────────────────────────────────────────────
function injectAliases(installDir) {
  console.log('');
  info('Setting up shell aliases...');

  if (isWindows) {
    injectPowerShellAliases(installDir);
  } else {
    injectBashAliases(installDir);
  }
}

function injectBashAliases(installDir) {
  const aliasBlock = `
# SAP BTP Agent Kit
export SAP_BTP_KB="${installDir}"
alias btp-kit='cd "$SAP_BTP_KB"'
alias btp-catalog='cat "$SAP_BTP_KB/catalog/agent-service-index.yaml"'
alias btp-update='git -C "$SAP_BTP_KB" pull origin main'
alias btp-skills='ls "$SAP_BTP_KB/skills/"'
`;

  const candidates = ['.zshrc', '.bashrc', '.bash_profile'].map(f =>
    path.join(os.homedir(), f)
  );
  const rcFile = candidates.find(f => fs.existsSync(f));

  if (!rcFile) {
    warn('No shell config file found. Add these aliases manually:');
    console.log(aliasBlock);
    return;
  }

  const existing = fs.readFileSync(rcFile, 'utf8');
  if (existing.includes('SAP BTP Agent Kit')) {
    info(`Aliases already present in ${rcFile}`);
    return;
  }

  fs.appendFileSync(rcFile, aliasBlock, 'utf8');
  ok(`Aliases added to ${rcFile}`);
  info('Run: source ' + rcFile + '  (or open a new terminal)');
}

function injectPowerShellAliases(installDir) {
  const profilePath = getPowerShellProfile();
  if (!profilePath) {
    warn('Could not detect PowerShell profile. Add aliases manually.');
    return;
  }

  const aliasBlock = `
# SAP BTP Agent Kit
$env:SAP_BTP_KB = "${installDir.replace(/\\/g, '\\\\')}"
function btp-kit    { Set-Location $env:SAP_BTP_KB }
function btp-catalog { Get-Content (Join-Path $env:SAP_BTP_KB "catalog\\agent-service-index.yaml") }
function btp-update  { git -C $env:SAP_BTP_KB pull origin main }
function btp-skills  { Get-ChildItem (Join-Path $env:SAP_BTP_KB "skills") -Directory | Select-Object Name }
`;

  try {
    fs.mkdirSync(path.dirname(profilePath), { recursive: true });
    if (!fs.existsSync(profilePath)) fs.writeFileSync(profilePath, '', 'utf8');
    const existing = fs.readFileSync(profilePath, 'utf8');
    if (existing.includes('SAP BTP Agent Kit')) {
      info(`Aliases already present in ${profilePath}`);
      return;
    }
    fs.appendFileSync(profilePath, aliasBlock, 'utf8');
    ok(`Aliases added to ${profilePath}`);
    info('Run: . $PROFILE  (to reload in current session)');
  } catch (e) {
    warn(`Could not write to ${profilePath}: ${e.message}`);
  }
}

function getPowerShellProfile() {
  try {
    const result = spawnSync('powershell', ['-NoProfile', '-Command', 'echo $PROFILE'], {
      encoding: 'utf8', timeout: 5000
    });
    if (result.stdout) return result.stdout.trim();
  } catch (_) {}
  return path.join(os.homedir(), 'Documents', 'WindowsPowerShell', 'Microsoft.PowerShell_profile.ps1');
}

// ── Utilities ────────────────────────────────────────────────────────────────
function checkGit() {
  try {
    execSync('git --version', { stdio: 'ignore' });
  } catch (_) {
    err('git is not installed.\n' +
        '  Linux/Pi: sudo apt install git\n' +
        '  macOS:    brew install git\n' +
        '  Windows:  https://git-scm.com/download/win');
  }
}

function hasClaudeCLI() {
  try {
    execSync('claude --version', { stdio: 'ignore' });
    return true;
  } catch (_) {
    return false;
  }
}

function run(cmd, args) {
  const result = spawnSync(cmd, args, { stdio: 'inherit', encoding: 'utf8' });
  if (result.status !== 0) {
    err(`Command failed: ${cmd} ${args.join(' ')}`);
  }
}

function countFiles(dir) {
  let count = 0;
  function walk(d) {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      if (entry.name === '.git' || entry.name === 'node_modules') continue;
      entry.isDirectory()
        ? walk(path.join(d, entry.name))
        : count++;
    }
  }
  walk(dir);
  return count;
}

// ── Summary ──────────────────────────────────────────────────────────────────
function printSummary(installDir) {
  const fileCount = countFiles(installDir);
  const sep = '='.repeat(50);

  console.log('');
  console.log(c.green(sep));
  console.log(c.green(c.bold('  SAP BTP Agent Kit installed!')));
  console.log(c.green(sep));
  console.log('');
  console.log(`  ${c.bold('Location:')}     ${installDir}`);
  console.log(`  ${c.bold('AGENTS.md:')}    ${path.join(installDir, 'AGENTS.md')}`);
  console.log(`  ${c.bold('Service YAML:')} ${path.join(installDir, 'catalog', 'agent-service-index.yaml')}`);
  console.log(`  ${c.bold('Skills:')}       ${path.join(installDir, 'skills')}`);
  console.log(`  ${c.bold('Files:')}        ${fileCount}`);
  console.log('');
  console.log(`  ${c.bold('Commands')} (after reloading shell):`);
  console.log('    btp-kit       → navigate to knowledge base');
  console.log('    btp-catalog   → view service YAML index');
  console.log('    btp-update    → pull latest updates');
  console.log('    btp-skills    → list skills');
  console.log('');
  console.log(`  ${c.bold('Update:')} npx sap-btp-agent-kit --update`);
  console.log('');
}
