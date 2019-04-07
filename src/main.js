// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store/index'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faLock, faFileAlt, faTags, faLockOpen, faSearch, faAt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import 'font-awesome/css/font-awesome.min.css'
import axios from 'axios'
import mavonEditor from 'mavon-editor'

import 'mavon-editor/dist/css/index.css'

Vue.component('fa', FontAwesomeIcon);
library.add(faUser, faLock, faFileAlt, faTags, faLockOpen, faSearch, faAt);

import ElementUI from 'element-ui'
Vue.use(ElementUI);
// Vue.use(mavonEditor);
Vue.use(mavonEditor)

Vue.config.productionTip = false;

// axios配置
axios.defaults.baseURL = 'http://localhost:8080'; //开发
// axios.defaults.baseURL = 'http://120.79.93.191:8080'; //生产
axios.defaults.withCredentials = true;

Vue.prototype.arrayCopy = items => {
  let copy = [];
  for (let item of items) {
    copy.push(Object.assign({}, item));
  }
  return copy;
};

// 前置路由
router.beforeEach((to, from, next) => {
  if (to.name === 'login') {
    // 如果已经登录就不跳转登录页
    if (store.getters.isLogin) {
      next({path: from});
    } else {
      next();
    }
    return;
  }
  if (!store.getters.isLogin) {
    if (to.meta.requireAdmin || to.meta.requireLogin) {
      next({path: '/login', query: {redirect: to.path}});
    } else {
      next();
    }
  } else {
    if (to.meta.requireAdmin) {
      // 判断权限
      if (store.getters.isAdmin) {
        next();
      } else {
        Vue.prototype.$message.error("权限不足，请登录管理员权限账号");
        next({path: '/login', query: {redirect: to.path}});
      }
    }
    next();
  }
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  render: h => h(App)
});
