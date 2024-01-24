import foo from './foo.js';

// 打包命令： rollup src/components/bundleTest/main.js -o bundle.js -f cjs
export default function () {
  console.log(foo);
}
