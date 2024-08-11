## �һ��react ��Ŀ


### ��������

��ʼ����Ŀ

```
mkdir react
cd react
npm init -y
```

��װwebpack ��webpack-cli

```
npm install -D webpack webpack-cli
```

����ĿĿ¼���洴�� src Ŀ¼�����������ļ�index.js

```
console.log("index)
```

���webpack�����ļ� webpack.config.js

```
module.exports = () => {
  return {
    mode: 'development',
    entry: "./src/index.js"
  };
};
```

ִ�д������

```
npx webpack
```

ִ����ɺ�����ĿĿ¼������dist/mian.js���ļ��޷���������в鿴��

��������Ӧ��������������Ҫ�õ�webpack-dev-server��html-webpack-plugin��ִ�а�װ���

```
npm install -D webpack-dev-server html-webpack-plugin
```

����ĿĿ¼���洴��index.html �ļ�

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
����������

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
�������ط���

```
npx webpack serve
```

ִ����ɺ�������Զ��� localhost:3000 

��������нű�

��װ���û����������

```
npm install -D cross-env 
```

��package.json��������½ű�

```
  "scripts": {
    "dev": "cross-env NODE_ENV=development webpack serve",
    "build": "cross-env NODE_ENV=production webpack build"
  },
```
��Ӧ�ĸ���webpack.config.js����

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
֮�󣬿�����������npm run dev, ��ʽ��������npm run build

### javascrpt ����

��Ӵ���js �������

```
npm install -D babel-loader @babel/core @babel/preset-env @babel/preset-react @babel/plugin-transform-runtime
```

��ز��˵�����£�


* @babel/core��babel�ĺ��Ĵ��룬�Ǳ���ġ�
* babel-loader�� ����ת��js���롣
* @babel/preset-env��ת��ES6+���뵽һ�����¼��ݵİ汾��������ָ��������Щ�ض�������
* @babel/preset-react��ת��JSX�﷨��
* @babel/plugin-transform-runtime������Babel�����ظ����룬��С��Դ�����

�ڹ���Ŀ¼�������babel �����ļ�babel.config.js

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

����webpack.config.js�����һ������.js��.jsx�ļ��Ĺ��򣬲�ͨ��resolve.extensions�������ú�׺Ϊ.jsx���ļ�����������ʱ��Resolver�Զ�ʶ��

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

��װreact ��react-dom

```
npm install react react-dom
```

�޸�src����index.jsx

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

�ٴ�����npm run dev���������Ӧ�ó�����Hello React��������ӵĶ���JavaScript�Ĵ����Ѿ���Ч�ˡ�

### typescript ����

���typescript �������

```
npm install -D typescript ts-loader @types/react @types/react-dom
```

���typescript �����ļ�tsconfig.json

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
���webpack �������

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

ע�⣬����ļ�index.jsx �ĳ�index.tsx ������ݸĳ�


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

### ��ʽ��ش���

����������

```
npm install -D less less-loader css-loader style-loader mini-css-extract-plugin
```

��ز��������:

* less-loader����Less�﷨ת��ΪCSS�﷨��
* css-loader�����CSS�﷨�е��ⲿ��������@import��url()�ȡ�
* style-loader������ʽͨ��style��ǩ����ʽ����ҳ�档
* mini-css-extract-plugin������ʽ��ȡΪCSS�ļ���

������webpack ����

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

����������sy MiniCssExtractPlugin��css ������ȡ������

����ĿĿ¼�½�styles Ŀ¼�����½�index.less �ļ�

```
@background-color: #eee;
body {
  background-color: @background-color;
}
```

������ļ�index.tsx ������

```
 import './styles/index.less';
```

### ��̬��Դ

��Webpack 4�Լ�����İ汾�У����ؾ�̬��Դ����Ҫ����Ŀ�е�����װfile-loader��url-loader��Ȼ��Webpack 5�Ѿ��Դ��˶Ծ�̬��Դ��ͼƬ����Ĵ���

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

### ��ҳӦ�ù��������Ż�

��srcĿ¼�´���about.tsx 

```
import React from "react";
import {createRoot} from "react-dom/client";

const App = () => (
  <h1>about Page</h1>
);
const root = createRoot(document.getElementById('root'))
root.render(<App />)
```

��about.tsx ��ӵ�webpack.config.js ��

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

ִ��npm run build�����ǻῴ����distĿ¼�·ֱ�������index.js��about.js���Լ����Ӧ��index.html��about.html������۲�dist/index.js��dist/about.js�����ݣ��ᷢ��ÿһ�����涼����react��react-dom��ȫ�����롣Ҳ����˵�����û��ֱ����������ҳ��ʱ���Ὣreact��react-dom�������顣����������Webpack�������Ż���һ�㡣

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

### ����

Ŀǰ������distĿ¼�����ɵ���Դ��������index.js��aboutjs���������ƣ����������ݷ����ı�ʱ�����������URLû�иı䣬����������ʹ��֮ǰ����İ汾�������û����޷��õ����º�Ĵ��롣����ڽ���̬��Դ�ϴ�����������CDN֮ǰ��������ҪΪ�����ļ������hash����ʹhash�ܸ����ļ����ݶ��ı䡣

�޸��������

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
css ��������޸�
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

### �����Ż�

��������dist Ŀ¼�ļ�

```
 output: {
            chunkFilename: isProduction ? '[name].[chunkhash:8].chunk.js' :
            '[name].chunk.js',
            filename: isProduction ? '[name].[contenthash:8].js' : '[name].js',
            clean: true
},
```
����·������

```
const path = require("path");
 resolve: {
            alias: {
                "@": path.resolve(__dirname, 'src/')
            },
            extensions: [".js", ".jsx", ".tsx", ".less", ".css"],
        },
```

��style/index.less ����ͼ��ַ url('../images/bg.jpge') ���Ը�Ϊ url('@/images/bg.jpeg');