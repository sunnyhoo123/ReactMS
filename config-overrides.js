/* config-overrides.js */
const path = require('path');
const paths = require('react-scripts/config/paths');
const {
  override,
  addDecoratorsLegacy,
  disableEsLint,
  addBundleVisualizer,
  // addWebpackAlias,
  adjustWorkbox,
} = require('customize-cra');

module.exports = override(
  // enable legacy decorators babel plugin
  // addDecoratorsLegacy(),

  // disable eslint in webpack
  // disableEsLint(),

  // add webpack bundle visualizer if BUNDLE_VISUALIZE flag is enabled
  // process.env.BUNDLE_VISUALIZE === 1 && addBundleVisualizer(),

  // add an alias for "ag-grid-react" imports
  // addWebpackAlias({
  //   ["ag-grid-react$"]: path.resolve(__dirname, "src/shared/agGridWrapper.js"),
  // }),

  // adjust the underlying workbox
  // adjustWorkbox((wb) =>
  //   Object.assign(wb, {
  //     skipWaiting: true,
  //     exclude: (wb.exclude || []).concat('index.html'),
  //   })
  // ),
  // 打包配置
  (config) => {
    // !!发现public下边的favicon.ico无法打包到dist目录下，为解决，配置favicon公共文件打包目录
    paths.appBuild = path.join(path.dirname(paths.appBuild), 'dist');

    config.output.path = path.join(path.dirname(config.output.path), 'dist');
    // 关闭sourceMap
    // config.devtool = false;
    // 配置打包后的文件位置
    // config.output.path = path.join(__dirname, 'dist');

    // You can also customize other build settings here if needed

    return config;
  }
);
