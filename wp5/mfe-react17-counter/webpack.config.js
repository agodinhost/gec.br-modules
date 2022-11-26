/**
 * webpack.config.js
 * 
 * package.json lifecicle scripts:
 * https://docs.npmjs.com/cli/v9/using-npm/scripts
 * 
 * PRIORITY: args, env vars and last env file.
 * 
 * WARNING, the production version REQUIRES some placeholder replacement script!
 * 
 * WARNING, by default webpack creates a bundle that is meant to be run in the
 * browser. Browsers don't have process, so you can't access command line arguments. 
 * 
 * WARNING, the following loaders were deprecated in webpack 5 and now they
 * are pre bundled so you don't need to import then into the package.json:
 * - raw-loader - to import a file as a string
 * - url-loader - to inline a file into the bundle as a data URI
 * - file-loader - to emit a file into the output directory
 * 
 * WARNING, do not use the MiniCssExtractPlugin together with the style-loader,
 * using both together will break the build.
 * 
 * TODO: exemplo mostrando process.env.npm_package_name e process.env.npm_package_version
 * 
 * DONE: suporte para expansão de variáveis, configuração por meio argumentos
 *        definidos na linha de comando (--env), variáveis de ambiente e
 *        arquivos .env.
 * 
 * DONE: merge de args para sobre-escrever vars no build.
 * 
 * DONE: levantar erro se alguma das variáveis de ambientes definidas
 *        no schema não for iniciada, isso ajudará a identificar problemas
 *        de configuração na esteira.
 * 
 * TODO: trace, listar variáveis e seus respectivos valores.
 * TODO: WARNING se a variável for definida mais de uma vez!
 *
 * DONE: quando não definidos, os defauts para 'schema' e 'defaults' devem seguir
 *        o path do arquivo de env principal.
 * 
 * DONE: construtor, load e options com mais de um arquivo .env, resolver em ordem.
 * DONE: suporte a construtor vazio, método alternativo para load apartado da construção
 *        da classe.
 * TODO: validação do dotenv no método apply, separado do load.
 *        essa validação só deve ocorrer DEPOIS da expansão das variáveis.
 * 
 * TODO: webpack5-bundle
 * TODO: webpack5-utils
 * TODO: webpack5-dotenv-plugin
 * TODO: DOTENV_ config no .env
 */
'use strict';

const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const PATH = require('path');
const ROOT = PATH.resolve(__dirname, './');
const DEPS = require('./package.json').dependencies;  /* USES the json-loader */

module.exports = (env, argv) => {

  const xDotenvPlugin = new (require('@gec.js/webpack-dotenvx-plugin')) (
    '../mfes-registry/.env',
    './.env',
    argv
  );
  //xDotenvPlugin.load();
  const ENV = xDotenvPlugin.config;

  console.log('# env = \'', JSON.stringify(env), '\'\n');
  console.log('# argv = \'', JSON.stringify(argv), '\'\n');

  console.log('# ENV.USERNAME = \'', ENV.USERNAME, '\'\n');
  console.log('# ENV.SYSTEM_FRONTEND_PORT = \'', ENV.SYSTEM_FRONTEND_PORT, '\'\n');
  console.log('# ENV.SYSTEM_FRONTEND_URL = \'', ENV.SYSTEM_FRONTEND_URL, '\'\n');
  
  console.log('# process.env.USERNAME = \'', process.env.USERNAME, '\'\n');
  console.log('# process.env.SYSTEM_FRONTEND_PORT = \'', process.env.SYSTEM_FRONTEND_PORT, '\'\n');
  console.log('# process.env.SYSTEM_FRONTEND_URL = \'', process.env.SYSTEM_FRONTEND_URL, '\'\n');
  
  const mode = argv.mode || 'development';
  console.log('# argv.mode = \'', mode, '\'\n');
  console.log('# env.mode = \'', env.mode, '\'\n');
  console.log('# ENV.mode = \'', ENV.mode, '\'\n');

  console.log('# env.system_test = \'', env.system_test, '\'\n');

  const DEVMODE = ( env.SYSTEM_MODE === 'development' );

  return {
    mode: env.SYSTEM_MODE,
    context: ROOT,                                      /* TODO: estudar a opção context */
    entry: './src/index.js',
    output: {
      uniqueName: 'mfe-react17-counter',
      publicPath: env.SYSTEM_FRONTEND_URL,              /* OR auto */
      filename: DEVMODE? '[name].js': '[name]-[contenthash].js',
      clean: true
    },
    cache: true,
    devtool: 'inline-source-map',
  
    devServer: {
      port: env.SYSTEM_FRONTEND_PORT,
      compress: false,
      historyApiFallback: true,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
        'Access-Control-Allow-Credentials': 'true'
      }
    },

    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.json']
    },
    module: {
      rules: [
        {
          test: /\.m?js/,
          type: 'javascript/auto',
          resolve: {
            fullySpecified: false
          }
        },
        {
          test: /\.(ts|tsx|js|jsx)$/i,
          exclude: '/node_modules/',
          use: [{
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: ['@babel/react', '@babel/env']
            }
          }]
        },
        {
          test: /\.css$/i,
          exclude: '/node_modules/',
          use: [MiniCssExtractPlugin.loader, 'css-loader']
        },
        {
          test: /\.(s[ac]ss)$/i,
          exclude: '/node_modules/',
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(ico|jp[e]g|png|bmp|tif|svg)$/i,
          exclude: '/node_modules/',
          type: 'asset/resource',
          generator: {
            filename: '[name][ext]'
          }
        },
        {
          test: /\.json$/i,
          exclude: '/node_modules/',
          include: PATH.resolve(__dirname, './'),
          use: ['json-loader']
        }
      ]
    },

    plugins: [
      new ModuleFederationPlugin({
        name: 'counter',
        filename: 'remoteEntry.js',
        remotes: {},
        exposes: {
          './Counter': './src/components/Counter'
        },
        shared: {
          ...DEPS,
          react: {
            singleton: true,
            requiredVersion: DEPS.react
          },
          'react-dom': {
            singleton: true,
            requiredVersion: DEPS['react-dom']
          }
        },
        // library: {
        //   type: 'var',
        //   name: 'react'
        // }      
      }),

      new HtmlWebPackPlugin({
        template: 'src/index.html',
        favicon: 'src/react-logo.svg'
      }),

      new MiniCssExtractPlugin({
        filename: DEVMODE ? "[name].css" : "[name].[contenthash].css"
      }),

      xDotenvPlugin
    ],

    optimization: {
      chunkIds: DEVMODE? 'named': 'deterministic',
      moduleIds: DEVMODE? 'named': 'deterministic',     /* retain the hash of vendor chunks */
      mangleExports: DEVMODE? false: 'deterministic',
      mangleWasmImports: false,

      concatenateModules: true,
      emitOnErrors: true,
      flagIncludedChunks: true,
      mergeDuplicateChunks: true,
      minimize: !DEVMODE,

      providedExports: true,
      usedExports: true,

      innerGraph: true,
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          modules: {
            name: 'modules',
            chunks: 'all',
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true          
          },
          styles: {
            name: 'style',
            chunks: 'all',
            type: 'css/mini-extract',
            enforce: true
          }            
        }
      }
    }
  }
};

/**
 * force require.
 * make sure that the modulePath has a loader defined.
 */
function requireF(modulePath){
  try {
   return require(modulePath);
  } catch (e) {
   console.log(`requireF(): The file '${modulePath}'.js could not be loaded, error code '${e.code}'.`);
   return false;
  }
}
