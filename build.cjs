require('esbuild').build({
  entryPoints: ['server/index.ts'],
  bundle: true,
  outfile: 'server.js',
	target: 'esnext',
	platform: 'node',
	format:'esm',
	sourcemap:'inline',
	watch: true,
	banner: {
		js: "import { createRequire as topLevelCreateRequire } from 'module';\n const require = topLevelCreateRequire(import.meta.url);"
	},
}).catch(() => process.exit(1))