# Development Guide 🛠️

This document provides detailed instructions for setting up, developing, and contributing to the Get Template CLI tool.

## Prerequisites 📋

- Node.js 16+ 
- npm or yarn
- Git
- TypeScript knowledge (recommended)

## Initial Setup 🚀

### 1. Clone the Repository
```bash
git clone https://github.com/your-org/get-template.git
cd get-template
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Build the Project
```bash
npm run build
```

### 4. Test the CLI Locally
```bash
# Test in development mode
npm run dev react my-test-app --typescript

# Test built version
npm run start react my-test-app --typescript

# Test interactive mode
npm run dev -- --interactive
```

## Project Architecture 🏗️

### Directory Structure
```
get-template/
├── src/                    # Source code
│   ├── cli.ts             # CLI entry point
│   ├── commands/          # Command implementations
│   │   ├── create.ts      # Project creation
│   │   ├── list.ts        # Template listing
│   │   └── interactive.ts # Interactive mode
│   ├── core/              # Core functionality
│   │   ├── template-engine.ts  # Template processing
│   │   ├── registry.ts         # Template registry
│   │   └── post-install.ts     # Post-install hooks
│   ├── utils/             # Utility functions
│   │   └── validation.ts  # Input validation
│   └── types.ts           # TypeScript interfaces
├── templates/             # Example templates
├── dist/                  # Built output (generated)
├── tests/                 # Test files (to be added)
└── docs/                  # Additional documentation
```

### Key Components

#### 1. CLI Interface (`src/cli.ts`)
- Uses Commander.js for argument parsing
- Defines all CLI options and commands
- Routes to appropriate command handlers

#### 2. Template Engine (`src/core/template-engine.ts`)
- Handles template cloning using degit
- Processes template variables
- Manages conditional files based on options

#### 3. Registry System (`src/core/registry.ts`)
- Maintains built-in template configurations
- Supports external template registries
- Provides template lookup and validation

#### 4. Post-Install Runner (`src/core/post-install.ts`)
- Installs dependencies
- Creates environment files
- Runs custom setup scripts

## Development Workflow 🔄

### 1. Making Changes
```bash
# Create a feature branch
git checkout -b feature/new-template-support

# Make your changes
# Edit src files...

# Build and test
npm run build
npm run dev react test-app --typescript
```

### 2. Testing Changes
```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Run tests (when implemented)
npm test
```

### 3. Adding New Templates

#### Option A: Built-in Templates
1. Add template configuration to `src/core/registry.ts`:
```typescript
'vue': {
  name: 'vue',
  description: 'Vue.js application with Vite',
  repository: 'vitejs/vite/packages/create-vite/template-vue',
  frameworks: ['Vue', 'Vite'],
  addons: ['typescript', 'tailwind'],
  postInstall: {
    dependencies: ['vue'],
    devDependencies: ['@vitejs/plugin-vue', 'vite'],
    instructions: 'Run `npm run dev` to start development.'
  }
}
```

2. Test the new template:
```bash
npm run dev vue my-vue-app --typescript
```

#### Option B: External Repository Templates
Templates can be hosted in separate repositories and referenced by URL.

### 4. Template Development Best Practices

#### Template Variables
Use these placeholders in template files:
- `{{PROJECT_NAME}}` → MY_PROJECT
- `{{project-name}}` → my-project  
- `{{Project Name}}` → My Project

#### File Structure
```
your-template/
├── package.json           # Use template variables
├── src/
│   ├── index.js          # Main application file
│   └── components/       # Framework-specific structure
├── .env.example          # Environment template
├── README.md             # Project documentation
└── .get-template.js      # Optional custom post-install
```

#### Custom Post-Install Scripts
Create `.get-template.js` for complex setup:
```javascript
module.exports = {
  async postInstall(targetPath) {
    // Custom setup logic
    console.log('Running custom setup...');
    
    // Example: Create additional directories
    const fs = require('fs-extra');
    await fs.ensureDir(path.join(targetPath, 'custom-dir'));
  }
};
```

## Testing Guide 🧪

### Manual Testing
```bash
# Test basic functionality
npm run dev react test-react --typescript --tailwind

# Test interactive mode
npm run dev -- --interactive

# Test error cases
npm run dev invalid-template test-app
npm run dev react ""  # Empty project name
```

### Template Testing Checklist
- [ ] Template clones successfully
- [ ] Variables are replaced correctly
- [ ] Dependencies install without errors
- [ ] Project builds and runs
- [ ] Optional features work (TypeScript, Tailwind, etc.)
- [ ] Post-install instructions are accurate

## Debugging 🐛

### Common Development Issues

#### 1. Template Clone Fails
```bash
# Check if degit is working
npx degit vitejs/vite/packages/create-vite/template-react test-clone
```

#### 2. Module Import Errors
```bash
# Rebuild the project
rm -rf dist/
npm run build
```

#### 3. CLI Command Not Found
```bash
# Check if build output exists
ls -la dist/

# Run directly with node
node dist/cli.js react test-app
```

### Debug Mode
Add debug logging in development:
```typescript
// In template-engine.ts
console.log('DEBUG: Cloning from', repository);
console.log('DEBUG: Target path', targetPath);
```

## Publishing 📦

### 1. Version Management
```bash
# Update version
npm version patch|minor|major

# Update changelog
# Edit CHANGELOG.md
```

### 2. Build for Production
```bash
npm run build
npm run test
npm run lint
```

### 3. Publish to npm
```bash
npm publish
```

## Contributing Guidelines 🤝

### Code Style
- Use TypeScript for all new code
- Follow existing code formatting
- Add JSDoc comments for public APIs
- Use meaningful variable names

### Git Workflow
```bash
# 1. Create feature branch
git checkout -b feature/description

# 2. Make commits with clear messages
git commit -m "feat: add vue template support"

# 3. Push and create PR
git push origin feature/description
```

### Commit Message Format
- `feat:` New features
- `fix:` Bug fixes  
- `docs:` Documentation changes
- `refactor:` Code refactoring
- `test:` Test additions/changes

## Performance Considerations ⚡

### Template Cloning
- Use degit for fast, shallow clones
- Cache template metadata when possible
- Parallelize independent operations

### Dependency Installation
- Allow users to skip with `--no-install`
- Use package manager detection
- Provide progress feedback

## Security 🔒

### Template Sources
- Validate repository URLs
- Use HTTPS for all external requests
- Sanitize user input for file paths

### File Operations
- Validate target directories
- Prevent directory traversal attacks
- Use safe file operations (fs-extra)

## Future Roadmap 🗺️

### Planned Features
- [ ] Template validation and testing framework
- [ ] Plugin system for custom processors  
- [ ] Template marketplace/registry
- [ ] Docker support for templates
- [ ] AI-powered template suggestions
- [ ] Template versioning and updates

### Technical Debt
- [ ] Add comprehensive test suite
- [ ] Improve error handling and messages
- [ ] Add telemetry and usage analytics
- [ ] Performance optimization for large templates

## Getting Help 🆘

### Resources
- GitHub Issues: Report bugs and request features
- GitHub Discussions: Ask questions and share ideas
- Code Review: Submit PRs for feedback

### Team Contacts
- Lead Developer: [@username](https://github.com/username)
- Maintainers: [@maintainer1](https://github.com/maintainer1)

---

Happy coding! 🎉 