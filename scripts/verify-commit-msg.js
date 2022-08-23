const fs = require('fs')
const path = require('path')
const spawn = require('cross-spawn')
const logger = require('./utils/logger')
const getAppList = require('./utils/getAppList')

// 校验格式是否符合规范
const { status } = spawn.sync('commitlint', ['-E', 'HUSKY_GIT_PARAMS'], { stdio: 'inherit' })
if (status !== 0) {
  process.exit(1)
}

// 校验项目是否填写正确
;(async () => {
  const message = fs.readFileSync(process.env.HUSKY_GIT_PARAMS, 'utf-8').trim()
  if (!message.startsWith('Merge branch')) {
    const match = message.match(/\(.+?\)/g)
    if (!match || !match.length) {
      logger.error(`commit message：${message}`)
      logger.error('commit message填写格式错误')
      process.exit(1)
    }
    const appName = match[0].slice(1, -1)
    // 读取项目列表
    const packageRoot = path.resolve(__dirname, '..', 'packages')
    const srcRoot = path.resolve(__dirname, '..', 'src')
    const [appList, packageList] = await Promise.all([getAppList(srcRoot), getAppList(packageRoot)])
    // 项目填写错误
    const appIndex = appList.findIndex(item => item.name === appName)
    const packageIndex = packageList.findIndex(item => item.name === appName)
    if (packageIndex === -1 && appIndex === -1) {
      logger.error(`commit message: ${message}`)
      logger.error(`项目填写错误，请确认packages或src下存在该项目: ${appName}`)
      process.exit(1)
    }
  }
})()
