#!/usr/bin/env node
'use strict';

const path  = require('path');
const fs    = require('fs');
const os    = require('os');
const { spawnSync } = require('child_process');

const ROOT = path.join(__dirname, '.');
const HOME = os.homedir();
const CWD  = process.cwd();

// ── ANSI helpers ─────────────────────────────────────────────────────────────
const A = {
  reset:   '\x1b[0m',
  bold:    '\x1b[1m',
  dim:     '\x1b[2m',
  cyan:    '\x1b[36m',
  green:   '\x1b[32m',
  yellow:  '\x1b[33m',
  red:     '\x1b[31m',
  up:      n => `\x1b[${n}A`,
  clrLine: '\x1b[2K\r',
};
const bold   = s => A.bold   + s + A.reset;
const cyan   = s => A.cyan   + s + A.reset;
const green  = s => A.green  + s + A.reset;
const yellow = s => A.yellow + s + A.reset;
const dim    = s => A.dim    + s + A.reset;

// ── Skills list ───────────────────────────────────────────────────────────────
const SKILLS = [
  'sap-btp-platform-architect',
  'sap-btp-developer',
  'sap-btp-security',
  'sap-btp-integration',
  'sap-btp-ai',
  'sap-btp-operations',
  'sap-b1-btp-integration',
];

// ── Pi Messenger — SAP BTP Squad profile ─────────────────────────────────────
const SAP_BTP_SQUAD = {
  name: 'sap-btp-squad',
  description: 'Equipo especializado en arquitectura, integración, seguridad, IA y desarrollo SAP BTP',
  roles: {
    'platform-architect': {
      description: 'Diseña subaccounts, regiones, runtimes, servicios, conectividad y gobierno',
      thinking: 'high',
      skills: ['sap-btp-rules'],
      prompt: 'Define decisiones arquitectónicas, alternativas, riesgos, costes y límites operativos.',
    },
    'integration-engineer': {
      description: 'Diseña Integration Suite, APIs, eventos y conectividad con sistemas on-premise',
      thinking: 'high',
      skills: ['sap-btp-rules'],
      prompt: 'Prioriza contratos, idempotencia, reintentos, trazabilidad y recuperación.',
    },
    'security-reviewer': {
      description: 'Revisa identidad, autorizaciones, secretos, red, auditoría y amenazas',
      thinking: 'high',
      skills: ['sap-btp-rules'],
      prompt: 'Aplica mínimo privilegio y bloquea operaciones sensibles sin autorización.',
    },
    'ai-engineer': {
      description: 'Diseña agentes, RAG, evaluación y observabilidad para soluciones BTP',
      thinking: 'high',
      skills: ['sap-btp-rules'],
      prompt: 'Incluye seguridad de herramientas, evaluación, coste, latencia y trazabilidad.',
    },
    'btp-developer': {
      description: 'Implementa CAP, Cloud SDK, APIs, pruebas y configuración BTP',
      thinking: 'medium',
      skills: ['sap-btp-rules'],
      prompt: 'Implementa cambios completos, probados y compatibles con las convenciones del proyecto.',
    },
  },
  approval: {
    mode: 'risk-labels',
    labels: ['security', 'auth', 'database', 'migration', 'destructive', 'api-contract', 'sap-write', 'production'],
  },
  memory: {
    inject: ['decision', 'interface', 'risk', 'handoff'],
    maxCharsPerType: 4000,
  },
};

const CREW_CONFIG = {
  concurrency: { workers: 3, max: 5 },
  dependencies: 'strict',
  coordination: 'moderate',
  review: { enabled: true, maxIterations: 3 },
  planning: { maxPasses: 2 },
  work: { maxAttemptsPerTask: 3, maxWaves: 20 },
};

const SAP_BTP_RULES_MD = `---
name: sap-btp-rules
description: Reglas de arquitectura, seguridad e implementación para SAP BTP.
---

# Reglas SAP BTP

- No realizar escrituras en SAP ni producción sin autorización explícita.
- Separar desarrollo, pruebas y producción en subaccounts distintos.
- Aplicar mínimo privilegio en roles, scopes e identidades.
- No incluir secretos en código, prompts, logs ni documentación.
- Documentar decisiones, riesgos, costes y alternativas.
- Las integraciones deben incluir idempotencia, reintentos y trazabilidad.
- Los cambios deben incluir validación, pruebas y procedimiento de rollback.
- Usar IAS como proveedor de identidad principal, XSUAA para autorización técnica.
- Cloud Connector requerido para cualquier acceso a sistemas on-premise.
- Los agentes de IA nunca llaman directamente a Service Layer de SAP B1.
`;

