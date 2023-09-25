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

1. 工作流程

- 初始化阶段：

  初始化参数：从配置文件、 配置对象、Shell 参数中读取，与默认配置结合得出最终的参数

  创建编译器对象：用上一步得到的参数创建 Compiler 对象

  初始化编译环境：包括注入内置插件、注册各种模块工厂、初始化 RuleSet 集合、加载配置的插件等

  开始编译：执行 compiler 对象的 run 方法

  确定入口：根据配置中的 entry 找出所有的入口文件，调用 compilition.addEntry 将入口文件转换为 dependence 对象

- 构建阶段：

  编译模块(make)：根据 entry 对应的 dependence 创建 module 对象，调用 loader 将模块转译为标准 JS 内容，调用 JS 解释器将内容转换为 AST 对象，从中找出该模块依赖的模块，再 递归 本步骤直到所有入口依赖的文件都经过了本步骤的处理

  完成模块编译：上一步递归处理所有能触达到的模块后，得到了每个模块被翻译后的内容以及它们之间的 依赖关系图

- 生成阶段：

  输出资源(seal)：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会

  写入文件系统(emitAssets)：在确定好输出内容后，根据配置确定输出的路径和文件名，把文件内容写入到文件系统

2. loader

loader 本身就是一个返回值为可执行的 js 代码字符串

```js
// loader.js文件
function loader(source) {
  // source 为文件源码
  return 'console.log("hello world")';
}
module.exports = loader;
```

3. 插件 plugin

plugin 本身为一个构造函数、class 类或者对象中包含有构造函数、class 类

```js
class plugin_test {
  // complier 为编译器对象
  apply(complier) {}
}
module.exports = plugin_test;
```

4. babel

babel-plugin 本身为一个函数，返回值为一个对象，其中的 key 值需参考文档

```js
// 一个插件就是一个函数
export default function ({ types: t }) {
  return {
    // visitor 为固定参数
    visitor: {
      // path 为ast对象
      Identifier(path) {
        let name = path.node.name; // 反转字符串： JavaScript -> tpircSavaJ
        path.node.name = [...name].reverse().join("");
      },
    },
  };
}
```

4. 优化

- 1、首屏优化 2、运行时 3、 构建工具（冷启动、热更新、build）4、CICD 优化

## 二、vite

## 三、vue.config.js

???工程化
???预编译 less

???工作流程
???优化
???手撕 webpack 打包工具

???自动化测试
