import Vue from 'vue'
import App from './App'
import router from './router'
import  ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'

Vue.use(ElementUI);
Vue.prototype.$http = axios;
import store from './vuex/store'
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
})

