import * as esbuild from 'esbuild';
import { setBuildAdapter, FederationOptions, loadFederationConfig, getExternals, buildForFederation } from '@softarc/native-federation/build';
import { esBuildAdapter } from './esbuild-adapter';
import * as path from 'path';
import * as fs from 'fs';

export async function buildProject(projectName) {

    setBuildAdapter(esBuildAdapter);

    const fedOptions: FederationOptions = {
        workspaceRoot: '.',
        outputPath: `dist/${projectName}`,
        tsConfig: 'tsconfig.json',
        verbose: false
    }

    const config = await loadFederationConfig(path.join(__dirname, `../${projectName}/federation.config.js`));
    const externals = getExternals(config);
    
    fs.rmSync(fedOptions.outputPath, { force: true, recursive: true });

    await esbuild.build({
        entryPoints: [`${projectName}/src/index.ts`],
        external: externals,
        outdir: fedOptions.outputPath,
        bundle: true,
        platform: 'browser',
        format: 'esm',
        mainFields: ['es2020', 'browser', 'module', 'main'],
        conditions: ['es2020', 'es2015', 'module'],
        resolveExtensions: ['.ts', '.tsx', '.mjs', '.js'],
        tsconfig: fedOptions.tsConfig,
        splitting: true
    });

    await buildForFederation(config, fedOptions, externals);

    fs.copyFileSync(`${projectName}/public/index.html`, `dist/${projectName}/index.html`);
    fs.copyFileSync(`${projectName}/public/favicon.ico`, `dist/${projectName}/favicon.ico`);

}
