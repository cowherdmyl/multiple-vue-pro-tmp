const pkg = require('./package')
const path = require('path')
const fs = require('fs')
const cors = require('cors')
const dayJs = require('dayjs')
const Mock = require('mockjs')
const program = require('commander')
const bodyParser = require('body-parser')
// const username = require('username')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const logger = require('./scripts/utils/logger')

const { getClientIp, getAuthorizeParams, requireJSOrJSONFile } = require('./scripts/utils')
program
  .version('0.1.0')
  .option('--appName <appName>', 'Apps to be built')
  .parse(process.argv)

// 项目名字：和src下文件夹名字对应
const appName = program.appName
// 项目根目录
const appRoot = path.resolve(__dirname, 'src', appName)
// 项目配置
const appConfig = requireJSOrJSONFile(path.resolve(appRoot, 'project.config.js')) || {}
// mock数据目录
const mockDir = path.resolve(__dirname, 'mock')
const publicPath = `/m/${pkg.name}/${appName}/`
const noop = () => {
}

module.exports = {
  publicPath,
  // NOTE: CDN缓存认url链接中的dist目录
  assetsDir: 'dist',
  outputDir: `./dist/m/actevo/${appName}`,
  productionSourceMap: false,
  transpileDependencies: [/.*vf-modal.*/],
  css: {
    extract: false,
    loaderOptions: {
      postcss: {
        plugins: [
          require('autoprefixer'),
          // css适配方案(rem|vw|none) 默认为vw
          appConfig.cssUnit === 'rem' ? (
            require('postcss-plugin-px2rem')({
              rootValue: 75, // 设置为75才能和flexible库配合使用
              minPixelValue: 2, // 设置要转换的最小像素值
              unitPrecision: 5, // 指定`px`转换的小数位数
              exclude: /(node_modules)/, // 指定目录或文件不进行转换
              selectorBlackList: ['.ignore', '.hairlines'] // 指定不转换的类
            })
          ) : (
            appConfig.cssUnit === 'none' ? noop : (
              require('postcss-px-to-viewport')({
                viewportWidth: 750, // 视窗的宽度，对应的是设计稿的宽度
                minPixelValue: 2, // 设置要转换的最小像素值
                unitPrecision: 5, // 指定`px`转换的小数位数
                viewportUnit: 'vw', // 指定需要转换的单位
                exclude: /(node_modules)/, // 指定目录或文件不进行转换
                selectorBlackList: ['.ignore', '.hairlines'], // 指定不转换的类
                mediaQuery: true // 布尔值，媒体查询里的单位px是否需要转换
              })
            )
          )
        ]
      }
    }
  },
  configureWebpack: config => {
    // 修改入口
    config.entry.app = `./src/${appName}/main.js`

    // 动态引入的js，比如vue router的动态路由，加crossorigin="anonymous"
    config.output.crossOriginLoading = 'anonymous'

    // 复制静态目录，项目名/static/*
    const staticDir = `./src/${appName}/static`
    const isEmptyDir = dirname => {
      try {
        fs.rmdirSync(dirname)
      } catch (e) { // eslint-disable-line
        return false
      }
      fs.mkdirSync(dirname)
      return true
    }
    // 静态目录不为空就复制
    if (fs.existsSync(staticDir) && !isEmptyDir(staticDir)) {
      config.plugins.push(new CopyWebpackPlugin({
        patterns: [
          {
            from: staticDir, // 从哪个静态资源目录下获取资源： 项目根目录下static目录
            to: `dist/static` // 打包后复制到哪个目录下：跟目录下 static目录
          }
        ]
      }))
    }
    config.plugins.push(
      // 设置环境变量
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
          APP_NAME: JSON.stringify(appName),
          ASSETS_PUBLIC_PATH: JSON.stringify(publicPath)
        }
      })
    )
    // 资源external
    config.externals = {
      vue: 'Vue',
      axios: 'axios',
      'vue-router': 'VueRouter'
    }

    // 分包
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        coreJs: {
          name: 'core-js',
          test: /[\\/]node_modules[\\/]core-js/,
          priority: 10
        },
        lottie: {
          name: 'lottie-web',
          test: /[\\/]node_modules[\\/]lottie-web/,
          priority: 10
        },
        swiper: {
          name: 'swiper',
          test: /[\\/]node_modules[\\/]swiper/,
          priority: 10
        },
        html2canvas: {
          name: 'html2canvas',
          test: /[\\/]node_modules[\\/]html2canvas/,
          priority: 10
        },
        echarts: {
          name: 'echarts',
          test: /[\\/]node_modules[\\/]echarts/,
          priority: 10
        },
        cryptoJs: {
          name: 'crypto-js',
          test: /[\\/]node_modules[\\/]crypto-js/,
          priority: 10
        },
        vendors: {
          name: 'chunk-vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'initial'
        },
        common: {
          name: 'chunk-common',
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true
        }
      }
    }
  },
  chainWebpack: config => {
    if (appConfig.webpSupport) {
      // 图片转webp
      config
        .module
        .rule('images')
        .use('url-loader')
        .loader('url-loader')
        .tap(options => {
          options.limit = 1024
          options.fallback = {
            loader: path.resolve(__dirname, 'scripts/loaders/image-webp-loader.js'),
            options: { name: 'dist/img/[name].[hash:8].[ext]' }
          }
          return options
        })
        .end()
    } else {
      config
        .module
        .rule('images')
        .use('url-loader')
        .loader('url-loader')
        .tap(options => {
          options.limit = 2048
          return options
        })
        .end()
    }
    // 删除preload prefetch 插件
    config.plugins.delete('preload')
    config.plugins.delete('prefetch')
  },
  devServer: {
    // mock server
    before: app => {
      app.use(cors())
      app.use(bodyParser.json())
      app.use(bodyParser.urlencoded({ extended: true }))

      // 获取鉴权参数
      app.get('/act-core/authorize', async (req, res, next) => {
        try {
          const params = await getAuthorizeParams()
          res.json({
            CODE: '00',
            DATA: params,
            MSG: 'success'
          }).end()
        } catch (e) {
          res.json({
            CODE: '01',
            DATA: null,
            MSG: '获取鉴权参数失败:' + e.message
          }).end()
        }
      })

      app.use(async (req, res, next) => {
        let { path: urlWithoutParams, method, query, body } = req

        // 跳过处理[/m/actevo/项目名/]下的html css js 等资源文件
        if (urlWithoutParams.indexOf(publicPath) !== -1 || urlWithoutParams.indexOf('/favicon.ico') !== -1) {
          return next()
        }

        logger.log(`${getClientIp(req)} - ${dayJs().format('YYYY-MM-DD HH:mm:ss')} "${method.toUpperCase()} HTTP/1.1 ${urlWithoutParams}" 200`)

        // 优先尝试读js文件
        const jsFilePath = path.join(mockDir, `${urlWithoutParams}.js`)
        const jsResult = requireJSOrJSONFile(jsFilePath)
        if (jsResult && typeof jsResult === 'function') {
          const data = Mock.mock(jsResult(urlWithoutParams, method, query, body))
          return res.json(data).end()
        }

        // 没有js文件则尝试读json文件
        const jsonFilePath = path.join(mockDir, `${urlWithoutParams}.json`)
        const jsonResult = requireJSOrJSONFile(jsonFilePath)
        if (jsonResult) {
          return res.json(jsonResult).end()
        }

        // 输入返回file not found
        res.json({
          CODE: '01',
          DATA: null,
          MSG: 'file not found'
        }).end()
      })
    }
  }
}
