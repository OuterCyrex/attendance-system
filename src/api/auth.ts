import request from '@/utils/http'
import { useUserStore } from '@/store/modules/user'
/**
 * 登录
 * @param params 登录参数
 * @returns 登录响应
 */
export async function fetchLogin(params: Api.Auth.LoginParams) {
  const res = await request.post<Api.Auth.LoginResponse>({
    url: '/front/login',
    params,
    showSuccessMessage: true,
    showErrorMessage: true
  })

  try {
    const userStore = useUserStore()
    if (res && (res as any).userInfo) {
      userStore.setUserInfo((res as any).userInfo)
    }
  } catch {
    // ignore if store not available in this context
  }

  return res
}

/**
 * 退出登录
 * @param string token 用户令牌
 * @returns 退出登录响应
 */
export function fetchLogout(token: string) {
  return request.post<void>({
    url: '/front/logout',
    headers: {
      'Authorization': token
    },
    showSuccessMessage: true,
    showErrorMessage: true,
  })
}

