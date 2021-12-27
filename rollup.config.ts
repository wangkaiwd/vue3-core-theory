import path from 'path';
import typescript from 'rollup-plugin-typescript2';

const pkgsPath = path.resolve(__dirname, 'packages');
const target = process.env.TARGET as string;

const input = path.resolve(pkgsPath, target, 'src/index.ts');
const pkgDir = path.resolve(pkgsPath, target);
// todo: how to debug rollup.config.ts ? why this log not work ?
// todo: remove circular dependency warning
console.log('dir', pkgDir, target);
const dist = path.resolve(pkgDir, 'dist');
const { buildOptions } = require(path.resolve(pkgDir, 'package.json'));
const output = buildOptions.formats.map((format: any) => {
  return {
    format,
    sourcemap: true,
    file: path.resolve(dist, `${target}.${format}.js`),
    name: buildOptions.name
  };
});
export default {
  input,
  output,
  plugins: [typescript({
    tsconfig: './tsconfig.json',
    tsconfigOverride: { compilerOptions: { declarationDir: dist, declaration: true, sourceMap: true } },
  })]
};