const PRD_TEMPLATE = `# PRD — Proyecto SAP BTP

## Objetivo

[Describe aquí el objetivo de tu proyecto BTP]

## Agentes requeridos

- platform-architect
- integration-engineer
- security-reviewer
- ai-engineer
- btp-developer

## Entregables

1. Arquitectura objetivo.
2. Diseño de integración.
3. Modelo de seguridad.
4. Diseño de IA y RAG.
5. Plan de implementación.
6. Revisión de riesgos y costes.

## Restricciones

- No ejecutar escrituras en SAP ni producción.
- Toda decisión importante debe quedar documentada.
- Los trabajos sensibles requieren aprobación humana.
`;

// ── CLI definitions ───────────────────────────────────────────────────────────
const CLIS = [
  { id: 'claude',  name: 'Claude Code',    desc: '~/.claude/skills/',                    install: installClaudeCode },
  { id: 'cursor',  name: 'Cursor',         desc: '~/.cursor/rules/',                     install: installCursor     },
  { id: 'opencode',name: 'OpenCode',       desc: '~/.opencode/',                         install: installOpenCode   },
  { id: 'copilot', name: 'GitHub Copilot', desc: '~/.github/copilot-instructions.md',    install: installCopilot    },
  { id: 'pi',      name: 'Pi  (pi.dev)',   desc: '~/.agents/skills/ + Pi Messenger crew',install: installPi         },
];

