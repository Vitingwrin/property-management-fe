import Home from '@/components/admin/Home'
import Publish from '@/components/admin/news/Publish'
import UserAdd from '@/components/admin/user/UserAdd'
import UserPwd from '@/components/admin/user/UserPwd'
import Published from '@/components/admin/news/Published'
import Trash from '@/components/admin/news/Trash'
import UserManage from '@/components/admin/user/UserManage'
import Manage from '@/components/admin/company/Manage'
import JobAdd from '@/components/admin/job/JobAdd'
import JobManage from '@/components/admin/job/JobManage'
import JobResumeManage from '@/components/admin/jobResume/Manage'

export default [
  {
    path: '/admin',
    redirect: '/admin/news'
  },
  {
    path: '/admin/news',
    name: 'home',
    redirect: '/admin/news/publish',
    component: Home,
    meta: {
      requireAdmin: true
    },
    children: [
      {
        path: 'publish',
        component: Publish,
        meta: {
          requireAdmin: true
        },
        name: 'publish',
        props: {}
      },
      {
        path: 'published',
        meta: {
          requireAdmin: true
        },
        component: Published
      },
      {
        path: 'trash',
        meta: {
          requireAdmin: true
        },
        component: Trash
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
        meta: {
          requireAdmin: true
        },
        component: UserAdd
      },
      {
        path: 'pwd',
        name: 'adminPwd',
        meta: {
          requireAdmin: true
        },
        component: UserPwd
      },
      {
        path: 'manage',
        meta: {
          requireAdmin: true
        },
        component: UserManage
      }
    ]
  },
  {
    path: '/admin/company',
    component: Home,
    redirect: '/admin/company/manage',
    meta: {
      requireAdmin: true
    },
    children: [
      {
        path: 'manage',
        meta: {
          requireAdmin: true
        },
        component: Manage
      }
    ]
  },
  {
    path: '/admin/job',
    component: Home,
    redirect: '/admin/job/add',
    meta: {
      requireAdmin: true
    },
    children: [
      {
        path: 'add',
        name: 'jobAdd',
        props: {},
        meta: {
          requireAdmin: true
        },
        component: JobAdd
      },
      {
        path: 'manage',
        meta: {
          requireAdmin: true
        },
        component: JobManage
      }
    ]
  },
  {
    path: '/admin/jobResume',
    component: Home,
    redirect: '/admin/jobResume/manage',
    meta: {
      requireAdmin: true
    },
    children: [
      {
        path: 'manage',
        meta: {
          requireAdmin: true
        },
        component: JobResumeManage
      }
    ]
  }
]
