# RTG Template 🚀

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
npx rtg-template

# Or install globally
npm install -g rtg-template
```

## Quick Start 🏃‍♂️

```bash
# Interactive mode - choose your stack step by step
npx rtg-template

# Direct template usage
npx rtg-template react my-react-app --typescript --tailwind
npx rtg-template next my-next-app --auth
npx rtg-template node-api my-api --mongodb
```

## Available Templates 📋

| Template | Description | Frameworks | Add-ons |
|----------|-------------|------------|---------|
| `react` | React with Vite | React, Vite | TypeScript, Tailwind CSS, Redux Toolkit |
| `react-tailwind` | React with Tailwind CSS | React, Vite, Tailwind CSS | TypeScript, Redux Toolkit |
| `react-tailwind-ts` | React with Tailwind + TypeScript | React, Vite, Tailwind CSS, TypeScript | Redux Toolkit |
| `react-material-ui` | React with Material-UI | React, Vite, Material-UI | TypeScript, Redux Toolkit |
| `react-styled-components` | React with Styled Components | React, Vite, Styled Components | TypeScript, Redux Toolkit |
| `react-ts` | React with TypeScript | React, Vite, TypeScript | Tailwind CSS, Redux Toolkit |
| `next` | Next.js application | Next.js, React | TypeScript, Tailwind CSS, Auth |
| `node-api` | Express.js API | Node.js, Express | TypeScript, MongoDB, MySQL, PostgreSQL, Auth |
| `nestjs` | NestJS application | NestJS, TypeScript | Prisma, PostgreSQL, MySQL, Auth |
| `fastapi` | FastAPI Python app | FastAPI, Python | MySQL, PostgreSQL, Auth |

## Usage Examples 💡

### Interactive Mode
```bash
npx rtg-template
# Follow the prompts to select your template and options
```

### Direct Commands
```bash
# React app with TypeScript and Tailwind
npx rtg-template react my-app --typescript --tailwind

# React with Tailwind CSS (pre-built template)
npx rtg-template react-tailwind my-app

# React with Material-UI
npx rtg-template react-material-ui my-app

# React with Styled Components
npx rtg-template react-styled-components my-app

# React with TypeScript (pre-built template)
npx rtg-template react-ts my-app

# React with Tailwind + TypeScript (pre-built template)
npx rtg-template react-tailwind-ts my-app

# Next.js app with authentication
npx rtg-template next my-next-app --auth --typescript

# Node.js app with MongoDB
npx rtg-template node-api my-api --mongodb --typescript

# NestJS with Prisma and PostgreSQL
npx rtg-template nestjs my-nest-app --prisma --postgres
```

### Custom Repository
```bash
# Use a custom template repository
npx rtg-template react my-app --repo username/my-custom-template
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

## 📚 Complete Command Reference

### **Main Command**
```bash
npx rtg-template <template> <project-name> [options]
```

### **Available Commands**

| Command | Description | Example |
|---------|-------------|---------|
| `rtg-template --help` | Show help information | `npx rtg-template --help` |
| `rtg-template --version` | Show version | `npx rtg-template --version` |
| `rtg-template list` | List all available templates | `npx rtg-template list` |
| `rtg-template ls` | Alias for list command | `npx rtg-template ls` |
| `rtg-template interactive` | Run in interactive mode | `npx rtg-template interactive` |
| `rtg-template i` | Alias for interactive mode | `npx rtg-template i` |

### **Template-Specific Commands**

#### **React Templates**
```bash
# Basic React with Vite
npx rtg-template react my-app

# React with TypeScript
npx rtg-template react my-app --typescript

# React with Tailwind CSS
npx rtg-template react my-app --tailwind

# React with Redux Toolkit
npx rtg-template react my-app --redux-toolkit

# React with multiple options
npx rtg-template react my-app --typescript --tailwind --redux-toolkit

# Pre-built React templates
npx rtg-template react-tailwind my-app
npx rtg-template react-material-ui my-app
npx rtg-template react-styled-components my-app
npx rtg-template react-ts my-app
npx rtg-template react-tailwind-ts my-app
```

#### **Full-Stack Templates**
```bash
# Next.js
npx rtg-template next my-next-app
npx rtg-template next my-next-app --auth --typescript

# Node.js API
npx rtg-template node-api my-api
npx rtg-template node-api my-api --mongodb --typescript
npx rtg-template node-api my-api --postgres --auth

# NestJS
npx rtg-template nestjs my-nest-app
npx rtg-template nestjs my-nest-app --prisma --postgres

# FastAPI
npx rtg-template fastapi my-api
npx rtg-template fastapi my-api --mysql
```

