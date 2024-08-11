## 搭建一个react 项目


### 基础配置

初始化项目

```
mkdir react
cd react
npm init -y
```

安装webpack 和webpack-cli

```
npm install -D webpack webpack-cli
```

在项目目录下面创建 src 目录，再添加入口文件index.js

```
console.log("index)
```

插件webpack配置文件 webpack.config.js

```
module.exports = () => {
  return {
    mode: 'development',
    entry: "./src/index.js"
  };
};
```

执行打包命令

```
npx webpack
```

执行完成后在项目目录中生成dist/mian.js，文件无法在浏览器中查看。

接下来让应用跑在浏览器里，需要用到webpack-dev-server和html-webpack-plugin，执行安装命令。

```
npm install -D webpack-dev-server html-webpack-plugin
```

在项目目录下面创建index.html 文件

```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <div id="root"></div>
</body>
</html>
```
添加相关配置

```
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = () => {
  return {
    mode: 'development',
    entry: "./src/index.js",
    devServer: {
      open: true,
      port: 3000,
    },
    plugins: [
      new HtmlWebpackPlugin({ template: 'index.html'  })
    ]
  };
};
```
启动本地服务

```
npx webpack serve
```

执行完成后浏览器自动打开 localhost:3000 

添加命令行脚本

安装设置环境变量插件

```
npm install -D cross-env 
```

在package.json中添加如下脚本

```
  "scripts": {
    "dev": "cross-env NODE_ENV=development webpack serve",
    "build": "cross-env NODE_ENV=production webpack build"
  },
```
相应的更新webpack.config.js配置

```
const HtmlWebpackPlugin = require('html-webpack-plugin');
const isProduction = process.env.NODE_ENV == 'production';
module.exports = () => {
  return {
    mode: isProduction ? 'production' : 'development',
    entry: "./src/index.js",
    devServer: {
      open: true,
      port: 3000,
    },  
    plugins: [
      new HtmlWebpackPlugin({ template: 'index.html' })
    ]
  };
};
```
之后，开发环境运行npm run dev, 正式环境运行npm run build

### javascrpt 处理

添加处理js 相关依赖

```
npm install -D babel-loader @babel/core @babel/preset-env @babel/preset-react @babel/plugin-transform-runtime
```

相关插件说明如下：


* @babel/core：babel的核心代码，是必需的。
* babel-loader： 处理转换js代码。
* @babel/preset-env：转译ES6+代码到一个向下兼容的版本，并可以指定兼容哪些特定环境。
* @babel/preset-react：转译JSX语法。
* @babel/plugin-transform-runtime：帮助Babel减少重复代码，缩小资源体积。

在工程目录下面添加babel 配置文件babel.config.js

```
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        modules: false
      }
    ],
    '@babel/preset-react'
  ],
  plugins: [
    '@babel/plugin-transform-runtime',
  ],
};
```

更新webpack.config.js，添加一条处理.js和.jsx文件的规则，并通过resolve.extensions配置项让后缀为.jsx的文件可以在引用时被Resolver自动识别。

```
module.exports = () => {
  return {
    mode: isProduction ? 'production' : 'development',
    entry: "./src/index.js",
    devServer: {
      open: true,
      port: 3000,
    },  
    plugins: [
      new HtmlWebpackPlugin({ template: 'index.html' })
    ]
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              cacheCompression: false,
            }
          }
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx'],
    },
  };
};
```

安装react 和react-dom

```
npm install react react-dom
```

修改src下面index.jsx

```
import React from "react";
import {createRoot} from "react-dom/client";

   
const App = () => (
  <div>
    <h1>hello</h1>
    <p>react</p>
  </div>
);
   
const root = createRoot(document.getElementById('root'))
root.render(<App />)
```

再次运行npm run dev，浏览器中应该出现了Hello React，代表添加的对于JavaScript的处理已经生效了。

### typescript 处理

添加typescript 相关依赖

```
npm install -D typescript ts-loader @types/react @types/react-dom
```

添加typescript 配置文件tsconfig.json

```
{
  "compilerOptions": {
    "allowSyntheticDefaultImports": true,
    "outDir": "./dist/",
    "noImplicitAny": true,
    "module": "esnext",
    "target": "es5",
    "jsx": "react",
    "allowJs": true,
    "moduleResolution": "node"
  },
  "exclude": [
    "node_modules"
  ],
  "include": [
    "src"
  ]
}
```
添加webpack 相关配置

```
module.exports = () => {
  return {
    mode: isProduction ? 'production' : 'development',
    entry: "./src/index.tsx",
    devServer: {
      open: true,
      port: 3000,
    },  
    plugins: [
      new HtmlWebpackPlugin({ template: 'index.html' })
    ]
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              cacheCompression: false,
            }
          }
        },
        {
            test: /\.tsx?$/,
            use: "ts-loader",
            exclude: /node_modules/,
        },
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx','.tsx'],
    },
  };
};
```

注意，入口文件index.jsx 改成index.tsx 相关内容改成


```
// src/index.tsx
import React from "react";
import {createRoot} from "react-dom/client";
   
type Message = {
  index: number;
  title: string;
  body: string;
};
   
const sampleMessage: Message = {
  index: 1,
  title: 'sample',
  body: 'body content',
}
   
const App = () => (
  <div>
    <h1>{sampleMessage.title}</h1>
    <p>{sampleMessage.body}</p>
  </div>
);
   
const root = createRoot(document.getElementById('root'))
root.render(<App />)
```

### 样式相关处理

添加相关依赖

