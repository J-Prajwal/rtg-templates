import degit from "degit";
import path from "path";
import fs from "fs-extra";
import { TemplateConfig, TemplateContext } from "../types";

export class TemplateEngine {
  constructor(private config: TemplateConfig) {}

  async cloneTemplate(context: TemplateContext): Promise<void> {
    const { targetPath } = context;

    await fs.ensureDir(path.dirname(targetPath));

    const repository = context.options.repo || this.config.repository;

    if (!repository) {
      throw new Error(
        `No repository specified for template "${this.config.name}"`
      );
    }

    if (repository.startsWith("local:")) {
      const localPath = repository.replace("local:", "");

      const possiblePaths = [
        path.resolve(process.cwd(), localPath),
        path.resolve(__dirname, "..", "..", localPath),
        path.resolve(__dirname, "..", localPath),
      ];

      let templatePath: string | null = null;

      for (const possiblePath of possiblePaths) {
        if (await fs.pathExists(possiblePath)) {
          templatePath = possiblePath;
          break;
        }
      }

      if (!templatePath) {
        throw new Error(
          `Template not found. Tried paths: ${possiblePaths.join(", ")}`
        );
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
      const tempPath = path.join(
        targetPath,
        "..",
        `${path.basename(targetPath)}-temp`
      );

      if (await fs.pathExists(sourcePath)) {
        await fs.move(sourcePath, tempPath);
        await fs.remove(targetPath);
        await fs.move(tempPath, targetPath);
      }
    }
  }

  async processTemplate(context: TemplateContext): Promise<void> {
    const { targetPath, projectName, options } = context;

    await this.updatePackageJson(targetPath, projectName, options);

    await this.processTemplateFiles(targetPath, context);

    await this.handleConditionalFiles(targetPath, options);

    if (options.git !== false) {
      await this.initializeGit(targetPath);
    }
  }

  private async updatePackageJson(
    targetPath: string,
    projectName: string,
    options: any
  ): Promise<void> {
    const packageJsonPath = path.join(targetPath, "package.json");

    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = await fs.readJson(packageJsonPath);

      packageJson.name = projectName;

      if (options.typescript) {
        packageJson.devDependencies = packageJson.devDependencies || {};
        packageJson.devDependencies.typescript = "^5.0.0";
        packageJson.devDependencies["@types/node"] = "^20.0.0";
      }

      if (options.tailwind) {
        packageJson.devDependencies = packageJson.devDependencies || {};
        packageJson.devDependencies.tailwindcss = "^3.4.0";
        packageJson.devDependencies.postcss = "^8.4.0";
        packageJson.devDependencies.autoprefixer = "^10.4.0";
      }

      if (options.styledComponents) {
        packageJson.dependencies = packageJson.dependencies || {};
        packageJson.dependencies["styled-components"] = "^6.1.0";
        if (options.typescript) {
          packageJson.devDependencies = packageJson.devDependencies || {};
          packageJson.devDependencies["@types/styled-components"] = "^5.1.34";
        }
      }

      if (options.mui) {
        packageJson.dependencies = packageJson.dependencies || {};
        packageJson.dependencies["@mui/material"] = "^5.15.0";
        packageJson.dependencies["@emotion/react"] = "^11.11.0";
        packageJson.dependencies["@emotion/styled"] = "^11.11.0";
        packageJson.dependencies["@mui/icons-material"] = "^5.15.0";
      }

      if (options.chakra) {
        packageJson.dependencies = packageJson.dependencies || {};
        packageJson.dependencies["@chakra-ui/react"] = "^2.8.0";
        packageJson.dependencies["@emotion/react"] = "^11.11.0";
        packageJson.dependencies["@emotion/styled"] = "^11.11.0";
        packageJson.dependencies["framer-motion"] = "^10.16.0";
      }

      if (options.reduxToolkit) {
        packageJson.dependencies = packageJson.dependencies || {};
        packageJson.dependencies["@reduxjs/toolkit"] = "^2.0.0";
        packageJson.dependencies["react-redux"] = "^9.0.0";
      }

      // Always include React Router unless --no-route is specified
      if (options.route !== false) {
        packageJson.dependencies = packageJson.dependencies || {};
        packageJson.dependencies["react-router-dom"] = "^6.20.0";
      }

      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
    }
  }

