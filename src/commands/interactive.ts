import inquirer from "inquirer";
import chalk from "chalk";
import { InteractiveAnswers, CreateProjectOptions } from "../types";
import { createProject } from "./create";
import { getTemplateRegistry } from "../core/registry";

export async function interactive(): Promise<void> {
  try {
    console.log(
      chalk.bold.cyan("\n🚀 Welcome to rtg Template Interactive Mode!\n")
    );

    // Load available templates
    const registry = await getTemplateRegistry();
    const templateChoices = Object.entries(registry.templates).map(
      ([name, config]) => ({
        name: `${name} - ${config.description}`,
        value: name,
      })
    );

    const answers: InteractiveAnswers = await inquirer.prompt([
      {
        type: "list",
        name: "template",
        message: "Select a template:",
        choices: templateChoices,
      },
      {
        type: "input",
        name: "projectName",
        message: "Project name:",
        validate: (input: string) => {
          if (!input.trim()) {
            return "Project name is required";
          }
          if (!/^[a-zA-Z0-9-_]+$/.test(input)) {
            return "Project name can only contain letters, numbers, hyphens, and underscores";
          }
          return true;
        },
      },
      {
        type: "checkbox",
        name: "features",
        message: "Select additional features:",
        choices: [
          { name: "TypeScript", value: "typescript" },
          { name: "Tailwind CSS", value: "tailwind" },
          { name: "Styled Components", value: "styled-components" },
          { name: "Material-UI (MUI)", value: "mui" },
          { name: "Chakra UI", value: "chakra" },
          { name: "Redux Toolkit", value: "redux" },
          { name: "Authentication", value: "auth" },
          { name: "Prisma ORM", value: "prisma" },
        ],
      },
      {
        type: "list",
        name: "database",
        message: "Select a database (if applicable):",
        choices: [
          { name: "None", value: null },
          { name: "MongoDB", value: "mongodb" },
          { name: "PostgreSQL", value: "postgres" },
          { name: "MySQL", value: "mysql" },
        ],
        when: (answers) => {
          const template = registry.templates[answers.template];
          return template.addons.some((addon) =>
            ["mongodb", "mysql", "postgres", "prisma"].includes(addon)
          );
        },
      },
      {
        type: "list",
        name: "packageManager",
        message: "Choose package manager:",
        choices: [
          { name: "npm", value: "npm" },
          { name: "yarn", value: "yarn" },
          { name: "pnpm", value: "pnpm" },
        ],
        default: "npm",
      },
      {
        type: "confirm",
        name: "initGit",
        message: "Initialize git repository?",
        default: true,
      },
    ]);

    // Convert answers to options
    const options: CreateProjectOptions = {
      typescript: answers.features.includes("typescript"),
      tailwind: answers.features.includes("tailwind"),
      styledComponents: answers.features.includes("styled-components"),
      mui: answers.features.includes("mui"),
      chakra: answers.features.includes("chakra"),
      reduxToolkit: answers.features.includes("redux"),
      auth: answers.features.includes("auth"),
      prisma: answers.features.includes("prisma"),
      git: answers.initGit,
    };

    // Set database option
    if (answers.database) {
      switch (answers.database) {
        case "mongodb":
          options.mongodb = true;
          break;
        case "postgres":
          options.postgres = true;
          break;
        case "mysql":
          options.mysql = true;
          break;
      }
    }

    console.log(chalk.yellow("\n📦 Creating your project...\n"));

    // Create the project
    await createProject(answers.template, answers.projectName, options);
  } catch (error) {
    if (error instanceof Error && error.name === "ExitPromptError") {
      console.log(chalk.yellow("\n👋 Goodbye!"));
      process.exit(0);
    }

    console.error(
      chalk.red("Interactive mode failed:"),
      error instanceof Error ? error.message : error
    );
    process.exit(1);
  }
}
