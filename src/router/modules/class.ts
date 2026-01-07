import { AppRouteRecord } from '@/types/router'

export const ClassRoutes: AppRouteRecord = {
  path: '/class',
  name: 'class',
  component: '/class/index',
  meta: {
    title: '班级管理',
    icon: 'ri:book-2-fill',
    roles:['teacher','college_admin', 'admin']
  }
}
