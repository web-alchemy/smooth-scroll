import fs from 'fs';
import path from 'path';
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonJS from 'rollup-plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import changeCase from 'change-case';
import _ from 'lodash';
import pkg from './package.json';

const input = 'src/smooth-scroll';

const babelConfig = JSON.parse(fs.readFileSync(path.resolve(__dirname, '.babelrc')));

const configs = {};

configs.es = {
  input,
  output: {
    file: pkg.module,
    format: 'es'
  },
  plugins: [
    resolve()
  ]
};

configs['es-min'] = _.merge({}, configs.es, {
  output: {
    file: pkg.module.replace('.js', '.min.js')
  },
  plugins: [
    terser()
  ]
});

configs.umd = {
  input,
  output: {
    file: pkg.main,
    format: 'umd',
    name: changeCase.pascalCase(pkg.name.split('/')[1])
  },
  plugins: [
    resolve(),
    commonJS({
      include: 'node_modules/**'
    }),
    babel({
      babelrc: false,
      ...babelConfig
    })
  ]
};

configs['umd-min'] = _.merge({}, configs.umd, {
  output: {
    file: pkg.main.replace('.js', '.min.js'),
  },
  plugins: [
    terser()
  ]
});

export default Object.values(configs);