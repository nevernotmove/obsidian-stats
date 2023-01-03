import esbuild from "esbuild";

esbuild.build({
    banner: {
        js: '// This code is generated'
    },
    entryPoints: ['src/main.ts'],
    bundle: true,
    treeShaking: true,
    outdir: 'build'
}).catch(() => process.exit(1))