import { defineConfig } from 'tsup';

export default defineConfig({
  clean: true,
  dts: true,
  entry: ['src/app.ts'],
  outDir: 'build',
  format: ['cjs', 'esm'],
  minify: process.env.NODE_ENV === 'production',
  sourcemap: true,
});
