/*
  the next nx plugin uses it
  https://github.com/nrwl/nx/blob/98ed4b1dc7579680e9d4bf63274375d2d25216dc/packages/next/plugins/with-nx.ts#L2

  source code
  https://github.com/nrwl/nx/blob/98ed4b1dc7579680e9d4bf63274375d2d25216dc/packages/workspace/src/utils/app-root.ts
*/
const { appRootPath } = require('@nrwl/workspace/src/utils/app-root');

const { definitions, utils } = require('./helpers');

module.exports = (config) => {
  utils.addResolvePlugin(config, definitions.tsPaths);
  utils.addModuleRule(config, definitions.stylesWithPostcssRule);
  utils.addModuleRule(config, definitions.webfontsStorybookRule);

  utils.addResolveAlias(config, {
    // redefine the alias because the nextjs internally adds `./` to the CSS url() path
    [`./@nx-nextjs/shared/assets/fonts`]: `${appRootPath}/libs/shared/assets/fonts`,
  });

  return config;
};
