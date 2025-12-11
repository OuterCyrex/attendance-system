import { AppRouteRecord } from '@/types/router'
import { dashboardRoutes } from './dashboard'
import { widgetsRoutes } from './widgets'
import { ClassRoutes } from './class'
import { MessageRoutes } from './message'
import { AccountRoutes } from './account'
import { AttendanceRoutes } from './attendance'

/**
 * 导出所有模块化路由
 */
export const routeModules: AppRouteRecord[] = [
  dashboardRoutes,
  ClassRoutes,
  MessageRoutes,
  AccountRoutes,
  AttendanceRoutes
]
