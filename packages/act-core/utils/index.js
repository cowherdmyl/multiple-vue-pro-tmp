/**
 * 'android' || 'ios' || 'others'
 * @type {string}
 */
export const OS = (() => {
  const ua = navigator.userAgent.toLowerCase()
  if (ua.match(/android/)) {
    return 'android'
  } else if (ua.match(/(ipad|iphone|ipod)/)) {
    return 'ios'
  } else {
    return 'others'
  }
})()

/**
 * 获取url参数
 * @param {string} [url] - 需要分析param的地址，如不传，则默认为 window.location.href
 * @return {object} 以object的形式获取url的param
 */
export function getUrlParams (url = window.location.href) {
  const search = url.split('#')[0].split('?')[1]
  const params = search ? search.split('&') : []
  const result = {}

  params.forEach(param => {
    const paramArr = param.split('=')
    result[paramArr[0]] = decodeURIComponent(paramArr[1])
  })

  return result
}

/**
 * 获取初始化地址中的hash参数
 * @param {string} [url] - 需要分析query的地址，如不传，则默认为 window.location.href
 * @return {object} 以object的形式获取url的hash query
 */
export function getHashParams (url = window.location.href) {
  const search = url.split('#')[1] ? url.split('#')[1].split('?')[1] : ''
  const params = search ? search.split('&') : []
  const result = {}

  params.forEach(param => {
    const paramArr = param.split('=')
    result[paramArr[0]] = decodeURIComponent(paramArr[1])
  })

  return result
}

/**
 * 拼接对象为请求字符串
 * @param {object} obj - 待拼接的对象
 * @returns {string} - 拼接成的请求字符串
 */
export function encodeSearchParams (obj) {
  const params = []

  Object.keys(obj).forEach((key) => {
    let value = obj[key]
    // 如果值为undefined我们将其置空
    if (typeof value === 'undefined') {
      value = ''
    }
    // 对于需要编码的文本（比如说中文）我们要进行编码
    params.push([key, encodeURIComponent(value)].join('='))
  })

  return params.join('&')
}

/**
 * 函数防抖
 * @param {function} fn - 需要防抖的函数
 * @param {number} [delay=300] - 延迟
 * @return {function}
 */
export function debounce (fn, delay = 300) {
  let timer = null
  return function () {
    let arg = arguments
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, arg)
    }, delay)
  }
}

/**
 * 函数节流
 * @param {function} fn - 需要节流的函数
 * @param {number} wait - 等待时间
 * @return {function}
 */
export function throttle (fn, wait) {
  let ctx, args, rtn, timer
  let last = 0

  return function throttled () {
    ctx = this
    args = arguments
    let delta = new Date() - last
    if (!timer) {
      if (delta >= wait) {
        call()
      } else {
        timer = setTimeout(call, wait - delta)
      }
    }
    return rtn
  }

  function call () {
    timer = 0
    last = +new Date()
    rtn = fn.apply(ctx, args)
    ctx = null
    args = null
  }
}

/**
 * 是否APP环境
 * @return {boolean}
 */
export function isApp () {
  return !!navigator.userAgent.toLowerCase().match(/pars/)
}


/**
 * 是否小程序环境
 * @returns {boolean}
 */
export function isMiniProgram () {
  return !!navigator.userAgent.toLowerCase().match(/miniprogram/)
}

/**
 * 是否微信环境
 * @returns {boolean}
 */
export function isWechat () {
  return !!navigator.userAgent.toLowerCase().match('micromessenger')
}
