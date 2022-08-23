const fs = require('fs-extra')
const path = require('path')
const spawn = require('cross-spawn')
const inquirer = require('inquirer')
const program = require('commander')
const logger = require('./utils/logger')
const getAppList = require('./utils/getAppList')

inquirer.registerPrompt('search-list', require('inquirer-search-list'))

;(async () => {
  program
    .version('0.1.0')
    .option('--appName [appName]', 'Start developing a app', 'none')
    .parse(process.argv)

  let { appName } = program
  if (appName && appName !== 'none') {
    // 项目根目录
    const appRoot = path.resolve(__dirname, '..', 'src', appName)
    // 判断项目文件夹是否存在
    if (!fs.existsSync(appRoot)) {
      logger.error(`【${appName}】 is not exist. \n`)
      process.exit(1)
    }
  } else {
    // 工作目录
    const workspace = path.resolve(__dirname, '..', 'src')
    // 从工作目录读取项目列表
    let appList = await getAppList(workspace)
    // 将上次启动的项目置前
    const lastStartProject = await readLastStartProject(path.join(__dirname, '__last__'))
    if (lastStartProject) {
      const index = appList.findIndex(item => item.name === lastStartProject)
      if (index !== -1) {
        const spliceList = appList.splice(index, 1)
        appList = [...spliceList, ...appList]
      }
    }
    // 命令行询问
    const { app } = await inquirer.prompt([{
      type: 'search-list',
      name: 'app',
      message: '请选择您要启动的项目,支持模糊搜索',
      choices: appList.map(app => {
        return { name: `${app.name} ${app.description ? '(' + app.description + ')' : ''}`, value: app.name }
      })
    }])
    appName = app
  }
  // 记录本次启动的项目
  await fs.writeFile(path.join(__dirname, '__last__'), appName)
  spawn.sync(
    'vue-cli-service',
    ['serve', '--appName', appName],
    { stdio: 'inherit' }
  )
})()

async function readLastStartProject (filepath) {
  try {
    return await fs.readFile(filepath, { encoding: 'utf8' })
  } catch (e) {
    return ''
  }
}