  private async processTemplateFiles(
    targetPath: string,
    context: TemplateContext
  ): Promise<void> {
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

      if (
        stat.isDirectory() &&
        !item.startsWith(".") &&
        item !== "node_modules"
      ) {
        files.push(...(await this.getAllFiles(fullPath)));
      } else if (stat.isFile()) {
        files.push(fullPath);
      }
    }

    return files;
  }

  private shouldProcessFile(filePath: string): boolean {
    const ext = path.extname(filePath);
    const processableExts = [
      ".js",
      ".ts",
      ".jsx",
      ".tsx",
      ".json",
      ".md",
      ".html",
      ".css",
      ".env",
    ];
    return (
      processableExts.includes(ext) || path.basename(filePath).startsWith(".")
    );
  }

  private async processFile(
    filePath: string,
    context: TemplateContext
  ): Promise<void> {
    try {
      let content = await fs.readFile(filePath, "utf8");

      content = content.replace(/\{\{PROJECT_NAME\}\}/g, context.projectName);
      content = content.replace(
        /\{\{project-name\}\}/g,
        context.projectName.toLowerCase()
      );
      content = content.replace(
        /\{\{Project Name\}\}/g,
        this.capitalizeWords(context.projectName)
      );

      await fs.writeFile(filePath, content);
    } catch (error) {}
  }

  private capitalizeWords(str: string): string {
    return str.replace(/\b\w/g, (l) => l.toUpperCase()).replace(/[-_]/g, " ");
  }

  private async hasTypeScriptFiles(targetPath: string): Promise<boolean> {
    const files = await this.getAllFiles(targetPath);
    return files.some((file) => file.endsWith(".ts") || file.endsWith(".tsx"));
  }

  private async convertToTypeScript(targetPath: string): Promise<void> {
    const files = await this.getAllFiles(targetPath);

    for (const filePath of files) {
      if (filePath.endsWith(".jsx")) {
        const newPath = filePath.replace(".jsx", ".tsx");
        await fs.move(filePath, newPath);

        let content = await fs.readFile(newPath, "utf8");
        content = this.convertJsxToTsx(content);
        await fs.writeFile(newPath, content);
      } else if (filePath.endsWith(".js") && !filePath.endsWith(".d.js")) {
        const newPath = filePath.replace(".js", ".ts");
        await fs.move(filePath, newPath);

        let content = await fs.readFile(newPath, "utf8");
        content = this.convertJsToTs(content);
        await fs.writeFile(newPath, content);
      }
    }

    const htmlFiles = ["index.html"];
    for (const htmlFile of htmlFiles) {
      const htmlPath = path.join(targetPath, htmlFile);
      if (await fs.pathExists(htmlPath)) {
        let content = await fs.readFile(htmlPath, "utf8");
        content = content.replace(/\.jsx/g, ".tsx");
        content = content.replace(/\.js/g, ".ts");
        await fs.writeFile(htmlPath, content);
      }
    }
  }

  private convertJsxToTsx(content: string): string {
    // Add React import if not present
    if (
      !content.includes("import React") &&
      !content.includes("import {") &&
      content.includes("React")
    ) {
      content = "import React from 'react'\n\n" + content;
    }

    // Add type annotations for function components
    content = content.replace(
      /function\s+(\w+)\s*\(/g,
      "function $1(): React.JSX.Element ("
    );

    // Fix the double parentheses issue
    content = content.replace(
      /function\s+(\w+)\s*\(\):\s*React\.JSX\.Element\s*\(\)/g,
      "function $1(): React.JSX.Element"
    );

    // Add type annotations for arrow function components
    content = content.replace(
      /const\s+(\w+)\s*=\s*\(/g,
      "const $1: React.FC = ("
    );

    // Update import statements to use .tsx extension
    content = content.replace(/from\s+['"]\.\/.*\.jsx['"]/g, (match) => {
      return match.replace(".jsx", ".tsx");
    });

    // Update text references from .jsx to .tsx
    content = content.replace(/src\/.*\.jsx/g, (match) => {
      return match.replace(".jsx", ".tsx");
    });

    return content;
  }

  private convertJsToTs(content: string): string {
    // Add basic TypeScript annotations
    // This is a simplified conversion - you might want to add more sophisticated logic
    return content;
  }

  private async handleConditionalFiles(
    targetPath: string,
    options: any
  ): Promise<void> {
    // Check if template already has TypeScript files
    const hasTypeScriptFiles = await this.hasTypeScriptFiles(targetPath);
    const shouldUseTypeScript = options.typescript || hasTypeScriptFiles;

    // Handle TypeScript configuration
    if (shouldUseTypeScript) {
      // Convert JavaScript files to TypeScript if TypeScript is selected
      if (options.typescript && !hasTypeScriptFiles) {
        await this.convertToTypeScript(targetPath);
      }
      // Ensure TypeScript files are preserved
      // No conversion needed when TypeScript is already in template
    } else {
      // Remove TypeScript config if TypeScript is not selected
      const tsConfigFiles = ["tsconfig.json", "tsconfig.node.json"];
      for (const tsConfigFile of tsConfigFiles) {
        const tsConfigPath = path.join(targetPath, tsConfigFile);
        if (await fs.pathExists(tsConfigPath)) {
          await fs.remove(tsConfigPath);
        }
      }

      // Convert TypeScript files to JavaScript
      const tsFiles = await this.getAllFiles(targetPath);
      for (const filePath of tsFiles) {
        if (filePath.endsWith(".tsx")) {
          const newPath = filePath.replace(".tsx", ".jsx");
          await fs.move(filePath, newPath);
        } else if (filePath.endsWith(".ts") && !filePath.endsWith(".d.ts")) {
          const newPath = filePath.replace(".ts", ".js");
          await fs.move(filePath, newPath);
        }
      }
    }

    // Remove Tailwind config if Tailwind is not selected
    if (!options.tailwind) {
      const tailwindConfigPath = path.join(targetPath, "tailwind.config.js");
      if (await fs.pathExists(tailwindConfigPath)) {
        await fs.remove(tailwindConfigPath);
      }

      // Also remove Tailwind CSS imports from main CSS file
      const cssFiles = [
        "src/index.css",
        "src/App.css",
        "src/styles/globals.css",
      ];
      for (const cssFile of cssFiles) {
        const cssPath = path.join(targetPath, cssFile);
        if (await fs.pathExists(cssPath)) {
          let content = await fs.readFile(cssPath, "utf8");
          content = content.replace(/@tailwind\s+[^;]+;/g, "");
          content = content.replace(
            /@import\s+['"]tailwindcss[^'"]*['"];?/g,
            ""
          );
          await fs.writeFile(cssPath, content);
        }
      }
    }

    // Handle UI library files
    if (!options.styledComponents) {
      // Remove styled-components files if not selected
      const styledFiles = ["src/components/styled", "src/styles/styled"];
      for (const styledFile of styledFiles) {
        const styledPath = path.join(targetPath, styledFile);
        if (await fs.pathExists(styledPath)) {
          await fs.remove(styledPath);
        }
      }
    }

    if (!options.mui) {
      // Remove MUI files if not selected
      const muiFiles = ["src/components/mui", "src/theme"];
      for (const muiFile of muiFiles) {
        const muiPath = path.join(targetPath, muiFile);
        if (await fs.pathExists(muiPath)) {
          await fs.remove(muiPath);
        }
      }
    }

    if (!options.chakra) {
      // Remove Chakra UI files if not selected
      const chakraFiles = ["src/components/chakra", "src/theme/chakra"];
      for (const chakraFile of chakraFiles) {
        const chakraPath = path.join(targetPath, chakraFile);
        if (await fs.pathExists(chakraPath)) {
          await fs.remove(chakraPath);
        }
      }
    }

    // Handle router files
    if (options.route === false) {
      // Remove router files if --no-route is specified
      const routerFiles = [
        "src/Routes",
        "src/routes",
        "src/components/Router",
        "src/components/router",
      ];

      for (const routerFile of routerFiles) {
        const routerPath = path.join(targetPath, routerFile);
        if (await fs.pathExists(routerPath)) {
          await fs.remove(routerPath);
        }
      }

      // Remove router imports from main App file
      const appFiles = [
        "src/App.jsx",
        "src/App.tsx",
        "src/App.js",
        "src/App.ts",
      ];
      for (const appFile of appFiles) {
        const appPath = path.join(targetPath, appFile);
        if (await fs.pathExists(appPath)) {
          let content = await fs.readFile(appPath, "utf8");
          content = content.replace(/import.*react-router-dom.*/g, "");
          content = content.replace(/<BrowserRouter>.*<\/BrowserRouter>/gs, "");
          content = content.replace(/<Routes>.*<\/Routes>/gs, "");
          content = content.replace(/<Route.*\/>/g, "");
          await fs.writeFile(appPath, content);
        }
      }
    } else {
      // Setup React Router if not disabled
      await this.setupReactRouter(targetPath, shouldUseTypeScript);
    }

    // Remove Redux files if Redux Toolkit is not selected
    if (!options.reduxToolkit) {
      const reduxFiles = [
        "src/store/index.js",
        "src/store/index.ts",
        "src/store/store.js",
        "src/store/store.ts",
        "src/features",
        "src/redux",
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

  private async setupReduxToolkit(
    targetPath: string,
    isTypeScript: boolean
  ): Promise<void> {
    const ext = isTypeScript ? "ts" : "js";

    // Create store directory
    const storeDir = path.join(targetPath, "src", "store");
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
    const featuresDir = path.join(targetPath, "src", "features");
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

    await fs.writeFile(
      path.join(featuresDir, `counterSlice.${ext}`),
      sliceContent
    );

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

  private async setupReactRouter(
    targetPath: string,
    isTypeScript: boolean
  ): Promise<void> {
    const ext = isTypeScript ? "tsx" : "jsx";

    // Create Routes directory
    const routesDir = path.join(targetPath, "src", "Routes");
    await fs.ensureDir(routesDir);

    // Create AppRoutes component
    const appRoutesContent = isTypeScript
      ? `import { Routes, Route } from 'react-router-dom'
import HomePage from '../Pages/HomePage'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* Add more routes here */}
    </Routes>
  )
}

export default AppRoutes`
      : `import { Routes, Route } from 'react-router-dom'
import HomePage from '../Pages/HomePage'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* Add more routes here */}
    </Routes>
  )
}

export default AppRoutes`;

    await fs.writeFile(
      path.join(routesDir, `AppRoutes.${ext}`),
      appRoutesContent
    );

    // Create Pages directory
    const pagesDir = path.join(targetPath, "src", "Pages");
    await fs.ensureDir(pagesDir);

    // Create HomePage component
    const homePageContent = isTypeScript
      ? `import React from 'react'

const HomePage: React.FC = () => {
  return (
    <div>
      <h1>Welcome to {{PROJECT_NAME}}</h1>
      <p>This is your home page.</p>
    </div>
  )
}

export default HomePage`
      : `import React from 'react'

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to {{PROJECT_NAME}}</h1>
      <p>This is your home page.</p>
    </div>
  )
}

export default HomePage`;

    await fs.writeFile(path.join(pagesDir, `HomePage.${ext}`), homePageContent);

    // Update main App file to include router
    const appFiles = ["src/App.jsx", "src/App.tsx", "src/App.js", "src/App.ts"];
    for (const appFile of appFiles) {
      const appPath = path.join(targetPath, appFile);
      if (await fs.pathExists(appPath)) {
        let content = await fs.readFile(appPath, "utf8");

        // Add router imports if not present
        if (!content.includes("react-router-dom")) {
          const routerImport = isTypeScript
            ? `import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './Routes/AppRoutes'`
            : `import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './Routes/AppRoutes'`;

          // Find the last import statement and add router imports after it
          const importRegex = /import.*from.*['"][^'"]*['"];?\n?/g;
          const imports = content.match(importRegex);
          if (imports) {
            const lastImport = imports[imports.length - 1];
            content = content.replace(
              lastImport,
              `${lastImport}${routerImport}\n`
            );
          } else {
            content = `${routerImport}\n\n${content}`;
          }
        }

        // Wrap content with BrowserRouter if not already wrapped
        if (!content.includes("<BrowserRouter>")) {
          content = content.replace(
            /<div[^>]*>[\s\S]*<\/div>/,
            '<BrowserRouter>\n    <div className="App">\n      <AppRoutes />\n    </div>\n  </BrowserRouter>'
          );
        }

        await fs.writeFile(appPath, content);
      }
    }
  }

  private async initializeGit(targetPath: string): Promise<void> {
    try {
      const { execSync } = require("child_process");
      execSync("git init", { cwd: targetPath, stdio: "ignore" });
      execSync("git add .", { cwd: targetPath, stdio: "ignore" });
      execSync('git commit -m "Initial commit"', {
        cwd: targetPath,
        stdio: "ignore",
      });
    } catch (error) {
      // Git initialization failed, but don't throw an error
      console.warn("Warning: Failed to initialize git repository");
    }
  }
}
