#!/usr/bin/env node
'use strict';

const path = require('path');
const fs   = require('fs');
const os   = require('os');

const ROOT = path.join(__dirname, '..');
const HOME = os.homedir();

// ── ANSI helpers ─────────────────────────────────────────────────────────────
const A = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  dim:    '\x1b[2m',
  cyan:   '\x1b[36m',
  green:  '\x1b[32m',
  yellow: '\x1b[33m',
  red:    '\x1b[31m',
  white:  '\x1b[37m',
  up:     n => `\x1b[${n}A`,
  clrLine: '\x1b[2K\r',
};
const bold   = s => A.bold + s + A.reset;
const cyan   = s => A.cyan + s + A.reset;
const green  = s => A.green + s + A.reset;
const yellow = s => A.yellow + s + A.reset;
const dim    = s => A.dim + s + A.reset;

// ── CLI definitions ───────────────────────────────────────────────────────────
const CLIS = [
  {
    id:      'claude',
    name:    'Claude Code',
    dest:    path.join(HOME, '.claude', 'skills'),
    desc:    '~/.claude/skills/',
    install: installClaudeCode,
  },
  {
    id:      'cursor',
    name:    'Cursor',
    dest:    path.join(HOME, '.cursor', 'rules'),
    desc:    '~/.cursor/rules/',
    install: installCursor,
  },
  {
    id:      'opencode',
    name:    'OpenCode',
    dest:    path.join(HOME, '.opencode'),
    desc:    '~/.opencode/',
    install: installOpenCode,
  },
  {
    id:      'copilot',
    name:    'GitHub Copilot',
    dest:    path.join(HOME, '.github'),
    desc:    '~/.github/copilot-instructions.md',
    install: installCopilot,
  },
  {
    id:      'pi',
    name:    'Pi  (pi.dev)',
    dest:    path.join(HOME, '.pi'),
    desc:    '~/.pi/instructions.md',
    install: installPi,
  },
];

const SKILLS = [
  'sap-btp-platform-architect',
  'sap-btp-developer',
  'sap-btp-security',
  'sap-btp-integration',
  'sap-btp-ai',
  'sap-btp-operations',
  'sap-b1-btp-integration',
];

// ── Banner ────────────────────────────────────────────────────────────────────
function banner() {
  console.log('');
  console.log(cyan('  ╔═══════════════════════════════════════════╗'));
  console.log(cyan('  ║') + bold('   SAP BTP Agent Kit  v1.0.1              ') + cyan('║'));
  console.log(cyan('  ║') + dim('   Agent-friendly SAP BTP knowledge base  ') + cyan('║'));
  console.log(cyan('  ╚═══════════════════════════════════════════╝'));
  console.log('');
}

// ── Checkbox UI ───────────────────────────────────────────────────────────────
function renderMenu(items, cursor, selected) {
  const lines = [];
  lines.push(bold('  Para qué CLIs quieres instalar el kit?'));
  lines.push('');
  items.forEach((item, i) => {
    const isCursor  = i === cursor;
    const isSelected = selected.has(i);
    const bullet = isSelected ? green('◉') : dim('○');
    const name   = isCursor ? bold(cyan(item.name.padEnd(18))) : item.name.padEnd(18);
    const dest   = dim('→ ' + item.desc);
    const prefix = isCursor ? cyan('▶ ') : '  ';
    lines.push(`${prefix}${bullet} ${name} ${dest}`);
  });
  lines.push('');
  lines.push(dim('  [↑↓] mover   [SPACE] seleccionar   [ENTER] confirmar   [q] salir'));
  lines.push('');
  return lines;
}

function promptCheckboxes(items) {
  return new Promise((resolve, reject) => {
    if (!process.stdin.isTTY) {
      // Non-interactive: select all by default
      resolve(new Set(items.map((_, i) => i)));
      return;
    }

    const readline = require('readline');
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);

    let cursor   = 0;
    const selected = new Set([0]); // Claude Code pre-selected
    let drawn    = 0;

    const draw = () => {
      if (drawn > 0) process.stdout.write(A.up(drawn));
      const lines = renderMenu(items, cursor, selected);
      lines.forEach(l => process.stdout.write(A.clrLine + l + '\n'));
      drawn = lines.length;
    };

    draw();

    process.stdin.on('keypress', (str, key) => {
      if (!key) return;
      if (key.name === 'up')    cursor = (cursor - 1 + items.length) % items.length;
      if (key.name === 'down')  cursor = (cursor + 1) % items.length;
      if (key.name === 'space') {
        selected.has(cursor) ? selected.delete(cursor) : selected.add(cursor);
      }
      if (key.name === 'return') {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        console.log('');
        resolve(selected);
        return;
      }
      if (key.name === 'q' || (key.ctrl && key.name === 'c')) {
        process.stdin.setRawMode(false);
        process.stdin.pause();
        console.log('\n' + yellow('  Cancelado.'));
        process.exit(0);
      }
      draw();
    });
  });
}

