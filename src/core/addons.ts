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

@theme {
  /* Brand colors */
  --color-brand-50: #f5f3ff;
  --color-brand-100: #ede9fe;
  --color-brand-200: #ddd6fe;
  --color-brand-300: #c4b5fd;
  --color-brand-400: #a78bfa;
  --color-brand-500: #8b5cf6;
  --color-brand-600: #7c3aed;
  --color-brand-700: #6d28d9;
  --color-brand-800: #5b21b6;
  --color-brand-900: #4c1d95;

  /* Typography */
  --text-display: 2.5rem; /* 40px */
  --text-title: 1.5rem;   /* 24px */
  --text-body: 1rem;      /* 16px */

  /* Radius */
  --radius-card: 1rem;    /* 16px */
  --radius-btn: 0.5rem;   /* 8px */

  /* Shadows */
  --shadow-card: 0 20px 40px rgba(0, 0, 0, 0.08);
  --shadow-btn: 0 4px 12px rgba(0, 0, 0, 0.12);
}

@layer base {
  html,
  body,
  #root {
    height: 100%;
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
}

  h1 { font-size: var(--text-display); font-weight: 700; }
  h2 { font-size: var(--text-title);   font-weight: 600; }
  a  { @apply text-brand-600 hover:text-brand-700; }
}

@layer components {
  .btn {
    @apply inline-flex items-center justify-center px-4 py-2 text-white bg-brand-600 rounded-[--radius-btn] hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400;
    box-shadow: var(--shadow-btn);
  }

  .btn-outline {
    @apply inline-flex items-center justify-center px-4 py-2 text-brand-700 border border-brand-300 rounded-[--radius-btn] hover:bg-brand-50;
  }

  .tw-card {
    @apply p-6 bg-white border border-gray-200 rounded-[--radius-card];
    box-shadow: var(--shadow-card);
  }
}
`,
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
