import { TemplateRegistry, TemplateConfig } from '../types';

export function validateProjectName(name: string): void {
  if (!name) {
    throw new Error('Project name is required');
  }

  if (name.length < 1) {
    throw new Error('Project name cannot be empty');
  }

  if (name.length > 50) {
    throw new Error('Project name cannot be longer than 50 characters');
  }

  // Check for valid characters
  if (!/^[a-zA-Z0-9-_\.]+$/.test(name)) {
    throw new Error('Project name can only contain letters, numbers, hyphens, underscores, and dots');
  }

  // Cannot start with dot or hyphen
  if (name.startsWith('.') || name.startsWith('-')) {
    throw new Error('Project name cannot start with a dot or hyphen');
  }

  // Cannot end with dot
  if (name.endsWith('.')) {
    throw new Error('Project name cannot end with a dot');
  }

  // Check for reserved names
  const reservedNames = [
    'node_modules',
    'package',
    'npm',
    'yarn',
    'pnpm',
    'git',
    '.git',
    'dist',
    'build',
    'public',
    'src',
    'lib',
    'bin',
    'test',
    'tests',
    'spec',
    'docs',
    'doc',
    'documentation',
  ];

  if (reservedNames.includes(name.toLowerCase())) {
    throw new Error(`"${name}" is a reserved name and cannot be used as a project name`);
  }
}

export function validateTemplate(templateName: string, registry: TemplateRegistry): TemplateConfig {
  if (!templateName) {
    throw new Error('Template name is required');
  }

  const template = registry.templates[templateName];
  
  if (!template) {
    const availableTemplates = Object.keys(registry.templates).join(', ');
    throw new Error(
      `Template "${templateName}" not found. Available templates: ${availableTemplates}`
    );
  }

  return template;
}

export function validateOptions(template: TemplateConfig, options: any): void {
  // Check if requested addons are supported by the template
  const requestedAddons = [];
  
  if (options.typescript) requestedAddons.push('typescript');
  if (options.tailwind) requestedAddons.push('tailwind');
  if (options.auth) requestedAddons.push('auth');
  if (options.prisma) requestedAddons.push('prisma');
  if (options.mongodb) requestedAddons.push('mongodb');
  if (options.mysql) requestedAddons.push('mysql');
  if (options.postgres) requestedAddons.push('postgres');

  const unsupportedAddons = requestedAddons.filter(addon => 
    !template.addons.includes(addon)
  );

  if (unsupportedAddons.length > 0) {
    throw new Error(
      `Template "${template.name}" does not support the following addons: ${unsupportedAddons.join(', ')}. ` +
      `Supported addons: ${template.addons.join(', ')}`
    );
  }

  // Check for conflicting database options
  const databaseOptions = [options.mongodb, options.mysql, options.postgres].filter(Boolean);
  if (databaseOptions.length > 1) {
    throw new Error('You can only select one database option');
  }
}

export function isValidRepositoryUrl(url: string): boolean {
  // Basic validation for repository URLs
  const gitHubRegex = /^[a-zA-Z0-9-_]+\/[a-zA-Z0-9-_\.]+$/;
  const gitUrlRegex = /^(https?:\/\/)?(github\.com\/|gitlab\.com\/|bitbucket\.org\/)/;
  
  return gitHubRegex.test(url) || gitUrlRegex.test(url);
}

export function sanitizeProjectName(name: string): string {
  // Remove invalid characters and make it a valid project name
  let sanitized = name
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-_.]/g, '-')
    .replace(/^[-.]/, '')
    .replace(/\.$/, '')
    .replace(/--+/g, '-');

  // Ensure it's not empty after sanitization
  if (!sanitized) {
    sanitized = 'my-project';
  }

  return sanitized;
} 