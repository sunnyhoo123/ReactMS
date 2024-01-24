// rollup.config.js
// import pkg from '../lib/package.json' assert { type: 'json' };
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
// import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import json from 'rollup-plugin-json';
import babel from '@rollup/plugin-babel';

// const packageJson = require('./package.json');

const isProd = process.env.NODE_ENV === 'production';

const babelOptions = {
  // presets: ['@babel/preset-env'],
  presets: [['@babel/preset-env', { useBuiltIns: 'usage', corejs: 3 }], '@babel/preset-react'],
  extensions: ['.js', '.jsx', '.ts', '.tsx', '.less'],
  exclude: '**/node_modules/**',
};

const processLess = function (context, payload) {
  return new Promise((resolve, reject) => {
    less.render(
      {
        file: context,
      },
      (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      }
    );
    less.render(context, {}).then(
      (output) => {
        if (output && output.css) {
          resolve(output.css);
        } else {
          reject({});
        }
      },
      (err) => {
        reject(err);
      }
    );
  });
};

// "main": "dist/index.js",
// "module": "src/index.js",
export default {
  input: '../src/components/index.js',
  output: [
    // {
    //   file: packageJson.main,
    //   format: 'cjs',
    //   name: 'ms-libs',
    // },
    // {
    //   file: 'lib/index.js',
    //   format: 'umd',
    //   name: 'ms-libs',
    // },
    {
      file: '../lib/dist/bundle.js',
      format: 'es',
      name: 'ms-libs',
    },
    // {
    //   file: packageJson.module,
    //   format: 'es',
    // },
  ],
  plugins: [
    // peerDepsExternal({ includeDependencies: !isProd }),
    resolve(),
    commonjs({ sourceMap: !isProd }),
    // typescript({ useTsconfigDeclarationDir: true }),
    // postcss({
    //   extract: true,
    //   process: processLess,
    // }),
    // babel(),
    postcss(),
    babel(babelOptions),
    json(),

    // resolve.nodeResolve({
    //   extensions: ['.js', '.jsx', '.json', '.node', '.mjs'],
    // }),
  ],
  // packageInfo: 'lib/package.json',
  // external: Object.keys(pkg.dependencies),
  // external: ['react'], // react为外部引入,不需要打包进去
};
