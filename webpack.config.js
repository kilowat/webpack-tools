const path = require("path");
const fs = require("fs");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const isDev = process.env.NODE_ENV === 'development';
const SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');
const SvgSpriteHtmlWebpackPlugin = require('svg-sprite-html-webpack');
const SpritesmithPlugin = require('webpack-spritesmith');
const CompressionPlugin = require('compression-webpack-plugin');
const autoprefixer = require("autoprefixer");
const cssNano = require("cssnano")({
    preset: [
        "default",
        {
            discardComments: {
                removeAll: true
            }
        }
    ]
});

/*sprites path settings*/
const pngSpriteFile = 'dist/sprites/sprite.png';
const pngCssSpritePath = '/sprites/sprite.png?hash=[hash]';
const svgPath = '/sprites/spritemap.svg';
/*****************************************/

function generateHtmlPlugins(templateDir) {
    const templateFiles = fs.readdirSync(path.resolve(__dirname, templateDir));
    return templateFiles.map(item => {
        const parts = item.split(".");
        const name = parts[0];
        const extension = parts[1];
        return new HtmlWebpackPlugin({
            filename: `${name}.html`,
            template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
            inject: false,
            svgPath: svgPath
        });
    });
}


const htmlPlugins = generateHtmlPlugins("./src/html/views");

const config = {
    entry: ["./src/js/index.js", "./src/scss/style.scss"],
    output: {
        filename: "./js/bundle.js"
    },
    devtool: isDev ? "source-map" : false,
    mode: "production",
    optimization: {
        minimize: !isDev,
        minimizer: [
            new TerserPlugin({
                sourceMap: isDev,
                extractComments: true
            })
        ]
    },
    resolve: {
        extensions: ['.js', '.vue'],
        modules: ["node_modules", "spritesmith-generated"],
        alias: {
            'vue$': isDev ? 'vue/dist/vue.js' : 'vue/dist/vue.min.js',
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                use: [
                    {loader: 'vue-loader'}
                ],
                include: path.resolve(__dirname, "src/vue-components")
            },
            {
                test: /\.css$/,
                use: [
                    isDev ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
                    {loader: 'css-loader', options: {sourceMap: isDev}},
                    {
                        loader: "postcss-loader",
                        options: {
                            ident: "postcss",
                            sourceMap: isDev,
                            plugins: () => {
                                let p = [
                                    autoprefixer(),
                                ];
                                if(!isDev) {
                                    p.push(cssNano);
                                }
                                return p;
                            }
                        }
                    },
                ]
            },
            {
                test: /\.(sass|scss)$/,
                include: path.resolve(__dirname, "src/scss"),
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            hmr: isDev,
                            options: {sourceMap: isDev},
                        }
                    },
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: isDev,
                            url: false
                        }
                    },
                    {
                        loader: "postcss-loader",
                        options: {
                            ident: "postcss",
                            sourceMap: isDev,
                            plugins: () => {
                                let p = [
                                    autoprefixer(),
                                ];
                                if(!isDev) {
                                    p.push(cssNano);
                                }
                                return p;
                            }
                        }
                    },
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: isDev,
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                include: path.resolve(__dirname, "src/html/includes"),
                use: ["raw-loader"]
            },
            {
                test: /\.svg$/,
                include: path.resolve(__dirname, "src/svgicons/"),
                use: SvgSpriteHtmlWebpackPlugin.getLoader(),
            },
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, "./dist/"),
        host: 'localhost',
        useLocalIp: false,
        compress: true,
        port: 9000
    },
    plugins: [
        new VueLoaderPlugin(),
        new SVGSpritemapPlugin('./src/svgicons/**/*.svg', {
            output: {
                filename: svgPath,
            }
        }),
        new MiniCssExtractPlugin({
            filename: "./css/style.bundle.css",
            sourceMap:isDev,
        }),
        new SpritesmithPlugin({
            src: {
                cwd: path.resolve(__dirname, 'src/pngicons'),
                glob: '*.png'
            },
            target: {
                image: path.resolve(__dirname, pngSpriteFile),
                css: path.resolve(__dirname, 'src/scss/_sprite-generated.scss')
            },
            apiOptions: {
                cssImageRef: pngCssSpritePath,
                generateSpriteName: fullPathToSourceFile => {
                    const {name} = path.parse(fullPathToSourceFile);
                    return `sprite-${name}`;
                }
            },
            retina: '@2x'
        }),
        new CopyWebpackPlugin([
            {
                from: "./src/fonts",
                to: "./fonts"
            },
            {
                from: "./src/favicon",
                to: "./favicon"
            },
            {
                from: "./src/img",
                to: "./img"
            },
            {
                from: "./src/uploads",
                to: "./uploads"
            }
        ]),
    ].concat(htmlPlugins)
};

if (!isDev) {
    config.plugins.push(
        new CompressionPlugin({
            filename: '[path].gz[query]',
            algorithm: 'gzip',
            test: new RegExp('\\.(js|css)$'),
            threshold: 10240,
            minRatio: 1
        }));
}

module.exports = (env, argv) => {
    if (argv.mode === "production") {

    }
    return config;
};
