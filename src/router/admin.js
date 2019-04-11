import Home from '@/components/admin/Home'
import Login from '@/components/admin/Login'
import ResidenceAdd from '@/components/admin/residence/Add'
import ResidenceManage from '@/components/admin/residence/Manage'
import PropertyAdd from '@/components/admin/property/Add'
import PropertyManage from '@/components/admin/property/Manage'
import CheckIn from '@/components/admin/property/CheckIn'
import UserAdd from '@/components/admin/user/Add'
import UserManage from '@/components/admin/user/Manage'
import BillAdd from '@/components/admin/bill/Add'
import BillManage from '@/components/admin/bill/Manage'
import NoticeAdd from '@/components/admin/notice/Add'
import NoticeManage from '@/components/admin/notice/Manage'

export default [
  {
    path: '/admin',
    redirect: '/admin/residence'
  },
  {
    path: '/admin/login',
    component: Login,
    name: 'adminLogin'
  },
  {
    path: '/admin/residence',
    name: 'home',
    redirect: '/admin/residence/add',
    component: Home,
    meta: {
      requireAdmin: true
    },
    children: [
      {
        path: 'add',
        component: ResidenceAdd,
        meta: {
          requireAdmin: true
        },
        name: 'residenceAdd',
        props: {}
      },
      {
        path: 'manage',
        component: ResidenceManage,
        meta: {
          requireAdmin: true
        },
        name: 'residenceManage'
      }
    ]
  },
  {
    path: '/admin/property',
    component: Home,
    redirect: '/admin/property/add',
    meta: {
      requireAdmin: true
    },
    children: [
      {
        path: 'add',
        props: [],
        name: 'propertyAdd',
        meta: {
          requireAdmin: true
        },
        component: PropertyAdd
      },
      {
        path: 'manage',
        component: PropertyManage,
        meta: {
          requireAdmin: true
        },
        name: 'propertyManage'
      },
      {
        path: 'checkIn',
        component: CheckIn,
        meta: {
          requireAdmin: true
        },
        name: 'checkIn'
      }
    ]
  },
  {
    path: '/admin/user',
    component: Home,
    redirect: '/admin/user/add',
    meta: {
      requireAdmin: true
    },
    children: [
      {
        path: 'add',
        props: [],
        name: 'userAdd',
        meta: {
          requireAdmin: true
        },
        component: UserAdd
      },
      {
        path: 'manage',
        component: UserManage,
        meta: {
          requireAdmin: true
        },
        name: 'userManage'
      }
    ]
  },
  {
    path: '/admin/bill',
    component: Home,
    redirect: '/admin/bill/add',
    meta: {
      requireAdmin: true
    },
    children: [
      {
        path: 'add',
        props: [],
        name: 'billAdd',
        meta: {
          requireAdmin: true
        },
        component: BillAdd
      },
      {
        path: 'manage',
        props: [],
        name: 'billManage',
        meta: {
          requireAdmin: true
        },
        component: BillManage
      }
    ]
  },
  {
    path: '/admin/notice',
    component: Home,
    redirect: '/admin/notice/add',
    meta: {
      requireAdmin: true
    },
    children: [
      {
        path: 'add',
        props: [],
        name: 'noticeAdd',
        meta: {
          requireAdmin: true
        },
        component: NoticeAdd
      },
      {
        path: 'manage',
        props: [],
        name: 'noticeManage',
        meta: {
          requireAdmin: true
        },
        component: NoticeManage
      }
    ]
  }
]
