# actevo
这是一个自定义框架模板，用来生成多个单文件项目

## 克隆项目
git clone + // git 地址

## 进入项目目录
cd myl-act-demo

## 安装依赖
yarn<br />
or <br />
npm i <br />

## 本地开发 启动项目
yarn start <br />
or <br />
npm start


## 目录结构

本项目已经为你生成了一个完整的开发框架，下面是整个项目的目录结构。

```bash
├── mock                       # 项目mock 模拟数据
├── node_mocules               # 项目依赖
├── packages                   # 公共库
│   └── act-core               # act核心库
│       │── bridge             # bridge
│       │── jumper             # jumper
│       │── request            # request
│       └── utils              # utils
├── public                     # 静态资源
│   │── favicon.ico            # favicon图标
│   └── index.html             # html模板
├── scripts                    # 脚本目录
│   │── create                 # 创建项目
│   │── start                  # 启动本地开发
│   │── lint                   # 代码lint
│   └── build                  # 生产构建
├── src                        # 源代码
│   ├── 项目一                  # 项目一
│   ├── 项目二                  # 项目二
│   ├── ...                    # ...
│   └── 项目N                   # 项目N
│       ├── assets             # 样式、字体、图片等静态资源
│       ├── components         # 全局公用组件
│       ├── router             # 路由
│       ├── store              # 全局 store管理
│       ├── utils              # 全局公用方法
│       ├── views              # views 所有页面
│       ├── App.vue            # 入口页面
│       ├── main.js            # 入口文件 加载组件 初始化等
│       └── project.config.js  # 项目配置   
├── .browserslistrc            # 浏览器兼容
├── .editorconfig              # 编辑器默认的代码格式化规则
├── .eslintrc.js               # eslint配置项
├── .gitignore                 # git忽略提交
├── .prettierrc.js             # 配置prettier
├── babel.config.js            # babel-loader配置
├── build.config.json          # 配置需要构建的项目
├── commitlint.config.js       # 规范commit日志
├── package.json               # package.json
├── README.md                  # README.md
├── vue.config.js              # webpack配置
├── yarn.js                    # yarn离线版本
└── yarn.lock                  # 版本控制
```
