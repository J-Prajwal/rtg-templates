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
  .description('A CLI tool for quickly scaffolding React project templates with add-ons')
  .version(version);

program
  .argument('<template>', 'Template name: react or react-ts')
  .argument('[project-name]', 'Name of the project to create')
  .option('--tailwind', 'Add Tailwind CSS')
  .option('--styled-components', 'Add Styled Components')
  .option('--mui', 'Add Material-UI (MUI)')
  .option('--chakra', 'Add Chakra UI')
  .option('--redux', 'Add Redux Toolkit')
  .option('--tanstack-query', 'Add TanStack Query (React Query)')
  .option('--no-route', 'Skip React Router installation')
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