// ── Installers ────────────────────────────────────────────────────────────────

function skillContent(skillName) {
  const p = path.join(ROOT, 'skills', skillName, 'SKILL.md');
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
}

function agentsContent() {
  const p = path.join(ROOT, 'AGENTS.md');
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
}

function installClaudeCode(cli) {
  fs.mkdirSync(cli.dest, { recursive: true });
  let count = 0;
  for (const skill of SKILLS) {
    const src  = path.join(ROOT, 'skills', skill, 'SKILL.md');
    const dest = path.join(cli.dest, skill);
    if (fs.existsSync(src)) {
      fs.mkdirSync(dest, { recursive: true });
      fs.copyFileSync(src, path.join(dest, 'SKILL.md'));
      count++;
    }
  }
  return `${count} skills registrados en ${cli.dest}`;
}

function installCursor(cli) {
  fs.mkdirSync(cli.dest, { recursive: true });
  const destFile = path.join(cli.dest, 'sap-btp-agent-kit.mdc');
  const sections = SKILLS.map(skill => {
    const content = skillContent(skill);
    return `---
description: SAP BTP Agent Kit — ${skill}
globs:
alwaysApply: false
---

${content}`;
  });
  fs.writeFileSync(destFile, sections.join('\n\n---\n\n'), 'utf8');
  return `sap-btp-agent-kit.mdc generado en ${cli.dest}`;
}

function installOpenCode(cli) {
  fs.mkdirSync(cli.dest, { recursive: true });
  const agents = agentsContent();
  const skillsSummary = SKILLS.map(s => `- ${s}`).join('\n');
  const content = `${agents}\n\n## Available Skills\n${skillsSummary}\n\nSkills located at: ${path.join(ROOT, 'skills')}\n`;
  fs.writeFileSync(path.join(cli.dest, 'AGENTS.md'), content, 'utf8');
  return `AGENTS.md instalado en ${cli.dest}`;
}

function installCopilot(cli) {
  fs.mkdirSync(cli.dest, { recursive: true });
  const destFile = path.join(cli.dest, 'copilot-instructions.md');
  const intro = `# SAP BTP Agent Kit — Copilot Instructions\n\nThis file provides SAP BTP context for GitHub Copilot.\nGenerated by @ginesmr/sap-btp-agent-kit.\n\n`;
  const skills = SKILLS.map(skill => {
    const content = skillContent(skill);
    return `## ${skill}\n\n${content}`;
  }).join('\n\n---\n\n');
  fs.writeFileSync(destFile, intro + skills, 'utf8');
  return `copilot-instructions.md generado en ${cli.dest}`;
}

function installPi(cli) {
  fs.mkdirSync(cli.dest, { recursive: true });
  const agents = agentsContent();
  const skills = SKILLS.map(skill => {
    const content = skillContent(skill);
    return `## ${skill}\n\n${content}`;
  }).join('\n\n---\n\n');
  const content = `# SAP BTP Agent Kit — Pi Instructions\n\n${agents}\n\n# Skills\n\n${skills}\n`;
  fs.writeFileSync(path.join(cli.dest, 'instructions.md'), content, 'utf8');
  return `instructions.md instalado en ${cli.dest}`;
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  banner();

  const selectedIdx = await promptCheckboxes(CLIS);

  if (selectedIdx.size === 0) {
    console.log(yellow('  No seleccionaste ningún CLI. Nada que instalar.'));
    process.exit(0);
  }

  console.log(bold('  Instalando...\n'));

  for (const idx of selectedIdx) {
    const cli = CLIS[idx];
    try {
      const msg = cli.install(cli);
      console.log(`  ${green('✓')} ${bold(cli.name)} — ${msg}`);
    } catch (e) {
      console.log(`  ${A.red}✗${A.reset} ${bold(cli.name)} — Error: ${e.message}`);
    }
  }

  console.log('');
  console.log(green(bold('  ¡Listo!')));
  console.log(dim('  Reinicia tu CLI/editor para cargar los skills.\n'));
}

main().catch(e => {
  console.error('\n  Error: ' + e.message);
  process.exit(1);
});
