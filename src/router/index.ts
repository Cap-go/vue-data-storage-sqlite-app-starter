import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '../views/TabsPage.vue'
import StoreDefaultPage from "@/views/StoreDefaultPage.vue";
import StoreFilterValuesPage from "@/views/StoreFilterValuesPage.vue";
import StoreImportExportJsonPage from "@/views/StoreImportExportJsonPage.vue";
import NotFoundPage from "@/views/NotFoundPage.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/tab1'
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: 'tab1'
      },
      {
        path: 'tab1',
        component: () => import('@/views/Tab1Page.vue')
      },
      {
        path: 'tab2',
        component: () => import('@/views/Tab2Page.vue')
      },
      {
        path: 'tab3',
        component: () => import('@/views/Tab3Page.vue')
      }
    ]
  },
  {
    path: "/storedefault",
    name: "StoreDefaultPage",
    component: StoreDefaultPage,
  },
  {
    path: "/filtervalues",
    name: "StoreFilterValuesPage",
    component: StoreFilterValuesPage,
  },
  {
    path: "/importexportjson",
    name: "StoreImportExportJsonPage",
    component: StoreImportExportJsonPage,
  },
  
  {
    path: "/:catchAll(.*)",
    component: NotFoundPage,
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
