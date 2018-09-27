const i18n = require('i18n');

i18n.configure({
  locales:['en', 'cn', 'fr'],
  directory: __dirname,
  defaultLocale: 'cn'
});

module.exports = i18n;
