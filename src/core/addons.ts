import { AddonConfig } from '../types';

export const ADDONS: Record<string, AddonConfig> = {
  tailwind: {
    name: 'tailwind',
    dependencies: [],
    devDependencies: [
      'tailwindcss',
      'postcss',
      'autoprefixer',
      '@tailwindcss/postcss'
    ],
    scripts: {
      'build:css': 'tailwindcss -i ./src/index.css -o ./dist/output.css --watch'
    },
    files: {
      'tailwind.config.js': `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`,
      'postcss.config.js': `export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}`,
      'src/index.css': `@tailwind base;
@tailwind components;
@tailwind utilities;`
    },
    instructions: 'Tailwind CSS has been configured. Make sure to import the CSS file in your main component.'
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
