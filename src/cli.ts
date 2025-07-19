#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { version } from '../package.json';
import { createProject } from './commands/create';
import { listTemplates } from './commands/list';
import { interactive } from './commands/interactive';

const program = new Command();

program
  .name('rtg-template')
  .description('A CLI tool for quickly scaffolding full-stack project templates')
  .version(version);

program
  .argument('[template]', 'Template name to use (e.g., react, next, node-api)')
  .argument('[project-name]', 'Name of the project to create')
  .option('-t, --typescript', 'Add TypeScript support')
  .option('--tailwind', 'Add Tailwind CSS')
  .option('--redux-toolkit', 'Add Redux Toolkit')
  .option('--auth', 'Add authentication setup')
  .option('--prisma', 'Add Prisma ORM')
  .option('--mongodb', 'Add MongoDB support')
  .option('--mysql', 'Add MySQL support')
  .option('--postgres', 'Add PostgreSQL support')
  .option('-i, --interactive', 'Run in interactive mode')
  .option('-d, --directory <dir>', 'Output directory', '.')
  .option('--repo <repository>', 'Custom template repository')
  .option('--no-install', 'Skip dependency installation')
  .option('--no-git', 'Skip git initialization')
  .action(async (template, projectName, options) => {
    try {
      if (options.interactive || (!template && !projectName)) {
        await interactive();
      } else {
        await createProject(template, projectName, options);
      }
    } catch (error) {
      console.error(chalk.red('Error:'), error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });

program
  .command('list')
  .alias('ls')
  .description('List available templates')
  .action(async () => {
    await listTemplates();
  });

program
  .command('interactive')
  .alias('i')
  .description('Run in interactive mode')
  .action(async () => {
    await interactive();
  });

// Error handling
program.on('command:*', () => {
  console.error(chalk.red('Invalid command: %s\nSee --help for a list of available commands.'), program.args.join(' '));
  process.exit(1);
});

program.parse(); 