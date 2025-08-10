import degit from 'degit';
import path from 'path';
import fs from 'fs-extra';
import { TemplateConfig, TemplateContext, CreateProjectOptions } from '../types';
import { getAddonConfig } from './addons';

export class TemplateEngine {
  constructor(private config: TemplateConfig) {}

  async cloneTemplate(context: TemplateContext): Promise<void> {
    const { targetPath } = context;
    
    await fs.ensureDir(path.dirname(targetPath));

    const repository = context.options.repo || this.config.repository;
    
    if (!repository) {
      throw new Error(`No repository specified for template "${this.config.name}"`);
    }

    if (repository.startsWith('local:')) {
      const localPath = repository.replace('local:', '');
      
      const possiblePaths = [
        path.resolve(process.cwd(), localPath),
        path.resolve(__dirname, '..', '..', localPath),
        path.resolve(__dirname, '..', localPath),
      ];
      
      let templatePath: string | null = null;
      
      for (const possiblePath of possiblePaths) {
        if (await fs.pathExists(possiblePath)) {
          templatePath = possiblePath;
          break;
        }
      }
      
      if (!templatePath) {
        throw new Error(`Template not found. Tried paths: ${possiblePaths.join(', ')}`);
      }
      
      await fs.copy(templatePath, targetPath);
      return;
    }

    const emitter = degit(repository, {
      cache: false,
      force: true,
    });

    await emitter.clone(targetPath);

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

    await this.processTemplateFiles(targetPath, context);

    await this.handleConditionalFiles(targetPath, options);

    // Process add-ons first
    await this.processAddons(targetPath, options);

    // Update package.json after addons are processed
    await this.updatePackageJson(targetPath, projectName, options);

    // Initialize git if requested
    if (options.git !== false) {
      await this.initializeGit(targetPath);
    }
  }

