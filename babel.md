## babel

webpack 只能理解 JavaScript 和 JSON 文件，这是 webpack 开箱可用的自带能力。loader 让 webpack 能够去处理其他类型的文件，并将它们转换为有效 模块，以供应用程序使用，以及被添加到依赖图中。

### babel 的配置

以处理css文件为例

安装处理css 文件相关插件

```
npm install css-loader style-loader -D
```

把loader引入工程中，具体配置如下

```
module.exports = {
    // ...
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
                exclude: /node_modules/,
                include: "/src/"
            }
        ],
    },
}；
```
css-loader的作用仅仅是处理CSS的各种加载语法（@import和url()函数等,用style-loader来将样式字符串包装成style标签插入页面。Webpack在打包时是按照数组从后往前的顺序将资源交给loader处理的，因此要把最后生效的放在前面。

* test可接收一个正则表达式或者一个元素为正则表达式的数组，只有正则匹配上的模块才会使用这条规则。在本例中以/\.css$/来匹配所有以.css结尾的文件。

* use可接收一个数组，数组包含该规则所使用的loader。在只有一个loader时也可以将其简化为字符串"css-loader"。

* exclude 所有被正则匹配到的模块都排除在该规则之外。

* include代表该规则只对正则匹配到的模块生效


当exclude和include同时存在时，exclude的优先级更高

#### enforce

enforce用来指定一个loader的种类，只接收pre或post两种字符串类型的值。Webpack中的loader按照执行顺序可分为pre、inline、normal、post四种类型，上面我们直接定义的loader都属于normal类型，inline形式官方已经不推荐使用，而pre和post则需要使用enforce来指定。

```
module.exports = {
    // ...
    module: {
        rules: [
            {
                test: /\.js$/,
                enforce: 'pre',
                use: 'eslint-loader',
            }
        ],
    },
}；
```
在配置中添加了一个eslint-loader来对源码进行质量检测，其enforce的值为pre，表示它将在所有正常loader之前执行，这样可以保证其检测的代码不是被其他loader更改过的。

### 常用loader

#### babel-loader

babel-loader用于处理ES6+并将其编译为ES5，它使我们能够在工程中使用最新的语言特性（甚至还在提案中），同时不必特别关注这些特性在不同平台的兼容问题。

```
npm install babel-loader @babel/core @babel/preset-env -D
```

* babel-loader：它是使Babel与Webpack协同工作的模块。

* @babel/core：顾名思义，它是Babel编译器的核心模块。

* @babel/preset-env：它是Babel官方推荐的预置器，可根据用户设置的目标环境自动添加所需的插件和补丁来编译ES6+代码

```
module.exports = {
    module: {
        rules: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
            loader: 'babel-loader',
            options: {
                cacheDirectory: true,
                presets: [[
                'env', {
                    modules: false,
                }
                ]],
            },
            },
        }
        ],
    }
}
```
1. 对于babel-loader添加了cacheDirectory配置项，它会启用缓存机制，在重复打包未改变过的模块时防止二次编译，加快打包的速度。cacheDirectory可以接收一个字符串类型的路径来作为缓存路径，这个值也可以为true，此时其缓存目录会指向node_modules/.cache/babel-loader。

2. 由于@babel/preset-env会将ES6 Module转化为CommonJS的形式，这会导致Webpack中的tree-shaking特性失效。将@babel/preset-env的modules配置项设置为false会禁用模块语句的转化，而将ES6Module的语法交给Webpack本身处理。

3. babel-loader支持从.babelrc文件读取Babel配置，因此可以将presets和plugins从Webpack配置文件中提取出来，效果是相同的。

#### ts-loader

ts-loader与babel-loader的性质类似，用于处理ts 模块文件。

```
npm install ts-loader typescript -D
```
配置如下
```
module.exports = {
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
            }
        ],
    }
}
```

TypeScript本身的配置并不在ts-loader中，而是必须放在工程目录下的tsconfig.json中。

```
{
    "compilerOptions": {
        "target": "es5",
        "sourceMap": true,
    },
},
```

#### file-loader

file-loader用于打包文件类型的资源，并返回其publicPath。

