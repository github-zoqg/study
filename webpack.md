## 一、webpack

```js
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
module.exports = {
  mode: "",
  // entry可为对象或数组
  // entry: {
  //   main: './path/to/my/entry/file.js',
  // },
  // entry: ['./src/file_1.js', './src/file_2.js']
  entry: "/path/to/my/entry/file.js",
  output: {
    filename: "static/js/[name].[hash:8].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: "管理输出",
      template: "public/index.html",
    }),
    // 单独打包css文件
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[hash:8].css",
    }),
    // 压缩打包后css文件
    new OptimizeCSSAssetsPlugin(),
  ],
  devtool: "inline-source-map",
  devServer: {
    static: "./dist",
    hot: true,
    // 热更新原理：创建本地socket服务，监听更新后发送更新消息
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
    moduleIds: "deterministic",
    runtimeChunk: "single",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  modules: {
    rules: [
      {
        test: /\.js$/i,
        include: path.resolve(__dirname, "src"),
        loader: "babel-loader",
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // publicPath: '../'
            },
          },
          // style-loader与minicssextractplugin冲突只能留存一个
          // "style-loader",
          "css-loader",
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        // type: "asset/resource",
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8 * 1024,
              fallback: {
                loader: "file-loader",
                options: {
                  esModule: false, //file-loader默认使用es6模块解析，如果使用es6的模块解析，html中图片的路径会不对，关闭es6模块解析开启commonjs模块解析
                  name: "static/img/[name].[hash:8].[ext]",
                },
              },
            },
          },
        ],
        //这个属性如果没有设置，则会生成两张图片(如果你的页面只引入了一张图片)
        type: "javascript/auto",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "javascript/auto",
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8 * 1024,
              fallback: {
                loader: "file-loader",
                options: {
                  esModule: false, //file-loader默认使用es6模块解析，如果使用es6的模块解析，html中图片的路径会不对，关闭es6模块解析开启commonjs模块解析
                  name: "static/fonts/[name].[hash:8].[ext]",
                },
              },
            },
          },
        ],
        // generator: {
        //     publicPath: path.resolve(__dirname, 'dist'),
        //     outputPath: 'static/fonts/',
        // },
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 4 * 1024,
              fallback: {
                loader: "file-loader",
                options: {
                  name: "static/media/[name].[hash:8].[ext]",
                },
              },
            },
          },
        ],
      },
    ],
  },
  // loader添加
};
```

## 二、vite

## 三、vue.config.js
