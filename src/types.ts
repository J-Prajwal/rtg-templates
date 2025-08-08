export interface TemplateConfig {
  name: string;
  description: string;
  repository?: string;
  directory?: string;
  frameworks: string[];
  addons: string[];
  postInstall?: PostInstallConfig;
}

export interface PostInstallConfig {
  scripts?: string[];
  envTemplate?: string;
  dependencies?: string[];
  devDependencies?: string[];
  instructions?: string;
}

export interface CreateProjectOptions {
  // Base template options
  typescript?: boolean;
  
  // UI/CSS add-ons
  tailwind?: boolean;
  styledComponents?: boolean;
  mui?: boolean;
  chakra?: boolean;
  
  // State management add-ons
  redux?: boolean;
  tanstackQuery?: boolean;
  
  // Routing
  route?: boolean; // true by default, false when --no-route is used
  noRoute?: boolean; // legacy property
  
  // Legacy options (for backward compatibility)
  reduxToolkit?: boolean;
  auth?: boolean;
  prisma?: boolean;
  mongodb?: boolean;
  mysql?: boolean;
  postgres?: boolean;
  interactive?: boolean;
  directory?: string;
  repo?: string;
  install?: boolean;
  git?: boolean;
}

export interface TemplateRegistry {
  templates: Record<string, TemplateConfig>;
  version: string;
}

export interface InteractiveAnswers {
  template: string;
  projectName: string;
  features: string[];
  stateManagement: string[];
  includeRouter: boolean;
  packageManager: 'npm' | 'yarn' | 'pnpm';
  initGit: boolean;
}

export interface TemplateContext {
  projectName: string;
  options: CreateProjectOptions;
  targetPath: string;
  templatePath?: string;
}

export interface AddonConfig {
  name: string;
  dependencies?: string[];
  devDependencies?: string[];
  scripts?: Record<string, string>;
  files?: Record<string, string>;
  instructions?: string;
} 