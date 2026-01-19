import { AppRouteRecord } from '@/types/router'

export const ChartRoutes: AppRouteRecord = {
  path: '/chart',
  name: 'chart',
  component: '/chart/index',
  meta: {
    title: '可视化报表',
    icon: 'ri:book-2-fill',
    roles:['teacher','college_admin', 'admin']
  }
}