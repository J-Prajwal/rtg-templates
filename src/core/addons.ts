import { AddonConfig } from '../types';

export const ADDONS: Record<string, AddonConfig> = {
  tailwind: {
    name: 'tailwind',
    dependencies: [],
    devDependencies: [
      'tailwindcss@^4.1.11',
      '@tailwindcss/vite@^4.1.11'
    ],
    files: {
      'src/index.css': `@import "tailwindcss";

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f5f5f5;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}`
    },
    viteConfigModifier: (content: string) => {
      // Add tailwindcss import
      if (content.includes("import react from '@vitejs/plugin-react'")) {
        content = content.replace(
          "import react from '@vitejs/plugin-react'",
          "import react from '@vitejs/plugin-react'\nimport tailwindcss from '@tailwindcss/vite'"
        );
      }
      
      // Add tailwindcss to plugins array
      if (content.includes('plugins: [react()]')) {
        content = content.replace(
          'plugins: [react()]',
          'plugins: [\n    react(),\n    tailwindcss(),\n  ]'
        );
      }
      
      return content;
    },
    instructions: 'Tailwind CSS has been configured with the latest Vite integration. You can now use Tailwind classes in your components.'
  },

  styledComponents: {
    name: 'styled-components',
    dependencies: [
      'styled-components'
    ],
    devDependencies: [
      '@types/styled-components'
    ],
    instructions: 'Styled Components has been installed. You can now use styled components in your React app.'
  },

  mui: {
    name: 'mui',
    dependencies: [
      '@mui/material',
      '@emotion/react',
      '@emotion/styled',
      '@mui/icons-material'
    ],
    instructions: 'Material-UI has been installed. You can now use MUI components in your React app.'
  },

  chakra: {
    name: 'chakra',
    dependencies: [
      '@chakra-ui/react',
      '@emotion/react',
      '@emotion/styled',
      'framer-motion'
    ],
    instructions: 'Chakra UI has been installed. You can now use Chakra components in your React app.'
  },

  redux: {
    name: 'redux',
    dependencies: [
      '@reduxjs/toolkit',
      'react-redux'
    ],
    devDependencies: [
      '@types/react-redux'
    ],
    files: {
      'src/store/index.ts': `import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    // Add your reducers here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;`,
      'src/store/hooks.ts': `import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from './index';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;`
    },
    instructions: 'Redux Toolkit has been installed and configured. You can now use Redux in your React app.'
  },

  tanstackQuery: {
    name: 'tanstack-query',
    dependencies: [
      '@tanstack/react-query'
    ],
    files: {
      'src/lib/query-client.ts': `import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});`
    },
    instructions: 'TanStack Query has been installed and configured. You can now use React Query in your app.'
  }
};

export function getAddonConfig(addonName: string): AddonConfig | null {
  return ADDONS[addonName] || null;
}

export function getAllAddonNames(): string[] {
  return Object.keys(ADDONS);
}
