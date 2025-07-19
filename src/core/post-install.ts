import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs-extra';
import { TemplateConfig, TemplateContext } from '../types';

export class PostInstallRunner {
  constructor(
    private config: TemplateConfig,
    private context: TemplateContext
  ) {}

  async run(): Promise<void> {
    const { postInstall } = this.config;
    if (!postInstall) return;

    // Install dependencies
    if (postInstall.dependencies || postInstall.devDependencies) {
      await this.installDependencies();
    }

    // Create .env file if template provided
    if (postInstall.envTemplate) {
      await this.createEnvFile();
    }

    // Run custom scripts
    if (postInstall.scripts) {
      await this.runCustomScripts();
    }

    // Setup Husky if it's in the dependencies
    await this.setupHusky();
  }

  private async installDependencies(): Promise<void> {
    const { targetPath } = this.context;
    const { postInstall } = this.config;

    if (!postInstall) return;

    try {
      // Install production dependencies
      if (postInstall.dependencies && postInstall.dependencies.length > 0) {
        const depsToInstall = this.filterExistingDependencies(postInstall.dependencies);
        if (depsToInstall.length > 0) {
          execSync(`npm install ${depsToInstall.join(' ')}`, {
            cwd: targetPath,
            stdio: 'inherit',
          });
        }
      }

      // Install dev dependencies
      if (postInstall.devDependencies && postInstall.devDependencies.length > 0) {
        const devDepsToInstall = this.filterExistingDependencies(postInstall.devDependencies);
        if (devDepsToInstall.length > 0) {
          execSync(`npm install --save-dev ${devDepsToInstall.join(' ')}`, {
            cwd: targetPath,
            stdio: 'inherit',
          });
        }
      }

      // Run npm install to install existing dependencies
      if (await fs.pathExists(path.join(targetPath, 'package.json'))) {
        execSync('npm install', {
          cwd: targetPath,
          stdio: 'inherit',
        });
      }
    } catch (error) {
      console.warn('Warning: Failed to install some dependencies');
    }
  }

  private filterExistingDependencies(dependencies: string[]): string[] {
    // In a real implementation, you might want to check package.json
    // to avoid reinstalling existing dependencies
    return dependencies;
  }

  private async createEnvFile(): Promise<void> {
    const { targetPath } = this.context;
    const { postInstall } = this.config;

    if (!postInstall?.envTemplate) return;

    const envPath = path.join(targetPath, '.env');
    
    // Only create if .env doesn't exist
    if (!await fs.pathExists(envPath)) {
      await fs.writeFile(envPath, postInstall.envTemplate);
    }

    // Also create .env.example
    const envExamplePath = path.join(targetPath, '.env.example');
    if (!await fs.pathExists(envExamplePath)) {
      // Remove actual values for the example file
      const exampleContent = postInstall.envTemplate
        .split('\n')
        .map(line => {
          if (line.includes('=')) {
            const [key] = line.split('=');
            return `${key}=`;
          }
          return line;
        })
        .join('\n');
      
      await fs.writeFile(envExamplePath, exampleContent);
    }
  }

  private async runCustomScripts(): Promise<void> {
    const { targetPath } = this.context;
    const { postInstall } = this.config;

    if (!postInstall?.scripts) return;

    for (const script of postInstall.scripts) {
      try {
        execSync(script, {
          cwd: targetPath,
          stdio: 'inherit',
        });
      } catch (error) {
        console.warn(`Warning: Failed to run script: ${script}`);
      }
    }
  }

  private async setupHusky(): Promise<void> {
    const { targetPath } = this.context;
    
    try {
      // Check if husky is in package.json
      const packageJsonPath = path.join(targetPath, 'package.json');
      if (await fs.pathExists(packageJsonPath)) {
        const packageJson = await fs.readJson(packageJsonPath);
        const hasHusky = packageJson.devDependencies?.husky || packageJson.dependencies?.husky;
        
        if (hasHusky) {
          // Initialize husky
          execSync('npx husky install', {
            cwd: targetPath,
            stdio: 'inherit',
          });
          
          // Add pre-commit hook for lint-staged
          const hasLintStaged = packageJson.devDependencies?.['lint-staged'] || packageJson.dependencies?.['lint-staged'];
          if (hasLintStaged) {
            execSync('npx husky add .husky/pre-commit "npx lint-staged"', {
              cwd: targetPath,
              stdio: 'inherit',
            });
          }
        }
      }
    } catch (error) {
      console.warn('Warning: Failed to setup Husky');
    }
  }

  static async runCustomPostInstall(targetPath: string): Promise<void> {
    // Look for custom .get-template.js file
    const customPostInstallPath = path.join(targetPath, '.get-template.js');
    
    if (await fs.pathExists(customPostInstallPath)) {
      try {
        // Import and run custom post-install script
        const customScript = require(customPostInstallPath);
        
        if (typeof customScript === 'function') {
          await customScript(targetPath);
        } else if (customScript.postInstall && typeof customScript.postInstall === 'function') {
          await customScript.postInstall(targetPath);
        }

        // Remove the custom script file after execution
        await fs.remove(customPostInstallPath);
      } catch (error) {
        console.warn('Warning: Failed to run custom post-install script');
      }
    }
  }
} 