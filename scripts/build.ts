const path = require('path');
import fs from 'fs';
import execa from 'execa';

const rootContext = path.resolve(__dirname, '..');
const pkgsPath = path.resolve(rootContext, 'packages');
const argsPrefix = '--';
const args: string[] = process.argv.slice(2);
const parseConfig = (args: string[]) => {
  return args.reduce((memo: Record<string, any>, item, i) => {
    const next = args[i + 1];
    if (item.startsWith(argsPrefix)) {
      const key = item.slice(2);
      if (!next || next.startsWith(argsPrefix)) {
        memo[key] = true;
      } else {
        if (next.includes(',')) {
          memo[key] = next.split(',');
        } else {
          memo[key] = next;
        }
      }
    }
    return memo;
  }, {});
};
const config = parseConfig(args);
console.log('config', config);
// todo: how to elegant generate develop config ?
const getPackageDirs = (dirs: string[] | string) => {
  const formatDirs = Array.isArray(dirs) ? dirs : [dirs];
  if (formatDirs.length) {
    return formatDirs.map(dir => path.resolve(pkgsPath, dir));
  } else {
    return fs.readdirSync(pkgsPath).filter(dir => {
      const stats = fs.statSync(path.resolve(pkgsPath, dir));
      return stats.isDirectory();
    });
  }
};
type Build = (target: string, config?: Record<string, any>) => execa.ExecaChildProcess
const build: Build = (target, config = {}) => {
  return execa('rollup', [`-c${config.dev ? 'w' : ''}`, `${rootContext}/rollup.config.ts`, `--environment`, `TARGET:${target}`, `--configPlugin`, `rollup-plugin-typescript2`], { stdio: 'inherit' });
};

const runParallel = (dirs: string[], config: Record<string, any>, build: Build) => {
  console.log('config', dirs, config);
  const builds = dirs.map((dir) => build(dir, config));
  return Promise.all(builds);
};

runParallel(getPackageDirs(config.pkgs), config, build).then(() => {
  console.log('build all packages successfully');
});
