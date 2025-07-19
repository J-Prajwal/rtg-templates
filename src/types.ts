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
  typescript?: boolean;
  tailwind?: boolean;
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
  database?: string;
  packageManager: 'npm' | 'yarn' | 'pnpm';
  initGit: boolean;
}

export interface TemplateContext {
  projectName: string;
  options: CreateProjectOptions;
  targetPath: string;
  templatePath?: string;
} 