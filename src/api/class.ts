import request from '@/utils/http'
import axios from 'axios'
const { VITE_API_URL, VITE_WITH_CREDENTIALS } = import.meta.env

/**
 * 获取模板
 * @param token 令牌
 * @returns file
 */
export function fetchTemplate(token: string) {
  return axios({
    url: `${import.meta.env.VITE_API_URL}class/downloadTemplate`,
    method: 'GET',
    responseType: 'blob',
    headers: { Authorization: token }, // 传token
    withCredentials: import.meta.env.VITE_WITH_CREDENTIALS === 'true'
  }).then(res => res.data)
}

/**
 * 退出登录
 * @param string token 用户令牌
 * @returns 退出登录响应
 */
export function fetchGetClassList(token: string, params: GetClassListParams) {
  return request.get<void>({
    url: '/class/query',
    params,
    headers: {
      'Authorization': token
    },
    showSuccessMessage: true,
    showErrorMessage: true,
  })
}