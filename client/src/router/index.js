import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'executeTest',
    component: () => import('../views/ExecuteTest.vue'), 
    alias: '/test',
    meta: {
      title: 'Execute Test'
    }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/About.vue'),
    meta: {
      title: 'About'
    }
  },
  {
    path: '/reports',
    component: () => import('../views/Reports.vue'),
    children: [
      {
        path: 'all',
        name: 'allReports',
        component: () => import('../views/components/ReportsTable.vue'),
        alias: '',
        meta: {
          title: 'All reports'
        }
      },
      {
        path: 'report',
        name: 'report',
        component: () => import('../views/components/ReportViewer.vue'),
        props: { report: false },
        meta: {
          title: 'Report'
        }
      }
    ]
  },
  {
    path: '/cron-jobs',
    component: () => import('../views/CronJobs.vue'),
    children: [
      {
        path: 'all',
        name: 'cronJobs',
        component: () => import('../views/components/CronJobsTable.vue'),
        alias: '',
        meta: {
          title: 'Cron Jobs'
        }
      },
      {
        path: 'new',
        name: 'newCronJob',
        component: () => import('../views/NewCronJob.vue'),
        meta: {
          title: 'New Cron Job'
        }
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
