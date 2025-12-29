import { AppRouteRecord } from '@/types/router'

export const MessageRoutes: AppRouteRecord = {
  path: '/message',
  name: 'message',
  component: '/message/index',
  meta: {
    title: '消息通知',
    icon: 'ri:message-2-fill',
    roles:['teacher']
  }
}