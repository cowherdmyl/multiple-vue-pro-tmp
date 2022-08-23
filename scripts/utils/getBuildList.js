const program = require('commander')
const buildConfig = require('../../build.config.json')

/**
 * 读取打包项目列表
 * @returns {array}
 */
module.exports = function getBuildList () {
  program
    .version('0.1.0')
    .option('--report', 'Generate build resource report.', false)
    .option('--appList [list]', 'Apps to be built.', val => val.split(','), [])
    .parse(process.argv)

  // 优先从命令行读取
  if (Array.isArray(program.appList) && program.appList.length) {
    return program.appList
  }
  // 项目路径下build.config.json中的项目列表次之
  return Array.isArray((buildConfig || {}).build) ? buildConfig.build : []
}
