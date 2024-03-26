/*
 * @Author: Gro lin
 * @Date: 2024-03-11 22:06:00
 * @LastEditors: Gro lin
 * @LastEditTime: 2024-03-11 22:25:32
 */
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/views/layout/index.vue'),
      children: [
        {
          path: 'home',
          name: 'home',
          component: () => import('@/views/homeView/index.vue')
        },
        {
          path: 'account',
          name: 'account',
          component: () => import('@/views/accountView/index.vue')
        },
        {
          path: 'diary',
          name: 'diary',
          component: () => import('@/views/diaryView/index.vue')
        },
        {
          path: 'library',
          name: 'library',
          component: () => import('@/views/libraryView/index.vue')
        },
        {
          path: 'topic',
          name: 'topic',
          component: () => import('@/views/topicView/index.vue')
        }
      ]
    },
    {
      path: '/test',
      component: () => import('@/views/testView.vue'),
      children: [
        {
          path: 'slider',
          name: 'slider',
          component: () => import('@/components/Slider.vue')
        },
        {
          path: 'clock',
          name: 'clock',
          component: () => import('@/components/Clock.vue')
        },
        {
          path: 'radioPlayer',
          name: 'radioPlayer',
          component: () => import('@/components/RadioPlayer.vue')
        },
        {
          path: 'chip',
          name: 'chip',
          component: () => import('@/components/Chip.vue')
        },
        {
          path: 'segmentedControl',
          name: 'segmentedControl',
          component: () => import('@/components/SegmentedControl.vue')
        },
        {
          path: 'nucleus',
          name: 'nucleus',
          component: () => import('@/components/modules/Nucleus.vue')
        },
        {
          path: 'refs',
          name: 'refs',
          component: () => import('@/views/layout/index.vue')
        },
        {
          path: 'flip',
          name: 'flip',
          component: () => import('@/components/Flip.vue')
        },
        {
          path: 'search',
          name: 'search',
          component: () => import('@/components/Search.vue')
        },
        {
          path: 'popup',
          name: 'popup',
          component: () => import('@/components/Popup.vue')
        },
        {
          path: 'popup2',
          name: 'popup2',
          component: () => import('@/views/diaryView/editPop.vue')
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/loginView/index.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: '404 not found',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('@/views/layout/404/index.vue')
    }
  ],
  //路由行为
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
