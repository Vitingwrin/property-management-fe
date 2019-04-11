import Index from '@/components/property/Index'
import MyBill from '@/components/property/MyBill'
import BillDetail from '@/components/property/BillDetail'
import MyProperty from '@//components/property/MyProperty'
import Password from '@/components/property/Password'

export default [
  {
    path: '/',
    component: Index
  },
  {
    path: '/myBill',
    component: MyBill,
    name: 'myBill'
  },
  {
    path: '/billDetail',
    component: BillDetail,
    name: 'billDetail',
    props: []
  },
  {
    path: '/myProperty',
    component: MyProperty,
    name: 'myProperty'
  },
  {
    path: '/password',
    name: 'password',
    component: Password
  }
]
