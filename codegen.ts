import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: './src/graphql/modules/**/*.graphqls',
  config: {
    useIndexSignature: true,
    contextType: '../contracts/context#Context',
  },
  generates: {
    'src/graphql/modules': {
      // @ts-expect-error - This is a custom preset
      preset: '@eddeee888/gcg-typescript-resolver-files',
    },
  },
  hooks: {
    afterOneFileWrite: ['prettier src/graphql/**/*.ts --w'],
  },
};

export default config;
