const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/IndexPage.vue') },
      { path: 'sales', component: () => import('pages/SalesPage.vue') },
      { path: 'employees', component: () => import('pages/EmployeesPage.vue') },
      { path: 'prices', component: () => import('pages/PricesPage.vue') },
      { path: 'schedules', component: () => import('pages/SchedulesPage.vue') },
      { path: 'sending', component: () => import('pages/IndexPage.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
