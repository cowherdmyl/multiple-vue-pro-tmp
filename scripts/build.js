const del = require('del')
const path = require('path')
const fs = require('fs-extra')
const program = require('commander')
const spawn = require('cross-spawn')
const logger = require('./utils/logger')
const getBuildList = require('./utils/getBuildList')

// 清理dist文件夹
del.sync(['dist/**', '!dist'])

// 读取打包项目列表
const appList = getBuildList()

logger.info(`The following app's will be built: [ ${appList.join(',')} ]. \n`)

for (const appName of appList) {
  // 项目根目录
  const appRoot = path.resolve(__dirname, '..', 'src', appName)
  // 判断项目文件夹是否存在
  if (!fs.existsSync(appRoot)) {
    logger.error(`【${appName}】 is not exist. \n`)
    process.exit(1)
  }
  logger.info(`Start building app (${appName}).`)
  const { status } = spawn.sync(
    'vue-cli-service',
    [
      'build',
      program.report ? '--report' : '',
      '--appName', appName
    ],
    { stdio: 'inherit' }
  )
  if (status !== 0) {
    process.exit(status)
  }
}


