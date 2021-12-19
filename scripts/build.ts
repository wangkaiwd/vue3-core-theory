const path = require('path');
import fs from 'fs';
import execa from 'execa';

const rootContext = path.resolve(__dirname, '..');
const pkgsPath = path.resolve(rootContext, 'packages');

const getPackageDirs = () => {
  return fs.readdirSync(pkgsPath).filter(dir => {
    const stats = fs.statSync(path.resolve(pkgsPath, dir));
    return stats.isDirectory();
  });
};

function build () {
  const dirs = getPackageDirs();
  const builds = dirs.map(dir => {
    // https://github.com/rollup/rollup/pull/3835
    return execa('rollup', ['-c', `${rootContext}/rollup.config.ts`, `--environment`, `TARGET:${dir}`,`--configPlugin`,`rollup-plugin-typescript2`]);
  });
  return Promise.all(builds).then(() => {
    console.log('build all packages successfully');
  });
}

build()
