const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const getClientEnvironment = require('./env');

const paths = require('./paths');
const webpackRules = require('./webpackRules.dev');

const publicPath = '/';
const publicUrl = '';
const env = getClientEnvironment(publicUrl);

module.exports = {
    mode:    'development',
    devtool: 'cheap-module-source-map',
    entry:   [
        'whatwg-fetch',
        require.resolve('react-dev-utils/webpackHotDevClient'),
        paths.appIndexJs
    ],

    output: {
        devtoolModuleFilenameTemplate: info => path.resolve(info.absoluteResourcePath).replace(/\\/g, '/'),
        pathinfo:                      true,
        filename:                      'static/js/bundle.js',
        chunkFilename:                 'static/js/[name].chunk.js',
        publicPath
    },

    resolve: {
        modules: ['node_modules', paths.appNodeModules].concat(
            process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
        ),

        extensions: ['.web.js', '.mjs', '.js', '.json', '.web.jsx', '.jsx'],
        alias:      {
            'react-native': 'react-native-web'
        },

        plugins: [
            new ModuleScopePlugin(paths.appSrc, [paths.appPackageJson])
        ]
    },

    module: webpackRules.module,

    plugins: [
        new HtmlWebpackPlugin({
            inject:   true,
            template: paths.appHtml
        }),
        new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
        new webpack.NamedModulesPlugin(),
        new webpack.DefinePlugin(env.stringified),
        new webpack.HotModuleReplacementPlugin(),
        new CaseSensitivePathsPlugin(),
        new WatchMissingNodeModulesPlugin(paths.appNodeModules)
    ],

    node: {
        dgram:         'empty',
        fs:            'empty',
        net:           'empty',
        tls:           'empty',
        child_process: 'empty'
    },

    performance: {
        hints: false
    }
};
