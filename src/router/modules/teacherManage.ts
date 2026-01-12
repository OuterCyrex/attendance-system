import { AppRouteRecord } from '@/types/router'

export const TeacherManageRoutes: AppRouteRecord = {
  path: '/teacherManage',
  name: 'teacher',
  component: '/teacherManage/index',
  meta: {
    title: '教师管理',
    icon: 'ri:user-3-fill',
    roles:['college_admin', 'admin']
  }
}
