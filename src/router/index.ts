import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import Tabs from '../views/Tabs.vue'
import StoreDefault from "@/views/StoreDefault.vue";
import StoreFilterValues from "@/views/StoreFilterValues.vue";
import StoreImportExportJson from "@/views/StoreImportExportJson.vue";
import NotFound from "@/views/NotFound.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/tab1'
  },
  {
    path: '/tabs/',
    component: Tabs,
    children: [
      {
        path: '',
        redirect: 'tab1'
      },
      {
        path: 'tab1',
        component: () => import('@/views/Tab1.vue')
      },
      {
        path: 'tab2',
        component: () => import('@/views/Tab2.vue')
      },
      {
        path: 'tab3',
        component: () => import('@/views/Tab3.vue')
      }
    ]
  },
  {
    path: "/storedefault",
    name: "StoreDefault",
    component: StoreDefault,
  },
  {
    path: "/filtervalues",
    name: "StoreFilterValues",
    component: StoreFilterValues,
  },
  {
    path: "/importexportjson",
    name: "StoreImportExportJson",
    component: StoreImportExportJson,
  },
  
  {
    path: "/:catchAll(.*)",
    component: NotFound,
  },

]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
