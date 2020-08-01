import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Execute Test',
    component: () => import('../views/ExecuteTest.vue'), 
    alias: '/test'
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('../views/About.vue')
  },
  {
    path: '/cron-jobs',
    component: () => import('../views/CronJobs.vue'),
    children: [
      {
        path: 'all',
        name: 'Cron Jobs',
        component: () => import('../views/components/CronJobsTable.vue'),
        alias: ''
      },
      {
        path: 'new',
        name: 'New Cron Job',
        component: () => import('../views/NewCronJob.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
