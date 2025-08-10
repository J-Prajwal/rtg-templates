import { TemplateRegistry, TemplateConfig } from "../types";

// Built-in template registry
const BUILTIN_TEMPLATES: Record<string, TemplateConfig> = {
  "react": {
    name: "react",
    description: "React application with Vite, React Router, Axios, Husky, ESLint, and Prettier",
    repository: "local:templates/react",
    frameworks: ["React", "Vite", "React Router", "Axios", "Husky", "ESLint", "Prettier"],
    addons: ["tailwind", "styled-components", "mui", "chakra", "redux", "tanstack-query"],
    postInstall: {
      dependencies: [
        "react", 
        "react-dom", 
        "react-router-dom", 
        "axios"
      ],
      devDependencies: [
        "@vitejs/plugin-react", 
        "vite", 
        "husky", 
        "lint-staged", 
        "eslint", 
        "eslint-plugin-react", 
        "eslint-plugin-react-hooks", 
        "eslint-plugin-react-refresh", 
        "@typescript-eslint/eslint-plugin", 
        "@typescript-eslint/parser", 
        "prettier", 
        "eslint-config-prettier", 
        "eslint-plugin-prettier"
      ],
      instructions: "Run `npm run dev` to start the development server.",
    },
  },
  "react-ts": {
    name: "react-ts",
    description: "React application with TypeScript, Vite, React Router, Axios, Husky, ESLint, and Prettier",
    repository: "local:templates/react-ts",
    frameworks: ["React", "TypeScript", "Vite", "React Router", "Axios", "Husky", "ESLint", "Prettier"],
    addons: ["tailwind", "styled-components", "mui", "chakra", "redux", "tanstack-query"],
    postInstall: {
      dependencies: [
        "react", 
        "react-dom", 
        "react-router-dom", 
        "axios"
      ],
      devDependencies: [
        "@vitejs/plugin-react", 
        "vite", 
        "typescript", 
        "@types/react", 
        "@types/react-dom", 
        "husky", 
        "lint-staged", 
        "eslint", 
        "eslint-plugin-react", 
        "eslint-plugin-react-hooks", 
        "eslint-plugin-react-refresh", 
        "@typescript-eslint/eslint-plugin", 
        "@typescript-eslint/parser", 
        "prettier", 
        "eslint-config-prettier", 
        "eslint-plugin-prettier"
      ],
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
