import { execSync } from "child_process";
import path from "path";
import fs from "fs-extra";
import { TemplateConfig, TemplateContext } from "../types";

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

    // Setup linting and prettier
    await this.setupLintingAndPrettier();

    // Setup Husky if it's in the dependencies
    await this.setupHusky();
  }

  private async installDependencies(): Promise<void> {
    const { targetPath, options } = this.context;
    const { postInstall } = this.config;

    if (!postInstall) return;

    try {
      // Collect all dependencies to install
      const dependencies: string[] = [];
      const devDependencies: string[] = [];

      // Add base dependencies from template
      if (postInstall.dependencies) {
        dependencies.push(...postInstall.dependencies);
      }
      if (postInstall.devDependencies) {
        devDependencies.push(...postInstall.devDependencies);
      }

      // Add UI library dependencies based on options
      if (options.styledComponents) {
        dependencies.push("styled-components");
        if (options.typescript) {
          devDependencies.push("@types/styled-components");
        }
      }

      if (options.mui) {
        dependencies.push(
          "@mui/material",
          "@emotion/react",
          "@emotion/styled",
          "@mui/icons-material"
        );
      }

      if (options.chakra) {
        dependencies.push(
          "@chakra-ui/react",
          "@emotion/react",
          "@emotion/styled",
          "framer-motion"
        );
      }

      if (options.reduxToolkit) {
        dependencies.push("@reduxjs/toolkit", "react-redux");
      }

      // Add router dependency unless --no-route is specified
      if (options.route !== false) {
        dependencies.push("react-router-dom");
      }

      // Add Tailwind dependencies if selected
      if (options.tailwind) {
        devDependencies.push("tailwindcss", "postcss", "autoprefixer");
      }

      // Add TypeScript dependencies if selected
      if (options.typescript) {
        devDependencies.push(
          "typescript",
          "@types/react",
          "@types/react-dom",
          "@types/node"
        );
      }

      // Install production dependencies
      if (postInstall.dependencies && postInstall.dependencies.length > 0) {
        const depsToInstall = this.filterExistingDependencies(
          postInstall.dependencies
        );
        if (depsToInstall.length > 0) {
          execSync(`npm install ${depsToInstall.join(" ")}`, {
            cwd: targetPath,
            stdio: "inherit",
          });
        }
      }

      // Install dev dependencies
      if (
        postInstall.devDependencies &&
        postInstall.devDependencies.length > 0
      ) {
        const devDepsToInstall = this.filterExistingDependencies(
          postInstall.devDependencies
        );
        if (devDepsToInstall.length > 0) {
          execSync(`npm install --save-dev ${devDepsToInstall.join(" ")}`, {
            cwd: targetPath,
            stdio: "inherit",
          });
        }
      }

      // Run npm install to install existing dependencies
      if (await fs.pathExists(path.join(targetPath, "package.json"))) {
        execSync("npm install", {
          cwd: targetPath,
          stdio: "inherit",
        });
      }
    } catch (error) {
      console.warn("Warning: Failed to install some dependencies");
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

    const envPath = path.join(targetPath, ".env");

    // Only create if .env doesn't exist
    if (!(await fs.pathExists(envPath))) {
      await fs.writeFile(envPath, postInstall.envTemplate);
    }

    // Also create .env.example
    const envExamplePath = path.join(targetPath, ".env.example");
    if (!(await fs.pathExists(envExamplePath))) {
      // Remove actual values for the example file
      const exampleContent = postInstall.envTemplate
        .split("\n")
        .map((line) => {
          if (line.includes("=")) {
            const [key] = line.split("=");
            return `${key}=`;
          }
          return line;
        })
        .join("\n");

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
          stdio: "inherit",
        });
      } catch (error) {
        console.warn(`Warning: Failed to run script: ${script}`);
      }
    }
  }

  private async setupLintingAndPrettier(): Promise<void> {
    const { targetPath, options } = this.context;
    const { postInstall } = this.config;

    if (!postInstall?.linting) return;

    try {
      // Install dependencies for linting and prettier
      const lintingDeps: string[] = [];
      const prettierDeps: string[] = [];

      // Add ESLint dependencies
      lintingDeps.push(
        "eslint",
        "eslint-config-prettier",
        "eslint-plugin-prettier"
      );

      // Add React-specific ESLint plugins
      lintingDeps.push("eslint-plugin-react", "eslint-plugin-react-hooks");

      // Add TypeScript ESLint if TypeScript is enabled
      if (options.typescript) {
        lintingDeps.push(
          "@typescript-eslint/eslint-plugin",
          "@typescript-eslint/parser"
        );
      }

      // Add Prettier
      prettierDeps.push("prettier");

      // Install linting dependencies
      if (lintingDeps.length > 0) {
        const depsToInstall = this.filterExistingDependencies(lintingDeps);
        if (depsToInstall.length > 0) {
          execSync(`npm install --save-dev ${depsToInstall.join(" ")}`, {
            cwd: targetPath,
            stdio: "inherit",
          });
        }
      }

      // Install prettier dependencies
      if (prettierDeps.length > 0) {
        const depsToInstall = this.filterExistingDependencies(prettierDeps);
        if (depsToInstall.length > 0) {
          execSync(`npm install --save-dev ${depsToInstall.join(" ")}`, {
            cwd: targetPath,
            stdio: "inherit",
          });
        }
      }

      // Create .eslintrc.js
      const eslintrcPath = path.join(targetPath, ".eslintrc.js");
      if (!(await fs.pathExists(eslintrcPath))) {
        const eslintConfig = options.typescript
          ? `module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', '@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'react/react-in-jsx-scope': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}`
          : `module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'prettier',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'react/react-in-jsx-scope': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
}`;

        await fs.writeFile(eslintrcPath, eslintConfig);
      }

      // Create .prettierrc
      const prettierrcPath = path.join(targetPath, ".prettierrc");
      if (!(await fs.pathExists(prettierrcPath))) {
        const prettierConfig = `{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}`;

        await fs.writeFile(prettierrcPath, prettierConfig);
      }

      // Add lint scripts to package.json
      const packageJsonPath = path.join(targetPath, "package.json");
      if (await fs.pathExists(packageJsonPath)) {
        const packageJson = await fs.readJson(packageJsonPath);
        packageJson.scripts = packageJson.scripts || {};
        packageJson.scripts.lint = "eslint src --ext .js,.jsx,.ts,.tsx";
        packageJson.scripts["lint:fix"] =
          "eslint src --ext .js,.jsx,.ts,.tsx --fix";
        packageJson.scripts.format =
          "prettier --write src/**/*.{js,jsx,ts,tsx,css,md}";

        await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
      }
    } catch (error) {
      console.warn("Warning: Failed to setup linting and prettier");
    }
  }

  private async setupHusky(): Promise<void> {
    const { targetPath } = this.context;

    try {
      // Check if husky is in package.json
      const packageJsonPath = path.join(targetPath, "package.json");
      if (await fs.pathExists(packageJsonPath)) {
        const packageJson = await fs.readJson(packageJsonPath);

        // Install husky and lint-staged
        execSync("npm install --save-dev husky lint-staged", {
          cwd: targetPath,
          stdio: "inherit",
        });

        // Initialize husky
        execSync("npx husky install", {
          cwd: targetPath,
          stdio: "inherit",
        });

        // Add pre-commit hook for lint-staged
        execSync('npx husky add .husky/pre-commit "npx lint-staged"', {
          cwd: targetPath,
          stdio: "inherit",
        });

        // Add lint-staged configuration to package.json
        packageJson["lint-staged"] = {
          "src/**/*.{js,jsx,ts,tsx}": ["eslint --fix", "prettier --write"],
          "src/**/*.{css,md}": ["prettier --write"],
        };

        await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });
      }
    } catch (error) {
      console.warn("Warning: Failed to setup Husky");
    }
  }

  static async runCustomPostInstall(targetPath: string): Promise<void> {
    // Look for custom .get-template.js file
    const customPostInstallPath = path.join(targetPath, ".get-template.js");

    if (await fs.pathExists(customPostInstallPath)) {
      try {
        // Import and run custom post-install script
        const customScript = require(customPostInstallPath);

        if (typeof customScript === "function") {
          await customScript(targetPath);
        } else if (
          customScript.postInstall &&
          typeof customScript.postInstall === "function"
        ) {
          await customScript.postInstall(targetPath);
        }

        // Remove the custom script file after execution
        await fs.remove(customPostInstallPath);
      } catch (error) {
        console.warn("Warning: Failed to run custom post-install script");
      }
    }
  }
}
