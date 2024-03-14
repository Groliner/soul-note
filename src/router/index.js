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
      name: 'home',
      component: () => import('@/views/layout/index.vue')
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
        }
      ]
    }

    // {
    //   path: '/about',
    //   name: 'about',
    //   // route level code-splitting
    //   // this generates a separate chunk (About.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () => import('../views/AboutView.vue')
    // }
  ],
  //路由行为
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
