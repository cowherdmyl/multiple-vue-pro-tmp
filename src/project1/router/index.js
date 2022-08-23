import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    // 懒加载，生成chunk (home.[hash].js)
    component: () => import(/* webpackChunkName: "home" */ '../views/home/index.vue')
  },
  {
    path: '/share',
    name: 'share',
    // 懒加载，生成chunk (wx-share.[hash].js)
    component: () => import(/* webpackChunkName: "wx-share" */ '../views/wx-share/index.vue')
  }
]

const router = new VueRouter({ routes })

router.beforeEach((to, from, next) => {
  // do something 例如：设置vieview的title、右上角分享按钮设定等等
  next()
})

export default router
