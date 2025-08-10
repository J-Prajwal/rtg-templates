import inquirer from 'inquirer';
import chalk from 'chalk';
import { InteractiveAnswers, CreateProjectOptions } from '../types';
import { createProject } from './create';
import { getTemplateRegistry } from '../core/registry';
import { getAllAddonNames } from '../core/addons';

export async function interactive(): Promise<void> {
  try {
    console.log(chalk.bold.cyan('\n🚀 Welcome to RTG Template Interactive Mode!\n'));
    
    // Load available templates
    const registry = await getTemplateRegistry();
    const templateChoices = Object.entries(registry.templates).map(([name, config]) => ({
      name: `${name} - ${config.description}`,
      value: name,
    }));

    const allAddons = getAllAddonNames();
    const addonChoices = allAddons.map(addon => ({
      name: addon.charAt(0).toUpperCase() + addon.slice(1).replace(/([A-Z])/g, ' $1'),
      value: addon,
    }));

    const answers: InteractiveAnswers = await inquirer.prompt([
      {
        type: 'list',
        name: 'template',
        message: 'Select a template:',
        choices: templateChoices,
      },
      {
        type: 'input',
        name: 'projectName',
        message: 'Project name:',
        validate: (input: string) => {
          if (!input.trim()) {
            return 'Project name is required';
          }
          if (!/^[a-zA-Z0-9-_]+$/.test(input)) {
            return 'Project name can only contain letters, numbers, hyphens, and underscores';
          }
          return true;
        },
      },
      {
        type: 'checkbox',
        name: 'features',
        message: 'Select UI/CSS add-ons (choose one):',
        choices: [
          { name: 'Tailwind CSS', value: 'tailwind' },
          { name: 'Styled Components', value: 'styled-components' },
          { name: 'Material-UI (MUI)', value: 'mui' },
          { name: 'Chakra UI', value: 'chakra' },
        ],
        validate: (input: string[]) => {
          if (input.length > 1) {
            return 'You can only select one UI library at a time';
          }
          return true;
        },
      },
      {
        type: 'checkbox',
        name: 'stateManagement',
        message: 'Select state management add-ons:',
        choices: [
          { name: 'Redux Toolkit', value: 'redux' },
          { name: 'TanStack Query', value: 'tanstack-query' },
        ],
      },
      {
        type: 'confirm',
        name: 'includeRouter',
        message: 'Include React Router?',
        default: true,
      },
      {
        type: 'list',
        name: 'packageManager',
        message: 'Choose package manager:',
        choices: [
          { name: 'npm', value: 'npm' },
          { name: 'yarn', value: 'yarn' },
          { name: 'pnpm', value: 'pnpm' },
        ],
        default: 'npm',
      },
      {
        type: 'confirm',
        name: 'initGit',
        message: 'Initialize git repository?',
        default: true,
      },
    ]);

    // Convert answers to options
    const options: CreateProjectOptions = {
      tailwind: answers.features.includes('tailwind'),
      styledComponents: answers.features.includes('styled-components'),
      mui: answers.features.includes('mui'),
      chakra: answers.features.includes('chakra'),
      redux: answers.stateManagement.includes('redux'),
      tanstackQuery: answers.stateManagement.includes('tanstack-query'),
      noRoute: !answers.includeRouter,
      git: answers.initGit,
    };

    console.log(chalk.yellow('\n📦 Creating your project...\n'));

    // Create the project
    await createProject(answers.template, answers.projectName, options);

  } catch (error) {
    if (error instanceof Error && error.name === 'ExitPromptError') {
      console.log(chalk.yellow('\n👋 Goodbye!'));
      process.exit(0);
    }
    
    console.error(chalk.red('Interactive mode failed:'), error instanceof Error ? error.message : error);
    process.exit(1);
  }
} 