import Job from '@/components/job/Job'
import FirstPage from  '@/components/job/FirstPage'
import JobSearch from '@/components/job/JobSearch'
import Login from '@/components/job/Login'
import NewsBrowse from '@/components/job/NewsBrowse'
import MyResume from '@/components/job/MyResume'
import MySent from '@/components/job/MySent'

export default [
  {
    path: '/',
    redirect: '/job/index'
  },
  {
    path: '/job',
    component: Job,
    children: [
      {
        path: 'index',
        component: FirstPage,
        name: 'index'
      },
      {
        name: 'jobSearch',
        path: 'jobSearch',
        props: {},
        component: JobSearch
      },
      {
        name: 'newsBrowse',
        path: 'newsBrowse',
        props: {},
        component: NewsBrowse
      },
      {
        path: 'myResume',
        name: 'myResume',
        component: MyResume,
        meta: {
          requireLogin: true
        }
      },
      {
        path: 'mySent',
        name: 'mySent',
        component: MySent,
        meta: {
          requireLogin: true
        }
      }
    ],
  },
  {
    path: '/login',
    component: Login,
    name: 'login'
  }
]
