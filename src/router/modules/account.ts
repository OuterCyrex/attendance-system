import { AppRouteRecord } from '@/types/router'

export const AccountRoutes: AppRouteRecord = {
  path: '/account',
  name: 'account',
  component: '/account/index',
  meta: {
    title: '个人设置',
    icon: 'ri:user-3-fill'
  }
}