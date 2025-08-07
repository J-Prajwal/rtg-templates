# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-XX

### Added
- Initial release of rtg-template CLI tool
- Support for React, Next.js, Node.js API, NestJS, and FastAPI templates
- Interactive CLI mode with inquirer prompts
- Command-line flags for customizing templates (--typescript, --tailwind, --auth, etc.)
- Template engine with degit integration for fast cloning
- Post-install hooks for dependency installation and setup
- Built-in template registry with extensibility for external templates
- Custom repository support via --repo flag
- Project validation and error handling
- Template variable replacement system
- Git initialization for new projects
- Environment file generation (.env and .env.example)
- Comprehensive documentation and development guides

### Features
- **CLI Commands:**
  - `rtg-template <template> <project-name> [options]` - Create new project
  - `rtg-template list` - List available templates
  - `rtg-template interactive` - Run in interactive mode

- **Supported Templates:**
  - `react` - React with Vite
  - `react-ts` - React with TypeScript and Vite
  - `next` - Next.js application
  - `node-api` - Express.js API
  - `nestjs` - NestJS application
  - `fastapi` - FastAPI Python application

- **Add-on Support:**
  - TypeScript integration
  - Tailwind CSS setup
  - Authentication scaffolding
  - Database support (MongoDB, MySQL, PostgreSQL)
  - Prisma ORM integration

### Technical Implementation
- TypeScript codebase with full type safety
- Commander.js for CLI argument parsing
- Inquirer.js for interactive prompts
- Degit for fast template cloning
- Ora for loading spinners and user feedback
- Chalk for colorized terminal output
- fs-extra for enhanced file operations

### Documentation
- Comprehensive README with usage examples
- Development guide with architecture overview
- Template creation guidelines
- Contributing guidelines
- Troubleshooting guide

## [Unreleased]

### Planned
- Template validation and testing framework
- Plugin system for custom processors
- Template marketplace/registry
- Docker support for templates
- Performance optimizations
- Test suite implementation
- Telemetry and analytics (opt-in) 