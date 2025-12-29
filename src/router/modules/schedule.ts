import { AppRouteRecord } from '@/types/router'

export const ScheduleRoutes: AppRouteRecord = {
  path: '/schedule',
  name: 'schedule',
  component: '/schedule/index',
  meta: {
    title: '排课管理',
    icon: 'ri:apps-2-add-line',
    roles:['teacher','college_admin']
  }
}
