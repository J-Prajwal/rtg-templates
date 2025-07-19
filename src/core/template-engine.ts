import degit from 'degit';
import path from 'path';
import fs from 'fs-extra';
import { TemplateConfig, TemplateContext } from '../types';

export class TemplateEngine {
  constructor(private config: TemplateConfig) {}

  async cloneTemplate(context: TemplateContext): Promise<void> {
    const { targetPath } = context;
    
    // Ensure target directory exists
    await fs.ensureDir(path.dirname(targetPath));

    // Use custom repository if provided, otherwise use template config
    const repository = context.options.repo || this.config.repository;
    
    if (!repository) {
      throw new Error(`No repository specified for template "${this.config.name}"`);
    }

    // Use degit to clone the template
    const emitter = degit(repository, {
      cache: false,
      force: true,
    });

    await emitter.clone(targetPath);

    // If template has a specific directory within the repo, move files
    if (this.config.directory) {
      const sourcePath = path.join(targetPath, this.config.directory);
      const tempPath = path.join(targetPath, '..', `${path.basename(targetPath)}-temp`);
      
      if (await fs.pathExists(sourcePath)) {
        await fs.move(sourcePath, tempPath);
        await fs.remove(targetPath);
        await fs.move(tempPath, targetPath);
      }
    }
  }

  async processTemplate(context: TemplateContext): Promise<void> {
    const { targetPath, projectName, options } = context;

    // Update package.json if it exists
    await this.updatePackageJson(targetPath, projectName, options);

    // Process template variables in files
    await this.processTemplateFiles(targetPath, context);

    // Handle conditional files based on options
    await this.handleConditionalFiles(targetPath, options);

    // Initialize git if requested
    if (options.git !== false) {
      await this.initializeGit(targetPath);
    }
  }

  private async updatePackageJson(targetPath: string, projectName: string, options: any): Promise<void> {
    const packageJsonPath = path.join(targetPath, 'package.json');
    
    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = await fs.readJson(packageJsonPath);
      
      // Update name
      packageJson.name = projectName;
      
      // Add dependencies based on options
      if (options.typescript) {
        packageJson.devDependencies = packageJson.devDependencies || {};
        packageJson.devDependencies.typescript = '^5.0.0';
        packageJson.devDependencies['@types/node'] = '^20.0.0';
      }

      if (options.tailwind) {
        packageJson.devDependencies = packageJson.devDependencies || {};
        packageJson.devDependencies.tailwindcss = '^3.0.0';
        packageJson.devDependencies.postcss = '^8.0.0';
        packageJson.devDependencies.autoprefixer = '^10.0.0';
      }

      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    }
  }

  private async processTemplateFiles(targetPath: string, context: TemplateContext): Promise<void> {
    const files = await this.getAllFiles(targetPath);
    
    for (const filePath of files) {
      if (this.shouldProcessFile(filePath)) {
        await this.processFile(filePath, context);
      }
    }
  }

  private async getAllFiles(dirPath: string): Promise<string[]> {
    const files: string[] = [];
    
    const items = await fs.readdir(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = await fs.stat(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        files.push(...await this.getAllFiles(fullPath));
      } else if (stat.isFile()) {
        files.push(fullPath);
      }
    }
    
    return files;
  }

  private shouldProcessFile(filePath: string): boolean {
    const ext = path.extname(filePath);
    const processableExts = ['.js', '.ts', '.jsx', '.tsx', '.json', '.md', '.html', '.css', '.env'];
    return processableExts.includes(ext) || path.basename(filePath).startsWith('.');
  }

  private async processFile(filePath: string, context: TemplateContext): Promise<void> {
    try {
      let content = await fs.readFile(filePath, 'utf8');
      
      // Replace template variables
      content = content.replace(/\{\{PROJECT_NAME\}\}/g, context.projectName);
      content = content.replace(/\{\{project-name\}\}/g, context.projectName.toLowerCase());
      content = content.replace(/\{\{Project Name\}\}/g, this.capitalizeWords(context.projectName));
      
      await fs.writeFile(filePath, content);
    } catch (error) {
      // Skip binary files or files that can't be processed
    }
  }

  private capitalizeWords(str: string): string {
    return str.replace(/\b\w/g, l => l.toUpperCase()).replace(/[-_]/g, ' ');
  }

  private async handleConditionalFiles(targetPath: string, options: any): Promise<void> {
    // Remove TypeScript config if TypeScript is not selected
    if (!options.typescript) {
      const tsConfigPath = path.join(targetPath, 'tsconfig.json');
      if (await fs.pathExists(tsConfigPath)) {
        await fs.remove(tsConfigPath);
      }
    }

    // Remove Tailwind config if Tailwind is not selected
    if (!options.tailwind) {
      const tailwindConfigPath = path.join(targetPath, 'tailwind.config.js');
      if (await fs.pathExists(tailwindConfigPath)) {
        await fs.remove(tailwindConfigPath);
      }
    }
  }

  private async initializeGit(targetPath: string): Promise<void> {
    try {
      const { execSync } = require('child_process');
      execSync('git init', { cwd: targetPath, stdio: 'ignore' });
      execSync('git add .', { cwd: targetPath, stdio: 'ignore' });
      execSync('git commit -m "Initial commit"', { cwd: targetPath, stdio: 'ignore' });
    } catch (error) {
      // Git initialization failed, but don't throw an error
      console.warn('Warning: Failed to initialize git repository');
    }
  }
} 