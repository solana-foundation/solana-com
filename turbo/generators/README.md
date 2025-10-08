# Generators

This repo uses [turbo gen](https://turborepo.com/docs/guides/generating-code) to
generate new packages.

## Usage

You can run the generator in interactive mode:

```shell
pnpm turbo gen
```

### Generating a package

Or you can run pass the parameters and automate the generation:

```shell
pnpm turbo gen pkg --args basic i18n
#              ^          ^     ^
#              |          |     |
#              |          |     + - - the name of the package
#              |          |
#              |          + - - the type of package you want to generate
#              |
#              + - - the generator you want to invoke
```

## Adding a new generator

Take these steps to add a new generator:

- copy `turbo/generators/generator-pkg.ts` to
  `turbo/generators/generator-<name>.ts`
- add template files in `turbo/generators/templates/<name>`
- update references from `pkg` to `<name>`
- update `turbo/generators/config.ts` and register the new generator
