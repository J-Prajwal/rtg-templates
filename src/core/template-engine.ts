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

    // Handle local templates
    if (repository.startsWith('local:')) {
      const localPath = repository.replace('local:', '');
      const templatePath = path.resolve(process.cwd(), localPath);
      
      if (!await fs.pathExists(templatePath)) {
        throw new Error(`Local template not found: ${templatePath}`);
      }
      
      await fs.copy(templatePath, targetPath);
      return;
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
        packageJson.devDependencies.tailwindcss = '^3.4.0';
        packageJson.devDependencies.postcss = '^8.4.0';
        packageJson.devDependencies.autoprefixer = '^10.4.0';
      }

      if (options.reduxToolkit) {
        packageJson.dependencies = packageJson.dependencies || {};
        packageJson.dependencies['@reduxjs/toolkit'] = '^2.0.0';
        packageJson.dependencies['react-redux'] = '^9.0.0';
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

  private async hasTypeScriptFiles(targetPath: string): Promise<boolean> {
    const files = await this.getAllFiles(targetPath);
    return files.some(file => file.endsWith('.ts') || file.endsWith('.tsx'));
  }

  private async handleConditionalFiles(targetPath: string, options: any): Promise<void> {
    // Check if template already has TypeScript files
    const hasTypeScriptFiles = await this.hasTypeScriptFiles(targetPath);
    const shouldUseTypeScript = options.typescript || hasTypeScriptFiles;
    
    // Handle TypeScript configuration
    if (shouldUseTypeScript) {
      // Ensure TypeScript files are preserved
      // No conversion needed when TypeScript is selected
    } else {
      // Remove TypeScript config if TypeScript is not selected
      const tsConfigFiles = ['tsconfig.json', 'tsconfig.node.json'];
      for (const tsConfigFile of tsConfigFiles) {
        const tsConfigPath = path.join(targetPath, tsConfigFile);
        if (await fs.pathExists(tsConfigPath)) {
          await fs.remove(tsConfigPath);
        }
      }
      
      // Convert TypeScript files to JavaScript
      const tsFiles = await this.getAllFiles(targetPath);
      for (const filePath of tsFiles) {
        if (filePath.endsWith('.tsx')) {
          const newPath = filePath.replace('.tsx', '.jsx');
          await fs.move(filePath, newPath);
        } else if (filePath.endsWith('.ts') && !filePath.endsWith('.d.ts')) {
          const newPath = filePath.replace('.ts', '.js');
          await fs.move(filePath, newPath);
        }
      }
    }

    // Remove Tailwind config if Tailwind is not selected
    if (!options.tailwind) {
      const tailwindConfigPath = path.join(targetPath, 'tailwind.config.js');
      if (await fs.pathExists(tailwindConfigPath)) {
        await fs.remove(tailwindConfigPath);
      }
      
      // Also remove Tailwind CSS imports from main CSS file
      const cssFiles = ['src/index.css', 'src/App.css', 'src/styles/globals.css'];
      for (const cssFile of cssFiles) {
        const cssPath = path.join(targetPath, cssFile);
        if (await fs.pathExists(cssPath)) {
          let content = await fs.readFile(cssPath, 'utf8');
          content = content.replace(/@tailwind\s+[^;]+;/g, '');
          content = content.replace(/@import\s+['"]tailwindcss[^'"]*['"];?/g, '');
          await fs.writeFile(cssPath, content);
        }
      }
    }

    // Remove Redux files if Redux Toolkit is not selected
    if (!options.reduxToolkit) {
      const reduxFiles = [
        'src/store/index.js',
        'src/store/index.ts',
        'src/store/store.js',
        'src/store/store.ts',
        'src/features',
        'src/redux'
      ];
      
      for (const reduxFile of reduxFiles) {
        const reduxPath = path.join(targetPath, reduxFile);
        if (await fs.pathExists(reduxPath)) {
          await fs.remove(reduxPath);
        }
      }
    } else {
      // Setup Redux Toolkit if selected
      await this.setupReduxToolkit(targetPath, shouldUseTypeScript);
    }
  }

  private async setupReduxToolkit(targetPath: string, isTypeScript: boolean): Promise<void> {
    const ext = isTypeScript ? 'ts' : 'js';
    
    // Create store directory
    const storeDir = path.join(targetPath, 'src', 'store');
    await fs.ensureDir(storeDir);
    
    // Create store configuration
    const storeContent = isTypeScript 
      ? `import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {
    // Add your reducers here
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch`
      : `import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
  reducer: {
    // Add your reducers here
  },
})`;

    await fs.writeFile(path.join(storeDir, `index.${ext}`), storeContent);
    
    // Create features directory
    const featuresDir = path.join(targetPath, 'src', 'features');
    await fs.ensureDir(featuresDir);
    
    // Create example slice
    const sliceContent = isTypeScript
      ? `import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CounterState {
  value: number
}

const initialState: CounterState = {
  value: 0,
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload
    },
  },
})

export const { increment, decrement, incrementByAmount } = counterSlice.actions
export default counterSlice.reducer`
      : `import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: 0,
}

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment: (state) => {
      state.value += 1
    },
    decrement: (state) => {
      state.value -= 1
    },
    incrementByAmount: (state, action) => {
      state.value += action.payload
    },
  },
})

export const { increment, decrement, incrementByAmount } = counterSlice.actions
export default counterSlice.reducer`;

    await fs.writeFile(path.join(featuresDir, `counterSlice.${ext}`), sliceContent);
    
    // Create hooks file
    const hooksContent = isTypeScript
      ? `import { useDispatch, useSelector } from 'react-redux'
import type { TypedUseSelectorHook } from 'react-redux'
import type { RootState, AppDispatch } from '../store'

export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector`
      : `import { useDispatch, useSelector } from 'react-redux'

export const useAppDispatch = useDispatch
export const useAppSelector = useSelector`;

    await fs.writeFile(path.join(featuresDir, `hooks.${ext}`), hooksContent);
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