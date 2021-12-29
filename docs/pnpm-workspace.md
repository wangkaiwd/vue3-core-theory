## create monorepo project

### Pnpm workspace

1. create `pnpm-workspace.yaml` and add follow configuration

```yaml
prefer-workspace-packages: true
packages:
  - 'packages/**'       
```

2. create `.npmrc` and add follow configuration

```text
shamefully-hoist=true
```

### Reference

* [npm workspace](https://docs.npmjs.com/cli/v7/using-npm/workspaces#getting-started-with-workspaces)
* [Replacing Lerna + Yarn with PNPM Workspaces](https://www.raulmelo.dev/blog/replacing-lerna-and-yarn-with-pnpm-workspaces)
