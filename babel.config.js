module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                useBuiltIns: 'entry',
                corejs:      '3.0.0'
            }
        ]
    ],

    babelrcRoots: [
        '.',
        './node_modules/rf-*'
    ],

    plugins: [
        '@babel/plugin-transform-runtime',
        '@babel/plugin-transform-modules-commonjs',
        '@babel/plugin-proposal-object-rest-spread',
        '@babel/plugin-transform-react-jsx'
    ]
};
