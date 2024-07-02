module.exports = {
  tabWidth: 2, //指定每个缩进级别的空格数
  printWidth: 100, //超过多少换行
  semi: false, //行位是否使用分号
  vueIndentScriptAndStyle: true, // vue文件的script标签和Style标签下的内容需要缩进
  singleQuote: true, // 强制使用单引号
  trailingComma: 'all', // 尾部逗号设置, 强制最后一行也要有斗号
  proseWrap: 'never', // 文章换行,默认情况下会对你的markdown文件换行进行format会控制在printwidth以内
  htmlWhitespaceSensitivity: 'strict', // html中的空格敏感性
  endOfLine: 'lf', // 行尾换行符,默认是lf
  plugins: ['prettier-plugin-packagejson'],
  overrides: [
    {
      files: '.*rc',
      options: {
        parser: 'json',
      },
    },
  ],
};
