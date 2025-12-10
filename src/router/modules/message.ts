import { AppRouteRecord } from '@/types/router'

export const MessageRoutes: AppRouteRecord = {
  path: '/message',
  name: 'message',
  component: '/message/index',
  meta: {
    title: '消息通知',
    icon: 'ri:apps-2-add-line'
  }
}