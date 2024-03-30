module.exports = {
  parser: '@typescript-eslint/parser',

  root: true,

  settings: {
    react: {
      version: 'detect',
    },
  },

  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'next',
    'prettier',
    'eslint-config-prettier',
    'eslint-config-next',
  ],

  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
    ecmaFeatures: {
      impliedStrict: true,
      jsx: true,
      experimentalObjectRestSpread: true,
    },
  },

  env: {
    browser: true,
    node: true,
    es6: true,
    mocha: true,
  },

  plugins: ['react', '@typescript-eslint', 'prettier'],

  globals: {
    System: true,
    __DEV__: true,
  },

  rules: {
    // prettier
    'prettier/prettier': 'warn',
    'react-hooks/exhaustive-deps': 'off',
    // eslint
    'no-console': 'error',
    'no-debugger': 'warn',
    'no-var': 'error',
    'no-unused-vars': 'off',
    'block-scoped-var': 'error',
    'no-param-reassign': 'error',
    'space-before-function-paren': ['off', 'never'],
    'key-spacing': [
      'warn',
      {
        mode: 'minimum',
        beforeColon: false,
        afterColon: true,
      },
    ],
    'arrow-spacing': ['warn'],
    'spaced-comment': ['warn', 'always', { markers: ['/'] }],
    'space-in-parens': ['warn', 'never'],
    'object-curly-spacing': ['warn', 'always'],
    'no-trailing-spaces': 'warn',
    'object-shorthand': ['warn', 'methods'],
    'prefer-template': 'warn',
    'no-useless-concat': 'warn',
    'prefer-const': 'error',
    yoda: ['warn', 'never', { exceptRange: true }],
    quotes: ['warn', 'single', { avoidEscape: true }],
    'max-len': [
      'warn',
      110,
      {
        ignoreComments: true,
        ignoreUrls: true,
        ignorePattern: 'd="([\\s\\S]*?)"|className="([\\s\\S]*?)"',
      },
    ],
    'no-constant-condition': [
      'warn',
      {
        checkLoops: false,
      },
    ],
    'brace-style': ['warn'],
    eqeqeq: ['warn', 'always'],

    // react
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/jsx-no-bind': 'off',
    'react/jsx-boolean-value': 'warn',
    'react/jsx-closing-bracket-location': 'warn',
    'react/jsx-tag-spacing': 'warn',
    'jsx-quotes': ['warn', 'prefer-double'],
    'react/jsx-wrap-multilines': 'warn',
    'react/jsx-handler-names': [
      'off',
      {
        eventHandlerPropPrefix: '',
      },
    ],
    'react/jsx-key': 'warn',
    'react/jsx-no-comment-textnodes': 'warn',
    'react/jsx-pascal-case': ['warn', { allowAllCaps: true }],
    'react/no-did-mount-set-state': 'warn',
    'react/no-did-update-set-state': 'warn',
    'react/sort-comp': 'warn',
    'react/prefer-es6-class': 'warn',
    'react/style-prop-object': 'warn',
    'react/no-unescaped-entities': 'warn',
    // 'react-hooks/rules-of-hooks': 'error',
    // 'react-hooks/exhaustive-deps': 'warn',

    // nextjs
    '@next/next/no-img-element': 'off',

    // @typescript-eslint
    '@typescript-eslint/array-type': ['warn'],
    '@typescript-eslint/no-explicit-any': ['off'],
    '@typescript-eslint/no-unused-vars': ['warn', { vars: 'all', args: 'none' }],
    '@typescript-eslint/no-inferrable-types': ['off'],
    '@typescript-eslint/no-empty-function': ['off'],
    semi: ['error', 'always'],
    'default-case': 'error',
    'no-multi-spaces': 'error',
  },
};
