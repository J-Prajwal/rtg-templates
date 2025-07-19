import chalk from 'chalk';
import ora from 'ora';
import path from 'path';
import { existsSync } from 'fs';
import { CreateProjectOptions, TemplateContext } from '../types';
import { TemplateEngine } from '../core/template-engine';
import { PostInstallRunner } from '../core/post-install';
import { validateProjectName, validateTemplate } from '../utils/validation';
import { getTemplateRegistry } from '../core/registry';

export async function createProject(
  template: string,
  projectName: string,
  options: CreateProjectOptions
): Promise<void> {
  const spinner = ora();

  try {
    // Validate inputs
    if (!template) {
      throw new Error('Template name is required. Use --help to see available templates.');
    }

    if (!projectName) {
      throw new Error('Project name is required.');
    }

    validateProjectName(projectName);
    
    // Get template registry and validate template
    spinner.start('Loading template registry...');
    const registry = await getTemplateRegistry();
    const templateConfig = validateTemplate(template, registry);
    spinner.succeed('Template registry loaded');

    // Prepare context
    const targetPath = path.resolve(options.directory || '.', projectName);
    
    if (existsSync(targetPath)) {
      throw new Error(`Directory "${projectName}" already exists`);
    }

    const context: TemplateContext = {
      projectName,
      options,
      targetPath,
    };

    // Initialize template engine
    const templateEngine = new TemplateEngine(templateConfig);

    // Clone template
    spinner.start(`Cloning template "${template}"...`);
    await templateEngine.cloneTemplate(context);
    spinner.succeed(`Template "${template}" cloned successfully`);

    // Process template
    spinner.start('Processing template...');
    await templateEngine.processTemplate(context);
    spinner.succeed('Template processed');

    // Run post-install hooks
    if (options.install !== false) {
      const postInstall = new PostInstallRunner(templateConfig, context);
      
      spinner.start('Running post-install hooks...');
      await postInstall.run();
      spinner.succeed('Post-install hooks completed');
    }

    // Success message
    console.log(chalk.green('\n✨ Project created successfully!\n'));
    console.log(chalk.cyan(`📁 Project: ${projectName}`));
    console.log(chalk.cyan(`📂 Location: ${targetPath}`));
    console.log(chalk.cyan(`🚀 Template: ${template}\n`));

    // Next steps
    console.log(chalk.bold('Next steps:'));
    console.log(chalk.gray(`  cd ${projectName}`));
    
    if (options.install === false) {
      console.log(chalk.gray('  npm install'));
    }
    
    console.log(chalk.gray('  npm run dev\n'));

    // Show custom instructions if available
    if (templateConfig.postInstall?.instructions) {
      console.log(chalk.bold('Additional instructions:'));
      console.log(chalk.gray(templateConfig.postInstall.instructions));
    }

  } catch (error) {
    spinner.fail('Failed to create project');
    throw error;
  }
} 