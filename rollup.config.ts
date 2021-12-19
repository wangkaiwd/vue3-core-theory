import path from 'path';
import typescript from 'rollup-plugin-typescript2';

const pkgsPath = path.resolve(__dirname, 'packages');
const target = process.env.TARGET as string;

const input = path.resolve(pkgsPath, target, 'index.ts');
// @ts-ignore
const pkgDir = path.resolve(pkgsPath, target);
const { buildOptions } = require(path.resolve(pkgDir, 'package.json'));
const output = buildOptions.formats.map((format: any) => {
  return {
    format,
    file: path.resolve(pkgDir, 'dist', `${target}.${format}.js`),
    name: buildOptions.name
  };
});

export default {
  input,
  output,
  plugins: [typescript()]
};