```
npm install file-loader -D
```
```
const path = require('path');
module.exports = {
    entry: './app.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|gif)$/,
                use: 'file-loader',
            }
        ],
    },
}；
```
对png、jpg、gif这类图片资源使用file-loader，然后就可以在JS中加载图片了。

注意，Webpack 5也提供了另一种方式（asset/resource）来处理文件类型资源，可以用来替代file-loader。并且这种方式是内置的，使用起来更加便捷：

```
rules: [
    {
        test: /\.(png|jpg|gif)$/,
        type: 'asset/resource'
    }
]
```

#### url-loader 

url-loader的作用与file-loader类似，url-loader允许用户设置一个文件大小的阈值，当大于该阈值时它会与file-loader一样返回publicPath，而小于该阈值时则返回base64形式的编码。

```
npm install url-loader -D
```

```
rules: [
    {
        test: /\.(png|jpg|gif)$/,
        use: {
            loader: 'url-loader',
            options: {
                limit: 10240,
                name: '[name].[ext]',
                publicPath: './assets-path/',
            },
        },
    }
],
```

注意，Webpack 5也提供了内置的解决方案，可以替代url-loader来处理inline类型的资源。

```
rules: [
    {
        test: /\.svg$/,
        type: 'asset/inline'
    }
]
```

#### sass 与scss

Sass本身是对CSS的语法增强，它有两种语法，现在使用更多的是SCSS,sass-loader就是将SCSS语法编译为CSS，因此在使用时通常还要搭配css-loader和style-loader。类似于我们安装babel-loader时还要安装babel-core，loader本身只是编译核心库与Webpack的连接器，因此这里除了sass-loader以外还要安装sass，sass是真正用来编译SCSS的。

```
npm install sass-loader sass -D
```

```
module: {
    rules: [
        {
            test: /\.scss$/,
            use: ['style-loader', 'css-loader', 'sass-loader'],
        }
    ],
},
```

#### less

Less同样是对CSS的一种扩展。与SCSS类似，它也需要安装loader和其本身的编译模块。

```
npm install less-loader less -D
```

```
module: {
    rules: [
        {
            test: /\.less/,
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        sourceMap: true,
                    },
                }, {
                    loader: 'less-loader',
                    options: {
                        sourceMap: true,
                    },
                }
            ],
        }
    ],
},
```

在浏览器的调试工具里查看源码，需要分别为sass-loader和css-loader单独添加source-map的配置项。

#### postcss

PostCSS它只是一个编译插件的容器。它的工作模式是接收样式源代码并交由编译插件处理，最后输出CSS文件。开发者可以自己指定使用哪些插件来实现特定的功能。

```
npm install postcss-loader postcss -D
```

```
module: {
    rules: [
        {
            test: /\.css/,
            use: [
                'style-loader',
                'css-loader',
                'postcss-loader',
            ] ,
        }
    ],
},

```
PostCSS要求必须有一个单独的配置文件。因此我们需要在项目的根目录下创建一个postcss.config.js。

```
// postcss.config.js
module.exports = {};
```

* 自动加前缀

PostCSS一个最广泛的应用场景就是与Autoprefixer结合，为CSS自动添加厂商前缀。Autoprefixer是一个样式工具，可以根据caniuse.com上的数据，自动决定是否要为某一特性添加厂商前缀，并且可以由开发者为其指定支持浏览器的范围。

```
npm install autoprefixer -D
```

在postcss.config.js中添加autoprefixer。

```
const autoprefixer = require('autoprefixer');
module.exports = {
    plugins: [
        autoprefixer({
            grid: true,
            browsers: [
                '> 1%',
                'last 3 versions',
                'android 4.2',
                'ie 9',
            ],
        })
    ],
};
```

* 代码规则 stylelint

stylelint是一个CSS的质量检测工具，就像eslint一样，我们可以为其添加各种规则，来统一项目的代码风格，确保代码质量。

```
npm install stylelint -D
```

在postcss.config.js中添加相应配置。

```
const stylelint = require('stylelint');
module.exports = {
    plugins: [
        stylelint({
            config: {
                rules: {
                    'declaration-no-important': true,
                },
            },
        })
    ],
};
```

这里我们添加了declaration-no-important这样一条规则，即当我们的代码中出现“!important”时就会给出警告。比如下面的代码：

```
#app {
    background: red!important;
}
```