```
npm install -D less less-loader css-loader style-loader mini-css-extract-plugin
```

相关插件的作用:

* less-loader：将Less语法转换为CSS语法。
* css-loader：解决CSS语法中的外部依赖，如@import、url()等。
* style-loader：将样式通过style标签的形式插入页面。
* mini-css-extract-plugin：将样式提取为CSS文件。

添加相关webpack 配置

```
const HtmlWebpackPlugin = require('html-webpack-plugin');
const isProduction = process.env.NODE_ENV == 'production';
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = () => {
  return {
    mode: isProduction ? 'production' : 'development',
    entry: "./src/index.tsx",
    devServer: {
      open: true,
      port: 3000,
    },  
    plugins: [
      new HtmlWebpackPlugin({ template: 'index.html' }),
      isProduction ? new MiniCssExtractPlugin({
                filename: '[name].css',
                chunkFilename: '[name].chunk.css',
              }) : null
    ].filter(Boolean)
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              cacheCompression: false,
            }
          }
        },
        {
            test: /\.tsx?$/,
            use: "ts-loader",
            exclude: /node_modules/,
        },
        {
                    test: /\.css$/,
                    use: [
                        isProduction ? MiniCssExtractPlugin.loader : "style-loader",
                        "css-loader",
                    ]
                },
                {
                    test: /\.less$/i,
                    use: [
                        isProduction ? MiniCssExtractPlugin.loader : "style-loader",
                        "css-loader",
                        "less-loader",
                    ]
                },
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx','.tsx', 'less', '.css'],
    },
  };
};
```

在生产环境sy MiniCssExtractPlugin将css 单独提取出来。

在项目目录新建styles 目录，再新建index.less 文件

```
@background-color: #eee;
body {
  background-color: @background-color;
}
```

在入口文件index.tsx 中引入

```
 import './styles/index.less';
```

### 静态资源

在Webpack 4以及更早的版本中，加载静态资源还需要在项目中单独安装file-loader和url-loader。然而Webpack 5已经自带了对静态资源如图片字体的处理。

```
// webpack.config.js
module.exports = () => {
  return {
    // ...
    module: {
      rules: [
        // ...
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: 'asset/resource',
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
        },
      ]
    },
  };
};
```

### 多页应用公共代码优化

在src目录下创建about.tsx 

```
import React from "react";
import {createRoot} from "react-dom/client";

const App = () => (
  <h1>about Page</h1>
);
const root = createRoot(document.getElementById('root'))
root.render(<App />)
```

将about.tsx 添加到webpack.config.js 中

```
module.exports = () => {
  return {
    entry: {
      index: './src/index.tsx',
      about: './src/about.tsx',
    },
    // ...
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'index.html',
        chunks: ['index'],
      }),
      new HtmlWebpackPlugin({
        filename: 'detaboutails.html',
        template: 'index.html',
        chunks: ['about'],
      }),
      // ...
    ].filter(Boolean),
  };
};
```

执行npm run build，我们会看到在dist目录下分别生成了index.js和about.js，以及相对应的index.html和about.html。如果观察dist/index.js和dist/about.js的内容，会发现每一个里面都包含react和react-dom的全部代码。也就是说，当用户分别访问这两个页面时，会将react和react-dom加载两遍。接下来更改Webpack配置来优化这一点。

```
module.exports = () => {
  return {
    entry: {
      index: {
        import: './src/index.tsx',
        dependOn: 'shared',
      },
      about: {
        import: './src/about.tsx',
        dependOn: 'shared',
      },
      shared: ['react', 'react-dom'],
    },
    // ...
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'index.html',
        chunks: ['shared', 'index'],
      }),
      new HtmlWebpackPlugin({
        filename: 'about.html',
        template: 'index.html',
        chunks: ['shared', 'about'],
      }),
      // ...
    ].filter(Boolean)
  };
};
```

### 缓存

目前我们在dist目录下生成的资源都是诸如index.js、aboutjs这样的名称，当它的内容发生改变时，由于请求的URL没有改变，浏览器会继续使用之前缓存的版本，导致用户端无法拿到更新后的代码。因此在将静态资源上传到服务器或CDN之前，我们需要为所有文件添加上hash，并使hash能根据文件内容而改变。

修改相关配置

```
// webpack.config.js
module.exports = () => {
return {
    // ...
    output: {
      chunkFilename: isProduction ? '[name].[chunkhash:8].chunk.js' :
      '[name].chunk.js',
      filename: isProduction ? '[name].[contenthash:8].js' : '[name].js',
    },
  };
};
```
css 相关配置修改
```
// webpack.config.js
module.exports = () => {
  return {
    // ...
    plugins: [
      // ...
      isProduction ? new MiniCssExtractPlugin({
        filename: '[name].[contenthash:8].css',
        chunkFilename: '[name].[contenthash:8].chunk.css',
      }) : null
    ].filter(Boolean)
  };
};
```

### 配置优化

打包后清除dist 目录文件

```
 output: {
            chunkFilename: isProduction ? '[name].[chunkhash:8].chunk.js' :
            '[name].chunk.js',
            filename: isProduction ? '[name].[contenthash:8].js' : '[name].js',
            clean: true
},
```
配置路劲别名

```
const path = require("path");
 resolve: {
            alias: {
                "@": path.resolve(__dirname, 'src/')
            },
            extensions: [".js", ".jsx", ".tsx", ".less", ".css"],
        },
```

在style/index.less 背景图地址 url('../images/bg.jpge') 可以改为 url('@/images/bg.jpeg');