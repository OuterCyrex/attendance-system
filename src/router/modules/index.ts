import { AppRouteRecord } from '@/types/router'
import { dashboardRoutes } from './dashboard'
import { widgetsRoutes } from './widgets'
import { ClassRoutes } from './class'
import { MessageRoutes } from './message'
import { AccountRoutes } from './account'

/**
 * 导出所有模块化路由
 */
export const routeModules: AppRouteRecord[] = [
  dashboardRoutes,
  widgetsRoutes,
  ClassRoutes,
  MessageRoutes,
  AccountRoutes,
]
