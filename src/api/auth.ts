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
 * 获取用户信息
 * @returns 用户信息
 */
export function fetchGetUserInfo(): Promise<Api.Auth.UserInfo | Partial<Api.Auth.UserInfo>> {
  const userStore = useUserStore()
  // 后端没有单独的 getUserInfo 接口，返回本地 store 中保存的用户信息
  return Promise.resolve(userStore.getUserInfo as any)
}
