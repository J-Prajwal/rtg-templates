import { TemplateRegistry, TemplateConfig } from "../types";

// Built-in template registry
const BUILTIN_TEMPLATES: Record<string, TemplateConfig> = {
  react: {
    name: "react",
    description: "React application with Vite",
    repository: "local:templates/react-basic",
    frameworks: ["React", "Vite"],
    addons: [
      "typescript",
      "tailwind",
      "styled-components",
      "mui",
      "chakra",
      "redux-toolkit",
      "router",
    ],
    postInstall: {
      dependencies: ["react", "react-dom"],
      devDependencies: ["@vitejs/plugin-react", "vite"],
      instructions: "Run `npm run dev` to start the development server.",
      linting: {
        eslint: `module.exports = {
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
}`,
        prettier: `{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false
}`,
      },
    },
  },
  "react-ts": {
    name: "react-ts",
    description: "React application with TypeScript and Vite",
    repository: "local:templates/react-ts",
    frameworks: ["React", "Vite", "TypeScript"],
    addons: [
      "tailwind",
      "styled-components",
      "mui",
      "chakra",
      "redux-toolkit",
      "router",
    ],
    postInstall: {
      dependencies: ["react", "react-dom"],
      devDependencies: [
        "@vitejs/plugin-react",
        "vite",
        "typescript",
        "@types/react",
        "@types/react-dom",
      ],
      instructions: "Run `npm run dev` to start the development server.",
    },
  },
  "react-tailwind": {
    name: "react-tailwind",
    description: "React application with Tailwind CSS",
    repository: "local:templates/react-tailwind",
    frameworks: ["React", "Vite", "Tailwind CSS"],
    addons: ["typescript", "redux-toolkit", "router"],
    postInstall: {
      dependencies: ["react", "react-dom"],
      devDependencies: [
        "@vitejs/plugin-react",
        "vite",
        "tailwindcss",
        "postcss",
        "autoprefixer",
      ],
      instructions: "Run `npm run dev` to start the development server.",
    },
  },
  "react-tailwind-ts": {
    name: "react-tailwind-ts",
    description: "React application with Tailwind CSS and TypeScript",
    repository: "local:templates/react-tailwind-ts",
    frameworks: ["React", "Vite", "Tailwind CSS", "TypeScript"],
    addons: ["redux-toolkit", "router"],
    postInstall: {
      dependencies: ["react", "react-dom"],
      devDependencies: [
        "@vitejs/plugin-react",
        "vite",
        "tailwindcss",
        "postcss",
        "autoprefixer",
        "typescript",
        "@types/react",
        "@types/react-dom",
      ],
      instructions: "Run `npm run dev` to start the development server.",
    },
  },
  "react-material-ui": {
    name: "react-material-ui",
    description: "React application with Material-UI",
    repository: "local:templates/react-material-ui",
    frameworks: ["React", "Vite", "Material-UI"],
    addons: ["typescript", "redux-toolkit", "router"],
    postInstall: {
      dependencies: [
        "react",
        "react-dom",
        "@mui/material",
        "@emotion/react",
        "@emotion/styled",
      ],
      devDependencies: ["@vitejs/plugin-react", "vite"],
      instructions: "Run `npm run dev` to start the development server.",
    },
  },
  "react-styled-components": {
    name: "react-styled-components",
    description: "React application with Styled Components",
    repository: "local:templates/react-styled-components",
    frameworks: ["React", "Vite", "Styled Components"],
    addons: ["typescript", "redux-toolkit", "router"],
    postInstall: {
      dependencies: ["react", "react-dom", "styled-components"],
      devDependencies: ["@vitejs/plugin-react", "vite"],
      instructions: "Run `npm run dev` to start the development server.",
    },
  },
  "react-router-dom": {
    name: "react-router-dom",
    description: "React application with React Router DOM",
    repository: "local:templates/react-router-dom",
    frameworks: ["React", "Vite", "React Router DOM"],
    addons: ["typescript", "router"],
    postInstall: {
      dependencies: ["react", "react-dom", "react-router-dom"],
      devDependencies: ["@vitejs/plugin-react", "vite"],
      instructions: "Run `npm run dev` to start the development server.",
    },
  },
  "react-router-dom-ts": {
    name: "react-router-dom-ts",
    description: "React application with React Router DOM and TypeScript",
    repository: "local:templates/react-router-dom-ts",
    frameworks: ["React", "Vite", "React Router DOM", "TypeScript"],
    addons: ["typescript", "router"],
    postInstall: {
      dependencies: ["react", "react-dom", "react-router-dom"],
      devDependencies: [
        "@vitejs/plugin-react",
        "vite",
        "typescript",
        "@types/react",
        "@types/react-dom",
      ],
      instructions: "Run `npm run dev` to start the development server.",
    },
  },
  "node-api-basic": {
    name: "node-api-basic",
    description: "Basic Node.js API with Express",
    repository: "local:templates/node-api-basic",
    frameworks: ["Node.js", "Express"],
    addons: ["typescript", "mongodb", "mysql", "postgres", "auth"],
    postInstall: {
      dependencies: ["express", "cors", "helmet", "dotenv"],
      devDependencies: ["nodemon"],
      envTemplate: "PORT=3000\nNODE_ENV=development\n",
      instructions: "Run `npm run dev` to start the development server.",
    },
  },
};

const DEFAULT_REGISTRY: TemplateRegistry = {
  version: "1.0.0",
  templates: BUILTIN_TEMPLATES,
};

// Cache for external registries
let cachedRegistry: TemplateRegistry | null = null;

export async function getTemplateRegistry(registryUrl?: string): Promise<TemplateRegistry> {
  if (cachedRegistry && !registryUrl) {
    return cachedRegistry;
  }

  if (registryUrl) {
    // Load external registry (for future extension)
    try {
      const response = await fetch(registryUrl);
      const externalRegistry = (await response.json()) as TemplateRegistry;

      // Validate external registry structure
      if (!externalRegistry || typeof externalRegistry !== "object" || !externalRegistry.templates) {
        throw new Error("Invalid registry format");
      }

      // Merge with builtin templates
      const mergedRegistry: TemplateRegistry = {
        version: externalRegistry.version || "1.0.0",
        templates: {
          ...BUILTIN_TEMPLATES,
          ...externalRegistry.templates,
        },
      };

      cachedRegistry = mergedRegistry;
      return mergedRegistry;
    } catch (error) {
      console.warn("Failed to load external registry, using builtin templates");
      return DEFAULT_REGISTRY;
    }
  }

  cachedRegistry = DEFAULT_REGISTRY;
  return DEFAULT_REGISTRY;
}

export function getTemplateConfig(templateName: string, registry: TemplateRegistry): TemplateConfig | null {
  return registry.templates[templateName] || null;
}

export function listAvailableTemplates(registry: TemplateRegistry): string[] {
  return Object.keys(registry.templates);
}
