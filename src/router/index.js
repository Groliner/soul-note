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
      redirect: '/home',
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
        },
        {
          path: 'chats',
          name: 'chats',
          component: () => import('@/views/chatsView/index.vue')
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
          path: 'select',
          name: 'select',
          component: () => import('@/components/Select.vue')
        },
        {
          path: 'calendar',
          name: 'calendar',
          component: () => import('@/components/modules/YearCalendar.vue')
        },
        {
          path: 'sendMessage',
          name: 'sendMessage',
          component: () => import('@/components/modules/SendEmail.vue')
        },
        {
          path: 'tt',
          name: 'tt',
          component: () => import('@/components/modules/PrettyDesign.vue')
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

import { useUserStore, useDiaryStore, useMessageStore } from '@/stores'

router.beforeEach((to, from) => {
  const userStore = useUserStore()
  const messageStore = useMessageStore()
  const diaryStore = useDiaryStore()
  if (!['home', 'login'].includes(to.name) && !userStore.isAuthenticated) {
    userStore.logout()
    return { name: 'login' }
  }
  if (['account', 'diary'].includes(to.name)) {
    console.log('刷新页面可从数据库更新数据')
    userStore.getUserDiaryStatus()
    diaryStore.init()
  }
  if (['account'].includes(to.name)) {
    userStore.updateUserInfo()
  }
  return true
})

export default router
