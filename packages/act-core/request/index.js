
import _interceptors from './interceptors'

// TODO: 对请求的其他拦截处理

const {
  axiosInterceptor
} = _interceptors

/**
 * 默认发起请求的方法
 * @param {object} options - 参数对象
 * @param {string} options.url - 接口地址
 * @param {object} [options.data] - 请求参数
 * @param {string} [options.headers] - 请求头
 * @param {string} [options.method=post] - get | post
 * @param {string} [options.server=springcloud_operate] - 服务器
 */
// 结果函数样式如下：
// export default request(
//   [
//     axiosInterceptor
//   ],
//   {
//     method: 'post',
//     server: 'server123',
//     handleErr: true,
//     showLoading: true,
//     needBlackBox: false,
//     ignoreResCodes: []
//   }
// )
