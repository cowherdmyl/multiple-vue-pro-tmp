import Vue from 'vue'
import App from './App.vue'
import router from './router'
import 'normalize.css'
import { bridge, utils, request } from '@/packages/act-core'

// 挂载一些公共的工具方法
Vue.bridge = Vue.prototype.$bridge = bridge
Vue.utils = Vue.prototype.$utils = utils
Vue.ajax = Vue.prototype.$ajax = request.default

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
