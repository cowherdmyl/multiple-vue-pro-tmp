const path = require('path')
const fs = require('fs-extra')

/**
 * 读取工作区目录下的所有项目目录
 * @param workspace
 * @return {Promise<Array>}
 */
module.exports = async function getAppList (workspace) {
  try {
    let res = await fs.readdir(workspace)
    let appList = []
    for (let name of res) {
      const appDir = path.resolve(workspace, name)
      const dirStat = await fs.lstat(appDir)
      if (dirStat.isDirectory()) {
        const description = await getDescription(appDir)
        appList.push({ name, description })
      }
    }
    return appList
  } catch (e) {
    return []
  }
}

/**
 * 读取项目描述
 * @param directory - 项目根目录
 * @return {Promise<string|*|string>}
 */
async function getDescription (directory) {
  try {
    const pkgDir = path.join(directory, 'package.json')
    await fs.access(pkgDir, fs.constants.F_OK)
    const pkg = require(pkgDir)
    return pkg.description || ''
  } catch (e) {
    return ''
  }
}
