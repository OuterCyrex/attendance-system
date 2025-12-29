import { AppRouteRecord } from '@/types/router'

export const AttendanceClassRoutes: AppRouteRecord = {
  path: '/attendance/class/:id',
  name: 'attendance/class',
  component: '/attendance/class',
  meta: {
    title: '班级考勤',
    isHide: true,
    roles:['teacher']
  }
}

export const AttendanceScheduleRoutes: AppRouteRecord = {
  path: '/attendance/schedule/:id',
  name: 'attendance/schedule',
  component: '/attendance/schedule/schedule',
  meta: {
    title: '课程考勤',
    isHide: true,
    roles:['teacher']
  }
}