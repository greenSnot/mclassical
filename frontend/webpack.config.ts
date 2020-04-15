import HtmlWebpackPlugin from 'html-webpack-plugin';
import webpack from 'webpack';
import path from 'path';
import config from './config';
import CopyWebpackPlugin from 'copy-webpack-plugin';

const dist = path.resolve(__dirname, 'dist');
module.exports = {
  entry: {
    index: path.resolve(__dirname, 'src/index.tsx'),
  },
  output: {
    path: dist,
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.style$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'typings-for-css-modules-loader',
            query: {
              modules: true,
              namedExport: true,
              localIdentName: '[name]_[local]_[hash:base64:5]'
            }
          },
          {
            loader: 'less-loader',
            options: {
              javascriptEnabled: true
            },
          }
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.tsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader'
        }
      },
    ],
  },
  devtool: 'inline-source-map',
  devServer: {
    port: config.frontend_port,
  },
  resolve: {
    extensions: [ '.ts', '.tsx', '.js' ]
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: path.join(__dirname, 'cdn'), to: '' }
    ]),
    new HtmlWebpackPlugin({
      filename: path.join(dist, `index.html`),
      chunks: ['index'],
      template: path.join(__dirname, 'template/index.html'),
      inject: false,
      templateParameters: {
        cdn_prefix: config.cdn_prefix,
        i18n: config.i18n,
      }
    }),
  ],
};
