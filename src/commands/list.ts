import chalk from 'chalk';
import { getTemplateRegistry } from '../core/registry';

export async function listTemplates(): Promise<void> {
  try {
    const registry = await getTemplateRegistry();
    
    console.log(chalk.bold.cyan('\n📋 Available Templates\n'));
    
    Object.entries(registry.templates).forEach(([name, config]) => {
      console.log(chalk.green(`• ${name}`));
      console.log(chalk.gray(`  ${config.description}`));
      
      if (config.frameworks.length > 0) {
        console.log(chalk.blue(`  Frameworks: ${config.frameworks.join(', ')}`));
      }
      
      if (config.addons.length > 0) {
        console.log(chalk.yellow(`  Available addons: ${config.addons.join(', ')}`));
      }
      
      console.log(); // Empty line for spacing
    });

    console.log(chalk.gray('Usage examples:'));
    console.log(chalk.gray('  npx rtg-template react my-app --typescript --tailwind'));
    console.log(chalk.gray('  npx rtg-template next my-next-app --auth'));
    console.log(chalk.gray('  npx rtg-template node-api my-api --mongodb\n'));
    
  } catch (error) {
    console.error(chalk.red('Failed to load templates:'), error instanceof Error ? error.message : error);
    process.exit(1);
  }
} 