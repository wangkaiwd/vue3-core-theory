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
type Build = (target: string) => execa.ExecaChildProcess
const build: Build = (target) => {
  return execa('rollup', ['-c', `${rootContext}/rollup.config.ts`, `--environment`, `TARGET:${target}`, `--configPlugin`, `rollup-plugin-typescript2`], { stdio: 'inherit' });
};

const runParallel = (dirs: string[], build: Build) => {
  const builds = dirs.map(build);
  return Promise.all(builds);
};

runParallel(getPackageDirs(), build).then(() => {
  console.log('build all packages successfully');
});
