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

    // Handle --no-route flag before installing dependencies
    if (this.context.options.route === false) {
      await this.removeReactRouter();
    }

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

  private async removeReactRouter(): Promise<void> {
    const { targetPath } = this.context;
    
    // Remove react-router-dom from package.json
    const packageJsonPath = path.join(targetPath, 'package.json');
    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = await fs.readJson(packageJsonPath);
      
      if (packageJson.dependencies && packageJson.dependencies['react-router-dom']) {
        delete packageJson.dependencies['react-router-dom'];
      }
      
      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    }

    // Update main.jsx to remove router imports and wrapper
    const mainJsxPath = path.join(targetPath, 'src/main.jsx');
    if (await fs.pathExists(mainJsxPath)) {
      let content = await fs.readFile(mainJsxPath, 'utf8');
      
      // Remove react-router-dom import
      content = content.replace(/import.*react-router-dom.*\n?/g, '');
      content = content.replace(/import.*BrowserRouter.*\n?/g, '');
      
      // Remove BrowserRouter wrapper
      content = content.replace(/<BrowserRouter[^>]*>/, '');
      content = content.replace(/<\/BrowserRouter>/, '');
      
      // Clean up empty import lines and extra whitespace
      content = content.replace(/^\s*import\s*;\s*$/gm, '');
      content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
      
      await fs.writeFile(mainJsxPath, content);
    }

    // Update main.tsx for TypeScript template
    const mainTsxPath = path.join(targetPath, 'src/main.tsx');
    if (await fs.pathExists(mainTsxPath)) {
      let content = await fs.readFile(mainTsxPath, 'utf8');
      
      // Remove react-router-dom import
      content = content.replace(/import.*react-router-dom.*\n?/g, '');
      content = content.replace(/import.*BrowserRouter.*\n?/g, '');
      
      // Remove BrowserRouter wrapper
      content = content.replace(/<BrowserRouter[^>]*>/, '');
      content = content.replace(/<\/BrowserRouter>/, '');
      
      // Clean up empty import lines and extra whitespace
      content = content.replace(/^\s*import\s*;\s*$/gm, '');
      content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
      
      await fs.writeFile(mainTsxPath, content);
    }

    // Update App.jsx to remove Routes and Route
    const appJsxPath = path.join(targetPath, 'src/App.jsx');
    if (await fs.pathExists(appJsxPath)) {
      let content = await fs.readFile(appJsxPath, 'utf8');
      
      // Remove react-router-dom imports
      content = content.replace(/import.*react-router-dom.*\n?/g, '');
      content = content.replace(/import.*Routes.*\n?/g, '');
      content = content.replace(/import.*Route.*\n?/g, '');
      
      // Remove Routes and Route components, replace with direct Home component
      content = content.replace(/<Routes>[\s\S]*?<\/Routes>/g, '<Home />');
      
      // Clean up empty import lines and extra whitespace
      content = content.replace(/^\s*import\s*;\s*$/gm, '');
      content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
      
      await fs.writeFile(appJsxPath, content);
    }

    // Update App.tsx for TypeScript template
    const appTsxPath = path.join(targetPath, 'src/App.tsx');
    if (await fs.pathExists(appTsxPath)) {
      let content = await fs.readFile(appTsxPath, 'utf8');
      
      // Remove react-router-dom imports
      content = content.replace(/import.*react-router-dom.*\n?/g, '');
      content = content.replace(/import.*Routes.*\n?/g, '');
      content = content.replace(/import.*Route.*\n?/g, '');
      
      // Remove Routes and Route components, replace with direct Home component
      content = content.replace(/<Routes>[\s\S]*?<\/Routes>/g, '<Home />');
      
      // Clean up empty import lines and extra whitespace
      content = content.replace(/^\s*import\s*;\s*$/gm, '');
      content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
      
      await fs.writeFile(appTsxPath, content);
    }

    // Remove router directories
    const routerDirs = ['src/Routes', 'src/routes', 'src/components/Router'];
    for (const dir of routerDirs) {
      const dirPath = path.join(targetPath, dir);
      if (await fs.pathExists(dirPath)) {
        await fs.remove(dirPath);
      }
    }
  }

  private async installDependencies(): Promise<void> {
    const { targetPath, options } = this.context;
    const { postInstall } = this.config;

    if (!postInstall) return;

    try {
      // Install production dependencies
      if (postInstall.dependencies && postInstall.dependencies.length > 0) {
        let depsToInstall = this.filterExistingDependencies(postInstall.dependencies);
        
        // Filter out react-router-dom if --no-route is specified
        if (options.route === false) {
          depsToInstall = depsToInstall.filter(dep => !dep.includes('react-router-dom'));
        }
        
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