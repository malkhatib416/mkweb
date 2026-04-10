import { defineConfig } from 'eslint/config';
import next from 'eslint-config-next';

export default defineConfig([
  {
    extends: [...next],

    rules: {
      'no-unused-vars': 'error',
      'react/no-unescaped-entities': 0,
    },
  },
]);
