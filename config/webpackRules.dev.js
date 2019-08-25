const path = require('path');

module.exports = {
    module: {
        strictExportPresence: true,
        rules:                [
            {
                test: /\.scss$/,
                use:  [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                exclude: [/\.(js|jsx|mjs)$/, /\.html$/, /\.json$/, /\.css$/, /\.scss$/],
                use:     [
                    {
                        loader:  'url-loader',
                        options: {
                            limit:    5000,
                            fallback: 'file-loader'
                        }
                    }
                ]
            },
            {
                test: /\.(js|jsx|mjs)$/,

                exclude: function exclude(modulePath) {
                    let nodeModules = modulePath.includes('node_modules');
                    let internalModules = modulePath.includes('node_modules/rf-');

                    return nodeModules && !internalModules;
                },

                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.(js|jsx|mjs)$/,

                include: [
                    path.resolve('node_modules/ansi-styles'),
                    path.resolve('node_modules/chalk'),
                    path.resolve('node_modules/react-dev-utils')
                ],

                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.css$/,
                use:  [
                    'style-loader',
                    {loader: 'css-loader', options: {importLoaders: 1}},
                    {
                        loader:  'postcss-loader',
                        options: {
                            ident:   'postcss',
                            plugins: [
                                require('postcss-flexbugs-fixes'),
                                require('autoprefixer')({flexbox: 'no-2009'})
                            ]
                        }
                    }
                ]
            }
        ]
    }
};
