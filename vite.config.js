import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import monkey, { cdn } from 'vite-plugin-monkey';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    //
    monkey({
      entry: 'src/main.jsx',
      userscript: {
        version: "0.6.0",
        author: "bmillion",
        icon: 'https://share.amazon.com/sites/bmillion/Shared%20Documents/Homy/lion-vector-illustration-outline-coloring.png',
        namespace: 'bmillion/packSingleUtility',
        match: ['https://share.amazon.com/sites/bmillion/Shared%20Documents/Homy/index.html'],
        downloadURL: ['https://share.amazon.com/sites/bmillion/Shared%20Documents/Homy/Homy.user.js'],
        updateURL: ['https://share.amazon.com/sites/bmillion/Shared%20Documents/Homy/Homy.user.js']
      },
      build: {
        externalGlobals: {
          react: cdn.jsdelivr('React', 'umd/react.production.min.js'),
          'react-dom': cdn.jsdelivr(
            'ReactDOM',
            'umd/react-dom.production.min.js',
          ),
        },
      },
    }),
    //
  ],
});
