import globals from 'globals';
import pluginJs from '@eslint/js';
import daStyle from 'eslint-config-dicodingacademy';
import pluginPrettier from 'eslint-plugin-prettier';
import prettier from 'eslint-config-prettier';

export default [
  daStyle,
  pluginJs.configs.recommended,
  prettier,

  {
    files: ['**/*.js'],
    languageOptions: {
      sourceType: 'commonjs',
      globals: globals.node,
    },
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      'prettier/prettier': ['error', { singleQuote: true }],
      camelcase: [
        'error',
        {
          allow: [
            'cloud_name',
            'api_key',
            'api_secret',
            'favorite_place',
            'user_id',
            'token_id',
            'token_nama',
            'id_user',
            'gen_text',
            'nama_user',
            'id_tempat',
            'nama_tempat',
          ],
        },
      ],
    },
  },
];
