# Get Template 🚀

A powerful CLI tool for quickly scaffolding full-stack project templates with your preferred tech stacks.

## Features ✨

- **Quick Setup**: Scaffold projects in seconds with pre-configured templates
- **Interactive Mode**: Choose your stack through an intuitive CLI interface
- **Flexible Options**: Mix and match frameworks, databases, and add-ons
- **Post-Install Hooks**: Automatic dependency installation and project setup
- **Extensible**: Support for custom and community templates
- **TypeScript Ready**: Full TypeScript support across all templates

## Installation 📦

```bash
# Use via npx (recommended)
npx get-template

# Or install globally
npm install -g get-template
```

## Quick Start 🏃‍♂️

```bash
# Interactive mode - choose your stack step by step
npx get-template

# Direct template usage
npx get-template react my-react-app --typescript --tailwind
npx get-template next my-next-app --auth
npx get-template node-api my-api --mongodb
```

## Available Templates 📋

| Template | Description | Frameworks | Add-ons |
|----------|-------------|------------|---------|
| `react` | React with Vite | React, Vite | TypeScript, Tailwind CSS |
| `react-ts` | React with TypeScript | React, Vite, TypeScript | Tailwind CSS, Auth |
| `next` | Next.js application | Next.js, React | TypeScript, Tailwind CSS, Auth |
| `node-api` | Express.js API | Node.js, Express | TypeScript, MongoDB, MySQL, PostgreSQL, Auth |
| `nestjs` | NestJS application | NestJS, TypeScript | Prisma, PostgreSQL, MySQL, Auth |
| `fastapi` | FastAPI Python app | FastAPI, Python | MySQL, PostgreSQL, Auth |

## Usage Examples 💡

### Interactive Mode
```bash
npx get-template
# Follow the prompts to select your template and options
```

### Direct Commands
```bash
# React app with TypeScript and Tailwind
npx get-template react my-app --typescript --tailwind

# Next.js app with authentication
npx get-template next my-next-app --auth --typescript

# Node.js API with MongoDB
npx get-template node-api my-api --mongodb --typescript

# NestJS with Prisma and PostgreSQL
npx get-template nestjs my-nest-app --prisma --postgres
```

### Custom Repository
```bash
# Use a custom template repository
npx get-template react my-app --repo username/my-custom-template
```

## CLI Options 🛠️

| Option | Description | Example |
|--------|-------------|---------|
| `-t, --typescript` | Add TypeScript support | `--typescript` |
| `--tailwind` | Add Tailwind CSS | `--tailwind` |
| `--auth` | Add authentication setup | `--auth` |
| `--prisma` | Add Prisma ORM | `--prisma` |
| `--mongodb` | Add MongoDB support | `--mongodb` |
| `--mysql` | Add MySQL support | `--mysql` |
| `--postgres` | Add PostgreSQL support | `--postgres` |
| `-i, --interactive` | Run in interactive mode | `--interactive` |
| `-d, --directory <dir>` | Output directory | `--directory ./projects` |
| `--repo <repository>` | Custom template repository | `--repo org/template` |
| `--no-install` | Skip dependency installation | `--no-install` |
| `--no-git` | Skip git initialization | `--no-git` |

## Commands 📝

### Create Project
```bash
get-template <template> <project-name> [options]
```

### List Templates
```bash
get-template list
# or
get-template ls
```

### Interactive Mode
```bash
get-template interactive
# or
get-template i
```

## Template Structure 🏗️

Templates can include the following features:

### Template Variables
Templates support variable replacement:
- `{{PROJECT_NAME}}` - Project name in uppercase
- `{{project-name}}` - Project name in lowercase
- `{{Project Name}}` - Project name in title case

### Post-Install Configuration
Templates can include a post-install configuration in the registry:

```typescript
{
  postInstall: {
    dependencies: ['react', 'react-dom'],
    devDependencies: ['@vitejs/plugin-react', 'vite'],
    envTemplate: 'PORT=3000\nNODE_ENV=development\n',
    scripts: ['npm run build'],
    instructions: 'Run `npm run dev` to start development server.'
  }
}
```

## Development 🔧

### Setup
```bash
# Clone the repository
git clone https://github.com/your-org/get-template.git
cd get-template

# Install dependencies
npm install

# Build the project
npm run build

# Run in development mode
npm run dev <template> <project-name>
```

### Project Structure
```
src/
├── cli.ts              # Main CLI entry point
├── commands/           # CLI commands
│   ├── create.ts      # Project creation logic
│   ├── list.ts        # Template listing
│   └── interactive.ts # Interactive mode
├── core/              # Core functionality
│   ├── template-engine.ts  # Template processing
│   ├── registry.ts         # Template registry
│   └── post-install.ts     # Post-install hooks
├── utils/             # Utility functions
│   └── validation.ts  # Input validation
└── types.ts           # TypeScript types
```

### Adding New Templates

1. **Add to Registry**: Update `src/core/registry.ts` with your template configuration
2. **Create Template**: Add your template files to the `templates/` directory or use an external repository
3. **Test**: Run the CLI with your new template

Example template configuration:
```typescript
'my-template': {
  name: 'my-template',
  description: 'My awesome template',
  repository: 'github-user/my-template-repo',
  frameworks: ['React', 'Express'],
  addons: ['typescript', 'tailwind'],
  postInstall: {
    dependencies: ['express'],
    instructions: 'Run `npm start` to begin!'
  }
}
```

## Contributing 🤝

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Guidelines
- Add tests for new features
- Update documentation for any API changes
- Follow the existing code style
- Ensure all tests pass

## Custom Templates 🎨

You can use custom templates from any Git repository:

```bash
# GitHub shorthand
npx get-template react my-app --repo username/my-react-template

# Full Git URL
npx get-template react my-app --repo https://github.com/username/my-react-template
```

### Template Repository Structure
```
your-template-repo/
├── package.json
├── src/
│   └── index.js
├── .env.example
└── .get-template.js  # Optional custom post-install script
```

## Troubleshooting 🔍

### Common Issues

**Template not found**
- Check available templates with `get-template list`
- Verify the template name spelling

**Permission errors**
- Try running with `sudo` on Unix systems
- Check directory permissions

**Git errors**
- Ensure Git is installed and configured
- Check network connectivity for remote repositories

**Dependency installation fails**
- Check your internet connection
- Try with `--no-install` flag and install manually

## License 📄

MIT © [Your Name]

## Support 💬

- 📧 Email: support@get-template.dev
- 🐛 Issues: [GitHub Issues](https://github.com/your-org/get-template/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-org/get-template/discussions)

---

Made with ❤️ by the Get Template team 