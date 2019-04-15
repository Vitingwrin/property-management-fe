import Index from '@/components/property/Index'
import MyBill from '@/components/property/MyBill'
import BillDetail from '@/components/property/BillDetail'
import MyProperty from '@//components/property/MyProperty'
import Password from '@/components/property/Password'
import Notice from '@/components/property/Notice'
import NoticeDetail from '@/components/property/NoticeDetail'
import Complaint from '@/components/property/Complaint'
import Repair from '@/components/property/Repair'
import Login from '@/components/property/Login'

export default [
  {
    path: '/',
    component: Index,
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/login',
    component: Login,
    name: 'login'
  },
  {
    path: '/myBill',
    component: MyBill,
    name: 'myBill',
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/billDetail',
    component: BillDetail,
    name: 'billDetail',
    props: [],
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/myProperty',
    component: MyProperty,
    name: 'myProperty',
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/password',
    name: 'password',
    component: Password,
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/notice',
    name: 'notice',
    component: Notice,
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/noticeDetail',
    name: 'noticeDetail',
    component: NoticeDetail,
    props: [],
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/complaint',
    name: 'complaint',
    component: Complaint,
    meta: {
      requireLogin: true
    }
  },
  {
    path: '/repair',
    name: 'repair',
    component: Repair,
    meta: {
      requireLogin: true
    }
  }
]
