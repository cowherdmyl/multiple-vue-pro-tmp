const path = require('path')
const logger = require('./logger')
const childProcess = require('child_process')

exports.formatSize = bytes => {
  if (bytes === 0) {
    return '0 B'
  }
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i]
}

exports.wait = ms => {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

/**
 * 读取js或者json文件
 * @param path - 文件绝对路径
 * @return {Promise<object>}
 */
exports.requireJSOrJSONFile = path => {
  if (require.cache[path]) {
    delete require.cache[path]
  }
  try {
    return require(path)
  } catch (e) {
    return null
  }
}

/**
 * 获取当前git分支名
 * @return {string}
 */
exports.getGitBranch = () => {
  try {
    let branch = childProcess.execSync('git rev-parse --abbrev-ref HEAD')
    let commit = childProcess.execSync('git rev-parse HEAD')
    return {
      branch: branch.toString().trim(),
      commit: commit.toString().trim()
    }
  } catch (e) {
    logger.error(`获取GIT分支失败:\n${e}\n`)
    return 'unknown'
  }
}

/**
 * 获取客户端ip
 * @param req
 * @return {*|string}
 */
exports.getClientIp = req => {
  return req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress
}

/**
 * 获取金管家鉴权加签参数
 * @return {object}
 */
exports.getAuthorizeParams = () => {
  return new Promise((resolve, reject) => {
    try {
      const result = childProcess.execSync(`java -jar ${path.resolve(__dirname, '..', 'bin/authorize.jar')} -user 13300000011 -pwd qweqwe123 -env https://test2-platform.lifeapp.pingan.com.cn`)
      const [loginToken, signKey, tempEncryptedKey, userId] = result.toString().split('\n')[2].split('#')
      resolve({
        loginToken,
        signKey,
        tempEncryptedKey,
        userId
      })
    } catch (e) {
      reject(e)
    }
  })
}