  private async updatePackageJson(targetPath: string, projectName: string, options: CreateProjectOptions): Promise<void> {
    const packageJsonPath = path.join(targetPath, 'package.json');
    
    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = await fs.readJson(packageJsonPath);
      
      packageJson.name = projectName;
      
      // Add base dependencies from template config, but exclude react-router-dom if --no-route is specified
      if (this.config.postInstall?.dependencies) {
        const dependencies = this.config.postInstall.dependencies;
        const filteredDependencies = options.noRoute 
          ? dependencies.filter(dep => !dep.includes('react-router-dom'))
          : dependencies;
          
        packageJson.dependencies = {
          ...packageJson.dependencies,
          ...filteredDependencies.reduce((acc, dep) => {
            const [name, version] = dep.includes('@') ? [dep, 'latest'] : [dep, 'latest'];
            acc[name] = version;
            return acc;
          }, {} as Record<string, string>)
        };
      }

      if (this.config.postInstall?.devDependencies) {
        packageJson.devDependencies = {
          ...packageJson.devDependencies,
          ...this.config.postInstall.devDependencies.reduce((acc, dep) => {
            const [name, version] = dep.includes('@') ? [dep, 'latest'] : [dep, 'latest'];
            acc[name] = version;
            return acc;
          }, {} as Record<string, string>)
        };
      }

      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    }
  }

  private async processAddons(targetPath: string, options: CreateProjectOptions): Promise<void> {
    const addonsToProcess = this.getSelectedAddons(options);
    
    for (const addonName of addonsToProcess) {
      const addonConfig = getAddonConfig(addonName);
      if (addonConfig) {
        await this.applyAddon(targetPath, addonConfig, options);
      }
    }
  }

  private getSelectedAddons(options: CreateProjectOptions): string[] {
    const addons: string[] = [];
    
    if (options.tailwind) addons.push('tailwind');
    if (options.styledComponents) addons.push('styledComponents');
    if (options.mui) addons.push('mui');
    if (options.chakra) addons.push('chakra');
    if (options.redux) addons.push('redux');
    if (options.tanstackQuery) addons.push('tanstackQuery');
    
    return addons;
  }

  private async applyAddon(targetPath: string, addonConfig: any, options: CreateProjectOptions): Promise<void> {
    // Add dependencies to package.json
    await this.addAddonDependencies(targetPath, addonConfig);
    
    // Add files
    if (addonConfig.files) {
      for (const [filePath, content] of Object.entries(addonConfig.files)) {
        const fullPath = path.join(targetPath, filePath);
        await fs.ensureDir(path.dirname(fullPath));
        await fs.writeFile(fullPath, content as string);
      }
    }
    
    // Add scripts to package.json
    if (addonConfig.scripts) {
      await this.addAddonScripts(targetPath, addonConfig.scripts);
    }
    
    // Modify vite config if needed
    if (addonConfig.viteConfigModifier) {
      await this.modifyViteConfig(targetPath, addonConfig.viteConfigModifier);
    }
  }

  private async addAddonDependencies(targetPath: string, addonConfig: any): Promise<void> {
    const packageJsonPath = path.join(targetPath, 'package.json');
    
    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = await fs.readJson(packageJsonPath);
      
      // Add dependencies
      if (addonConfig.dependencies) {
        packageJson.dependencies = {
          ...packageJson.dependencies,
          ...addonConfig.dependencies.reduce((acc: any, dep: string) => {
            const parts = dep.split('@');
            if (parts.length === 1) {
              // No version specified, use latest
              acc[dep] = 'latest';
            } else if (parts.length === 2 && !parts[0]) {
              // Scoped package without version: @scope/package
              acc[dep] = 'latest';
            } else if (parts.length === 2 && parts[0]) {
              // Regular package with version: package@version
              acc[parts[0]] = parts[1];
            } else if (parts.length === 3 && !parts[0]) {
              // Scoped package with version: @scope/package@version
              acc[`@${parts[1]}`] = parts[2];
            }
            return acc;
          }, {})
        };
      }
      
      // Add devDependencies
      if (addonConfig.devDependencies) {
        packageJson.devDependencies = {
          ...packageJson.devDependencies,
          ...addonConfig.devDependencies.reduce((acc: any, dep: string) => {
            const parts = dep.split('@');
            if (parts.length === 1) {
              // No version specified, use latest
              acc[dep] = 'latest';
            } else if (parts.length === 2 && !parts[0]) {
              // Scoped package without version: @scope/package
              acc[dep] = 'latest';
            } else if (parts.length === 2 && parts[0]) {
              // Regular package with version: package@version
              acc[parts[0]] = parts[1];
            } else if (parts.length === 3 && !parts[0]) {
              // Scoped package with version: @scope/package@version
              acc[`@${parts[1]}`] = parts[2];
            }
            return acc;
          }, {})
        };
      }
      
      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    }
  }

  private async addAddonScripts(targetPath: string, scripts: Record<string, string>): Promise<void> {
    const packageJsonPath = path.join(targetPath, 'package.json');
    
    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = await fs.readJson(packageJsonPath);
      
      packageJson.scripts = {
        ...packageJson.scripts,
        ...scripts
      };
      
      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    }
  }

  private async modifyViteConfig(targetPath: string, modifier: (content: string) => string): Promise<void> {
    // Try to find vite config file
    const possibleConfigFiles = [
      'vite.config.js',
      'vite.config.ts',
      'vite.config.mjs'
    ];
    
    for (const configFile of possibleConfigFiles) {
      const configPath = path.join(targetPath, configFile);
      if (await fs.pathExists(configPath)) {
        const content = await fs.readFile(configPath, 'utf8');
        const modifiedContent = modifier(content);
        await fs.writeFile(configPath, modifiedContent);
        return;
      }
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
      
      content = content.replace(/\{\{PROJECT_NAME\}\}/g, context.projectName);
      content = content.replace(/\{\{project-name\}\}/g, context.projectName.toLowerCase());
      content = content.replace(/\{\{Project Name\}\}/g, this.capitalizeWords(context.projectName));
      
      await fs.writeFile(filePath, content);
    } catch (error) {
    }
  }

  private capitalizeWords(str: string): string {
    return str.replace(/\b\w/g, l => l.toUpperCase()).replace(/[-_]/g, ' ');
  }

  private async handleConditionalFiles(targetPath: string, options: CreateProjectOptions): Promise<void> {
    // Handle legacy options for backward compatibility
    if (options.reduxToolkit && !options.redux) {
      options.redux = true;
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