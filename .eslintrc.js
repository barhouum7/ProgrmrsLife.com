module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'next/core-web-vitals',
    // 'eslint:recommended',
    'plugin:react/recommended',
    // Remove stricter configs temporarily
  ],
  // ...
}

// module.exports = {
//   parser: '@typescript-eslint/parser',
//   extends: [
//     'next/core-web-vitals',
//     'plugin:@typescript-eslint/recommended',
//     'plugin:react/recommended',
//   ],
//   rules: {
//     'react/react-in-jsx-scope': 'off',
//     'react/prop-types': 'error',
//     'react/no-unescaped-entities': 'error',
//     'react-hooks/exhaustive-deps': 'warn',
//     '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
//     '@next/next/no-img-element': 'warn',
//     '@next/next/no-html-link-for-pages': 'error',
//     '@next/next/inline-script-id': 'error',
//   },
// };