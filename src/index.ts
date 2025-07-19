// Main exports for the get-template CLI
export { createProject } from './commands/create';
export { listTemplates } from './commands/list';
export { interactive } from './commands/interactive';

export { TemplateEngine } from './core/template-engine';
export { PostInstallRunner } from './core/post-install';
export { getTemplateRegistry } from './core/registry';

export * from './types';
export * from './utils/validation'; 