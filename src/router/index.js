import Vue from 'vue'
import Router from 'vue-router'
import Admin from './admin'
import Super from './super'
import Property from './property'
import Error from '@/components/Error'

Vue.use(Router);

const all = [
  {
    // 会匹配所有路径
    path: '*',
    component: Error
  }
];

const routers = [].concat(Admin, Super, Property, all);

export default new Router({
  routes: routers,
  mode: 'history'
})
