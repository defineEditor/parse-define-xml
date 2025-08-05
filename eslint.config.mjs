import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import airbnb from 'eslint-config-airbnb';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  airbnb,
  prettier,
);