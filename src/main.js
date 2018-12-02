// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import '@/assets/css/reset.css'
import http from '@/myplugin/http.js'
import MyBread from '@/components/common/mybread.vue'
//全局组件配置
Vue.component('my-bread',MyBread)
Vue.use(ElementUI);
Vue.use(http);

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
