// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store/index'

import { library } from '@fortawesome/fontawesome-svg-core'
import { faUser, faLock, faFileAlt, faTags, faWrench, faClipboard, faKey,
  faLockOpen, faSearch, faAt, faBuilding, faBookmark, faDollarSign, faSignOutAlt }
  from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import 'font-awesome/css/font-awesome.min.css'
import axios from 'axios'

Vue.component('fa', FontAwesomeIcon);
library.add(faUser, faLock, faFileAlt, faTags, faClipboard, faKey, faDollarSign,
  faLockOpen, faSearch, faAt, faBuilding, faWrench, faBookmark, faSignOutAlt);

import MintUI from 'mint-ui'
import 'mint-ui/lib/style.css'

import ElementUI from 'element-ui'

import {Toast} from 'mint-ui'
Vue.use(ElementUI);
Vue.use(MintUI)

Vue.config.productionTip = false;

// axios配置
axios.defaults.baseURL = 'http://localhost:8080';
axios.defaults.withCredentials = true;

Vue.prototype.feLogout = () => {
  store.commit('logout');
  location.href = '/login';
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
    if (to.meta.requireAdmin) {
      next({path: '/admin/login', query: {redirect: to.path}});
    } else if (to.meta.requireLogin) {
      next({path: '/login', query: {redirect: to.path}});
    }  else {
      next();
    }
  } else {
    if (to.meta.requireLogin) {
      // 判断权限
      if (store.getters.isAdmin || store.getters.isSuper) {
        Toast('请登录普通用户账号');
        next({path: '/login', query: {redirect: to.path}});
      } else {
        next();
      }
      return;
    } else if (to.meta.requireAdmin) {
      // 判断权限
      if (store.getters.isAdmin) {
        next();
      } else {
        Vue.prototype.$message.error("权限不足，请登录管理员权限账号");
        next({path: '/admin/login', query: {redirect: to.path}});
      }
      return;
    } else if (to.meta.requireSuper) {
      // 判断权限
      if (store.getters.isSuper) {
        next();
      } else {
        Vue.prototype.$message.error("权限不足，请登录超级管理员权限账号");
        next({path: '/admin/login', query: {redirect: to.path}});
      }
      return;
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
