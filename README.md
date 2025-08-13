<div align="center">

# RTG Template

Effortless React/Vite project scaffolding with optional TypeScript and one‑click add‑ons. Stop wiring boilerplates — ship faster.

[![npm version](https://img.shields.io/npm/v/rtg-template.svg)](https://www.npmjs.com/package/rtg-template)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16.0.0-339933)](https://nodejs.org/)

</div>

---

## Why RTG Template?

- Rapidly bootstrap production‑ready React apps with Vite
- Pick your UI stack in seconds: Tailwind CSS, Styled Components, MUI, or Chakra UI
- Add state/data tools instantly: Redux Toolkit, TanStack Query
- Sensible defaults baked‑in: React Router, Axios, Husky, ESLint, Prettier
- Interactive mode for a guided setup, or one command for power users

No more yak‑shaving. One tool, great defaults, optional add‑ons.

---

## Quick Start

Use npx (recommended):

```bash
npx rtg-template react my-app --tailwind --redux
cd my-app
npm run dev
```

Or install globally:

```bash
npm i -g rtg-template
rtg-template react-ts my-app --mui --tanstack-query
```

Interactive mode (guided):

```bash
npx rtg-template --interactive
```

---

## Features

- React + Vite starter templates (JS and TS)
- Production-ready templates, power-packed with Axios, Husky, ESLint, and Prettier
- Optional React Router (disable with `--no-route`)
- Pluggable add‑ons that modify code, deps, and Vite config when needed
- Automated post‑install: deps installation, Husky setup, lint‑staged hook
- Works with local templates and remote repositories via degit

---

## Templates

- `react`: React + Vite + React Router + Axios + Husky + ESLint + Prettier
- `react-ts`: React + TypeScript + Vite + React Router + Axios + Husky + ESLint + Prettier

List available templates and add‑ons:

```bash
npx rtg-template list
```

---

## Add‑ons (flags)

- `--tailwind`: Tailwind CSS (Vite integration auto‑configured)
- `--styled-components`: Styled Components
- `--mui`: Material UI (MUI) + icons + emotion
- `--chakra`: Chakra UI + emotion + framer‑motion
- `--redux`: Redux Toolkit + React Redux + typed hooks scaffold
- `--tanstack-query`: TanStack React Query + ready‑to‑use `QueryClient`
- `--no-route`: Skip React Router setup and dependencies

Note: Choose only one UI library at a time (`tailwind`, `styled-components`, `mui`, or `chakra`).

---

## CLI Usage

```bash
rtg-template <template> [project-name] [options]

Options:
  --tailwind                 Add Tailwind CSS
  --styled-components        Add Styled Components
  --mui                      Add Material-UI (MUI)
  --chakra                   Add Chakra UI
  --redux                    Add Redux Toolkit
  --tanstack-query           Add TanStack Query (React Query)
  --no-route                 Skip React Router installation
  -i, --interactive          Run in interactive mode
  -d, --directory <dir>      Output directory (default: ".")
  --repo <repository>        Custom template repository (local: or remote)
  --no-install               Skip dependency installation
  --no-git                   Skip git initialization
  -V, --version              Show version
  -h, --help                 Show help
```

### Examples

```bash
# React + Tailwind + Redux Toolkit
npx rtg-template react my-app --tailwind --redux

# React TS + MUI + TanStack Query
npx rtg-template react-ts dashboard --mui --tanstack-query

# React without routing
npx rtg-template react landing --chakra --no-route

# Choose everything interactively
npx rtg-template --interactive

# Output to a specific directory
npx rtg-template react-ts admin-portal -d ./apps
```

---

## Custom Templates

You can scaffold from your own template repository via degit syntax:

- Local path bundled in this package: `--repo local:templates/react` (default for built‑ins)
- GitHub shorthand: `--repo user/repo` or `--repo user/repo/path`
- Full URL: `--repo https://github.com/user/repo`

Example:

```bash
npx rtg-template react my-app --repo user/awesome-react-template
```

---

## What you get

Depending on your selections, RTG Template will:

- Clone the template (local or remote)
- Replace placeholders, e.g. `{{PROJECT_NAME}}`, `{{project-name}}`, `{{Project Name}}`
- Install dependencies (unless `--no-install`)
- Apply add‑ons: add files, scripts, deps, and update Vite config if needed
- Initialize git and a pre‑commit hook (unless `--no-git`)
- Print friendly next steps

---

## Requirements

- Node.js >= 16.0.0
- npm, yarn, or pnpm (npm is used internally for installs by default)

---

## Programmatic API (optional)

You can also drive RTG Template from Node/TypeScript:

```ts
import { createProject, getTemplateRegistry } from 'rtg-template';

const registry = await getTemplateRegistry();
await createProject('react-ts', 'my-app', {
  mui: true,
  tanstackQuery: true,
  git: true,
  install: true,
});
```

---

## Troubleshooting

- "Template \"X\" not found": Only `react`, `react-ts` are built‑in. Use `list`, switch the name, or provide `--repo`.
- "Directory already exists": Choose a different `project-name` or remove the existing folder.
- Husky/lint‑staged didn’t install: Ensure git is available, or re‑run `npx husky install` inside the project.
- Router disabled but imports remain: Use `--no-route`. RTG Template will clean router imports in `main.(j|t)sx` and `App.(j|t)sx` when possible.

---

## Contributing

Contributions are welcome! If you have ideas for new templates, add‑ons, or improvements:

1. Fork the repo and create a feature branch
2. Add or modify templates under `templates/`
3. Register new templates in `src/core/registry.ts`
4. Add add‑on configs in `src/core/addons.ts` if needed
5. `npm run build` and test locally with `npx tsx src/cli.ts`
6. Open a PR 🎉

For deeper internals, see `COMPREHENSIVE_DOCUMENTATION.md` and `DEVELOPMENT.md`.

---

## Support 💬

- 🐛 Issues: [GitHub Issues](https://github.com/J-Prajwal/rtg-templates/issues)

Made with ❤️ by the RTG Template team

---

## License

MIT © RTG Template Contributors

---

## SEO Keywords

react template, react boilerplate, vite template, react typescript starter, react cli generator, project scaffolding, tailwind css, styled components, material ui, chakra ui, redux toolkit, tanstack query, react router, husky, eslint, prettier
