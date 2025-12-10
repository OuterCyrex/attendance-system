import { AppRouteRecord } from '@/types/router'

export const AttendanceRoutes: AppRouteRecord = {
  path: '/attendance',
  name: 'attendance',
  component: '/attendance/index',
  meta: {
    title: '考勤详细',
    isHide: true
  }
}
