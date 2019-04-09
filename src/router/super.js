import Home from '@/components/super/Home'
import Add from '@/components/super/admin/Add'
import Manage from '@/components/super/admin/Manage'
import Password from '@/components/super/admin/Password'

export default [
  {
    path: '/super',
    redirect: '/super/adminAdd'
  },
  {
    path: '/super/adminAdd',
    component: Home,
    children: [
      {
        path: 'add',
        component: Add,
        name: 'adminAdd',
        meta: {
          requireSuper: true
        }
      }
    ]
  },
  {
    path: '/super/adminManage',
    component: Home,
    children: [
      {
        path: 'manage',
        name: 'adminManage',
        component: Manage,
        meta: {
          requireSuper: true
        }
      }
    ]
  },
  {
    path: '/super/password',
    component: Home,
    children: [
      {
        path: 'changePwd',
        name: 'superPwd',
        component: Password,
        meta: {
          requireSuper: true
        }
      }
    ]
  }
]
