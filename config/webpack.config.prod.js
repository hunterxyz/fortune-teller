const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');

const paths = require('./paths');
const webpackRules = require('./webpackRules.prod');

const getClientEnvironment = require('./env');

const publicPath = paths.servedPath;
const shouldUseSourceMap = process.env.GENERATE_SOURCEMAP !== 'false';
const publicUrl = publicPath.slice(0, -1);
const env = getClientEnvironment(publicUrl);

const cssFilename = 'static/css/[name].[contenthash:8].css';
const cssChunkFilename = 'static/css/[id].[contenthash:8].css';

module.exports = {
    bail:    true,
    mode:    'production',
    devtool: shouldUseSourceMap ? 'source-map' : false,
    entry:   [
        'whatwg-fetch',
        paths.appIndexJs
    ],

    output: {
        path:          paths.appBuild,
        filename:      'static/js/[name].[chunkhash:8].js',
        chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
        publicPath,

        devtoolModuleFilenameTemplate: info => path
            .relative(paths.appSrc, info.absoluteResourcePath)
            .replace(/\\/g, '/')
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
            template: paths.appHtml,
            minify:   {
                removeComments:                true,
                collapseWhitespace:            true,
                removeRedundantAttributes:     true,
                useShortDoctype:               true,
                removeEmptyAttributes:         true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash:              true,
                minifyJS:                      true,
                minifyCSS:                     true,
                minifyURLs:                    true
            }
        }),
        new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
        new webpack.DefinePlugin(env.stringified),
        new MiniCssExtractPlugin({
            filename:      cssFilename,
            chunkFilename: cssChunkFilename
        }),
        new ManifestPlugin({fileName: 'asset-manifest.json'}),
        new SWPrecacheWebpackPlugin({
            dontCacheBustUrlsMatching: /\.\w{8}\./,
            filename:                  'service-worker.js',

            logger(message) {
                if (message.indexOf('Total precache size is') === 0) {
                    // This message occurs for every build and is a bit too noisy.
                    return;
                }
                if (message.indexOf('Skipping static resource') === 0) {
                    // This message obscures real errors so we ignore it.
                    // https://github.com/facebookincubator/create-react-app/issues/2612

                }
            },
            minify:                        true,
            navigateFallback:              `${publicUrl}/index.html`,
            navigateFallbackWhitelist:     [/^(?!\/__).*/],
            staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/]
        })
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
