import axios from 'axios'

const axiosInstance = axios.create()

/**
 * axios拦截器
 * @param ctx
 * @param next
 * @return {Promise<void>}
 */
export default async (ctx, next) => {
  ctx.res = await send(ctx)
  await next()
}

async function send (ctx) {
  const { data } = await axiosInstance(ctx.req)

      // app里面进行风控、鉴权之类的操作
  if (!ctx.secondReq && (CODE === '30001' || CODE === '00009001')) {
    ctx.secondReq = true
    try {
      return send(ctx)
    } catch (err) {
      console.error(err)
      // 验证失败不弹出提示
      ctx.options.handleErr = false
      return Promise.reject(err)
    }
  }

  // 非正常返回值全部交给错误拦截器处理
  if (CODE && CODE !== '00') {
    return Promise.reject(data)
  }

  return Promise.resolve(data)
}

/**
 * 独立的其他方法可以新增其他文件
 * 
 * TODO：风控、鉴权值类型的方法
 * TODO：登录、请求头拦截等等
 */