#### **Advanced Options**
```bash
# Custom output directory
npx rtg-template react my-app --directory /path/to/projects

# Skip dependency installation
npx rtg-template react my-app --no-install

# Skip git initialization
npx rtg-template react my-app --no-git

# Use custom template repository
npx rtg-template react my-app --repo username/my-custom-template

# Interactive mode
npx rtg-template --interactive
```

## 🚀 Deployment Guide

### **Publishing to npm**

#### **1. Prepare for Publishing**
```bash
# Ensure you're logged in to npm
npm login

# Check your package.json
cat package.json

# Build the project
npm run build

# Test the build locally
node dist/cli.js --help
```

#### **2. Version Management**
```bash
# Update version (patch, minor, or major)
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.1 -> 1.1.0
npm version major  # 1.1.0 -> 2.0.0

# Or manually update in package.json
# "version": "1.0.0"
```

#### **3. Publishing**
```bash
# Publish to npm
npm publish

# For scoped packages (if using @your-org/rtg-template)
npm publish --access public
```

#### **4. Verify Publication**
```bash
# Check if package is published
npm view rtg-template

# Test the published package
npx rtg-template --version
```

### **Pre-publishing Checklist**
- [ ] All tests pass
- [ ] Build is successful (`npm run build`)
- [ ] Version is updated in `package.json`
- [ ] README.md is up to date
- [ ] All templates are working
- [ ] CLI commands are tested
- [ ] No sensitive information in the package

### **Post-publishing**
```bash
# Tag the release in git
git tag v1.0.0
git push origin v1.0.0

# Create a GitHub release (optional)
# Go to GitHub and create a new release with the tag
```

## 🧪 Local Testing Guide

### **Method 1: npm link (Recommended for Development)**

```bash
# 1. Build your project
npm run build

# 2. Create a global symlink
npm link

# 3. Test the command globally
rtg-template --help
rtg-template list
rtg-template react-tailwind my-test-app

# 4. When done testing, unlink
npm unlink
```

### **Method 2: Direct Node Execution**

```bash
# Test directly with node
node dist/cli.js --help
node dist/cli.js list
node dist/cli.js react-tailwind my-test-app
```

### **Method 3: Using npx with Local Path**

```bash
# Test with npx pointing to your local directory
npx . react-tailwind my-test-app
npx . list
npx . --help
```

### **Method 4: Development Mode with tsx**

```bash
# Run directly from TypeScript source (for development)
npm run dev react-tailwind my-test-app
npm run dev list
npm run dev --help
```

### **Method 5: Install Globally for Testing**

```bash
# Install your package globally for testing
npm install -g .

# Test globally
rtg-template --help
rtg-template list
rtg-template react-tailwind my-test-app

# Uninstall when done
npm uninstall -g rtg-template
```

### **Development Workflow**

```bash
# 1. Set up the link once
npm link

# 2. During development, just rebuild and test
npm run build
rtg-template list

# 3. Test different templates
rtg-template react-tailwind test-app1
rtg-template react-material-ui test-app2
rtg-template react-styled-components test-app3

# 4. Clean up test projects
rm -rf test-app1 test-app2 test-app3

# 5. When done developing, unlink
npm unlink
```

### **Testing Checklist**

#### **Basic Commands**
- [ ] `rtg-template --help`
- [ ] `rtg-template --version`
- [ ] `rtg-template list`

#### **Template Creation**
- [ ] `rtg-template react-tailwind my-app`
- [ ] `rtg-template react-material-ui my-app`
- [ ] `rtg-template react-styled-components my-app`
- [ ] `rtg-template react-tailwind-ts my-app`

#### **Options Testing**
- [ ] `rtg-template react my-app --typescript`
- [ ] `rtg-template react my-app --tailwind`
- [ ] `rtg-template react my-app --redux-toolkit`
- [ ] `rtg-template react my-app --typescript --tailwind --redux-toolkit`

#### **Interactive Mode**
- [ ] `rtg-template --interactive`

#### **Project Verification**
- [ ] Check if all files are created correctly
- [ ] Verify dependencies are installed
- [ ] Test if the project runs (`npm run dev`)

## Commands 📝

### Create Project
```bash
rtg-template <template> <project-name> [options]
```

### List Templates
```bash
rtg-template list
# or
rtg-template ls
```

### Interactive Mode
```bash
rtg-template interactive
# or
rtg-template i
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
git clone https://github.com/your-org/rtg-template.git
cd rtg-template

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
npx rtg-template react my-app --repo username/my-react-template

# Full Git URL
npx rtg-template react my-app --repo https://github.com/username/my-react-template
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
- Check available templates with `npx rtg-template list`
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

- 📧 Email: support@rtg-template.dev
- 🐛 Issues: [GitHub Issues](https://github.com/your-org/rtg-template/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/your-org/rtg-template/discussions)

---

Made with ❤️ by the RTG Template team 