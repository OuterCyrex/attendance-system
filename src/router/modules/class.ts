import { AppRouteRecord } from '@/types/router'

export const ClassRoutes: AppRouteRecord = {
  path: '/class',
  name: 'class',
  component: '/class/index',
  meta: {
    title: '班级管理',
    icon: 'ri:apps-2-add-line'
  }
}
