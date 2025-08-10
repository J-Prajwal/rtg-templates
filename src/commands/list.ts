import chalk from 'chalk';
import { getTemplateRegistry } from '../core/registry';
import { getAllAddonNames } from '../core/addons';

export async function listTemplates(): Promise<void> {
  try {
    const registry = await getTemplateRegistry();
    const allAddons = getAllAddonNames();
    
    console.log(chalk.bold.cyan('\n📋 Available Templates\n'));
    
    Object.entries(registry.templates).forEach(([name, config]) => {
      console.log(chalk.green(`• ${name}`));
      console.log(chalk.gray(`  ${config.description}`));
      
      if (config.frameworks.length > 0) {
        console.log(chalk.blue(`  Frameworks: ${config.frameworks.join(', ')}`));
      }
      
      console.log(); // Empty line for spacing
    });

    console.log(chalk.bold.cyan('\n🎨 Available Add-ons\n'));
    
    const addonDescriptions: Record<string, string> = {
      'tailwind': 'Tailwind CSS - Utility-first CSS framework',
      'styled-components': 'Styled Components - CSS-in-JS library',
      'mui': 'Material-UI (MUI) - React UI component library',
      'chakra': 'Chakra UI - Modern React component library',
      'redux': 'Redux Toolkit - State management',
      'tanstack-query': 'TanStack Query - Data fetching and caching'
    };

    allAddons.forEach(addon => {
      console.log(chalk.green(`• --${addon}`));
      console.log(chalk.gray(`  ${addonDescriptions[addon] || 'Add-on for React applications'}`));
    });

    console.log(chalk.green(`• --no-route`));
    console.log(chalk.gray(`  Skip React Router installation`));

    console.log(chalk.gray('\nUsage examples:'));
    console.log(chalk.gray('  npx rtg-template react my-app --tailwind --redux'));
    console.log(chalk.gray('  npx rtg-template react-ts my-app --mui --tanstack-query'));
    console.log(chalk.gray('  npx rtg-template react my-app --chakra --no-route\n'));
    
  } catch (error) {
    console.error(chalk.red('Failed to load templates:'), error instanceof Error ? error.message : error);
    process.exit(1);
  }
} 