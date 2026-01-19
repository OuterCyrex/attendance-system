import { AppRouteRecord } from '@/types/router'
import { ChartRoutes } from './chart'
import { ClassRoutes } from './class'
import { MessageRoutes } from './message'
import { AccountRoutes } from './account'
import { AttendanceClassRoutes, AttendanceScheduleRoutes } from './attendance'
import { ScheduleRoutes } from './schedule'
import { TeacherManageRoutes } from './teacherManage'
import { ReportRoutes } from './report'

/**
 * 导出所有模块化路由
 */
export const routeModules: AppRouteRecord[] = [
  ClassRoutes,
  ScheduleRoutes,
  MessageRoutes,
  AttendanceClassRoutes,
  AttendanceScheduleRoutes,
  TeacherManageRoutes,
  ReportRoutes,
  ChartRoutes,
  AccountRoutes
]