// ── Checkbox UI ───────────────────────────────────────────────────────────────
function renderMenu(items, cursor, selected) {
  const lines = [];
  lines.push(bold('  Para qué CLIs quieres instalar el SAP BTP Agent Kit?'));
  lines.push('');
  items.forEach((item, i) => {
    const isCursor   = i === cursor;
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
  return new Promise((resolve) => {
    if (!process.stdin.isTTY) {
      resolve(new Set(items.map((_, i) => i)));
      return;
    }
    const readline = require('readline');
    readline.emitKeypressEvents(process.stdin);
    process.stdin.setRawMode(true);

    let cursor = 0;
    const selected = new Set([0]);
    let drawn = 0;

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
      if (key.name === 'space') selected.has(cursor) ? selected.delete(cursor) : selected.add(cursor);
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

// ── Helpers ───────────────────────────────────────────────────────────────────
function skillContent(name) {
  const p = path.join(ROOT, 'skills', name, 'SKILL.md');
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
}
function agentsContent() {
  const p = path.join(ROOT, 'AGENTS.md');
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
}
function writeJSON(filePath, obj) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(obj, null, 2), 'utf8');
}
function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content, 'utf8');
}

// ── Installers ────────────────────────────────────────────────────────────────
function installClaudeCode() {
  const dest = path.join(HOME, '.claude', 'skills');
  fs.mkdirSync(dest, { recursive: true });
  let count = 0;
  for (const skill of SKILLS) {
    const src = path.join(ROOT, 'skills', skill, 'SKILL.md');
    if (fs.existsSync(src)) {
      const d = path.join(dest, skill);
      fs.mkdirSync(d, { recursive: true });
      fs.copyFileSync(src, path.join(d, 'SKILL.md'));
      count++;
    }
  }
  return `${count} skills → ${dest}`;
}

function installCursor() {
  const dest = path.join(HOME, '.cursor', 'rules');
  fs.mkdirSync(dest, { recursive: true });
  const sections = SKILLS.map(skill =>
    `---\ndescription: SAP BTP Agent Kit — ${skill}\nglobs:\nalwaysApply: false\n---\n\n${skillContent(skill)}`
  );
  const file = path.join(dest, 'sap-btp-agent-kit.mdc');
  fs.writeFileSync(file, sections.join('\n\n---\n\n'), 'utf8');
  return `sap-btp-agent-kit.mdc → ${dest}`;
}

function installOpenCode() {
  const dest = path.join(HOME, '.opencode');
  fs.mkdirSync(dest, { recursive: true });
  const content = agentsContent() + '\n\n## Available Skills\n' +
    SKILLS.map(s => `- ${s}`).join('\n') + '\n';
  fs.writeFileSync(path.join(dest, 'AGENTS.md'), content, 'utf8');
  return `AGENTS.md → ${dest}`;
}

function installCopilot() {
  const dest = path.join(HOME, '.github');
  fs.mkdirSync(dest, { recursive: true });
  const intro = '# SAP BTP Agent Kit — Copilot Instructions\n\n';
  const skills = SKILLS.map(s => `## ${s}\n\n${skillContent(s)}`).join('\n\n---\n\n');
  fs.writeFileSync(path.join(dest, 'copilot-instructions.md'), intro + skills, 'utf8');
  return `copilot-instructions.md → ${dest}`;
}

function installPi() {
  const results = [];

  // 1. Copy skills to ~/.agents/skills/
  const agentsSkillsDir = path.join(HOME, '.agents', 'skills');
  let count = 0;
  for (const skill of SKILLS) {
    const src  = path.join(ROOT, 'skills', skill, 'SKILL.md');
    const dest = path.join(agentsSkillsDir, skill);
    if (fs.existsSync(src)) {
      fs.mkdirSync(dest, { recursive: true });
      fs.copyFileSync(src, path.join(dest, 'SKILL.md'));
      count++;
    }
  }
  results.push(`${count} skills → ${agentsSkillsDir}`);

  // 2. Register skills with `pi skill add` (best-effort)
  let registered = 0;
  for (const skill of SKILLS) {
    const skillPath = path.join(agentsSkillsDir, skill);
    const r = spawnSync('pi', ['skill', 'add', skillPath], { encoding: 'utf8', timeout: 8000 });
    if (r.status === 0) registered++;
  }
  if (registered > 0) results.push(`${registered} skills registradas con pi skill add`);

  // 3. Pi Messenger — global team profile
  const teamProfilePath = path.join(HOME, '.pi', 'agent', 'messenger', 'team-profiles', 'sap-btp-squad.json');
  writeJSON(teamProfilePath, SAP_BTP_SQUAD);
  results.push(`sap-btp-squad.json → ~/.pi/agent/messenger/team-profiles/`);

  // 4. Pi Messenger — project-level crew config (in current working directory)
  const crewBase = path.join(CWD, '.pi', 'messenger', 'crew');
  writeJSON(path.join(crewBase, 'config.json'), CREW_CONFIG);
  writeFile(path.join(crewBase, 'skills', 'sap-btp-rules.md'), SAP_BTP_RULES_MD);
  results.push(`crew/config.json + skills/sap-btp-rules.md → ${path.join(CWD, '.pi', 'messenger', 'crew')}`);

  // 5. PRD template (only if not exists)
  const prdPath = path.join(CWD, 'PRD.md');
  if (!fs.existsSync(prdPath)) {
    fs.writeFileSync(prdPath, PRD_TEMPLATE, 'utf8');
    results.push(`PRD.md (plantilla) → ${CWD}`);
  }

  return results.join('\n        ');
}

// ── Banner ────────────────────────────────────────────────────────────────────
function banner() {
  console.log('');
  console.log(cyan('  ╔═══════════════════════════════════════════╗'));
  console.log(cyan('  ║') + bold('   SAP BTP Agent Kit  v1.0.3              ') + cyan('║'));
  console.log(cyan('  ║') + dim('   Agent-friendly SAP BTP knowledge base  ') + cyan('║'));
  console.log(cyan('  ╚═══════════════════════════════════════════╝'));
  console.log('');
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
      console.log(`  ${green('✓')} ${bold(cli.name)}`);
      const lines = msg.split('\n');
      lines.forEach(l => console.log(`        ${l}`));
    } catch (e) {
      console.log(`  ${A.red}✗${A.reset} ${bold(cli.name)} — Error: ${e.message}`);
    }
  }

  console.log('');

  if ([...selectedIdx].map(i => CLIS[i].id).includes('pi')) {
    console.log(cyan('  ─── Pi Messenger ───────────────────────────────'));
    console.log(dim('  Activa el equipo SAP BTP desde Pi con:'));
    console.log('');
    console.log('  ' + yellow('Activa el perfil sap-btp-squad, crea el plan'));
    console.log('  ' + yellow('desde PRD.md, pero no empieces hasta que'));
    console.log('  ' + yellow('revise el plan.'));
    console.log('');
  }

  console.log(green(bold('  ¡Listo!')));
  console.log(dim('  Reinicia tu CLI/editor para cargar los skills.\n'));
}

main().catch(e => {
  console.error('\n  Error: ' + e.message);
  process.exit(1);
});
