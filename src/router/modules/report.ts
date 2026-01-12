import { AppRouteRecord } from '@/types/router'

export const ReportRoutes: AppRouteRecord = {
  path: '/report',
  name: 'report',
  component: '/report/index',
  meta: {
    title: '统计报表',
    icon: 'ri:bar-chart-fill',
    roles: ['admin', 'college_admin', 'teacher']
  }
}