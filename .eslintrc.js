module.exports = {
  extends: [require.resolve('@umijs/lint/dist/config/eslint')],
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
    REACT_APP_ENV: true,
  },
  rules: {
    'no-console': 0, // 可以使用console.log
    'no-var': 2, // 禁用var，用let和const代替
    'react/no-array-index-key': 0, // 可以使用index作为key, 但是只能是展示列表的时候使用
    semi: [2, 'always'], // 语句强制分号结
    '@typescript-eslint/no-unused-expressions': 0,
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/no-empty-interface': 0,
  },
};
