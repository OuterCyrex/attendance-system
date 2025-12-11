import request from '@/utils/http'

/**
 * 登录
 * @param params 登录参数
 * @returns 登录响应
 */
export function fetchLogin(params: Api.Auth.LoginParams) {
  return request.post<Api.Auth.LoginResponse>({
    url: '/front/login',
    params,
    showSuccessMessage: true,
    showErrorMessage: true,
  })
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
