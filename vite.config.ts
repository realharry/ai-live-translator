import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { copyFileSync, mkdirSync, existsSync, renameSync } from 'fs'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'copy-manifest-and-icons',
      writeBundle() {
        // Copy manifest.json
        copyFileSync('src/manifest.json', 'dist/manifest.json');
        
        // Copy icons
        if (!existsSync('dist/icons')) {
          mkdirSync('dist/icons');
        }
        const iconSizes = ['16', '32', '48', '128'];
        iconSizes.forEach(size => {
          if (existsSync(`src/icons/icon${size}.png`)) {
            copyFileSync(`src/icons/icon${size}.png`, `dist/icons/icon${size}.png`);
          }
        });

        // Move HTML files to correct locations
        const pages = ['popup', 'sidepanel', 'options'];
        pages.forEach(page => {
          const srcPath = `dist/src/${page}/index.html`;
          const destDir = `dist/${page}`;
          const destPath = `${destDir}/index.html`;
          
          if (existsSync(srcPath)) {
            if (!existsSync(destDir)) {
              mkdirSync(destDir, { recursive: true });
            }
            renameSync(srcPath, destPath);
          }
        });
        
        // Clean up empty src directory
        try {
          const fs = require('fs');
          const rmdir = (dir: string) => {
            if (existsSync(dir)) {
              fs.rmSync(dir, { recursive: true, force: true });
            }
          };
          rmdir('dist/src');
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    }
  ],
  build: {
    rollupOptions: {
      input: {
        popup: resolve(__dirname, 'src/popup/index.html'),
        sidepanel: resolve(__dirname, 'src/sidepanel/index.html'),
        options: resolve(__dirname, 'src/options/index.html'),
        background: resolve(__dirname, 'src/background/background.ts'),
        content: resolve(__dirname, 'src/content/content.ts')
      },
      output: {
        entryFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'unknown';
          if (facadeModuleId === 'background.ts') return 'background.js';
          if (facadeModuleId === 'content.ts') return 'content.js';
          return '[name].[hash].js';
        },
        chunkFileNames: '[name].[hash].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name;
          if (name && name.endsWith('.css')) {
            if (name.includes('popup')) return 'popup/popup.css';
            if (name.includes('sidepanel')) return 'sidepanel/sidepanel.css';
            if (name.includes('options')) return 'options/options.css';
          }
          return '[name].[ext]';
        }
      }
    },
    outDir: 'dist',
    emptyOutDir: true
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  }
})