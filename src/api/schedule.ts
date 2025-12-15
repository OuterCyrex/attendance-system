import request from '@/utils/http'
import axios from 'axios'

/**
 * 获取模板
 * @param token 令牌
 * @returns file
 */
export function fetchTemplate(token: string) {
  return axios({
    url: `${import.meta.env.VITE_API_URL}courseSchedule/downloadTemplate`,
    method: 'GET',
    responseType: 'blob',
    headers: { Authorization: 'Bearer ' + token },
    withCredentials: import.meta.env.VITE_WITH_CREDENTIALS === 'true'
  }).then(res => res.data)
}

/**
 * 退出登录
 * @param string token 用户令牌
 * @param params 参数
 * @returns 退出登录响应
 */
export function fetchGetScheduleList(token: string, params: GetScheduleListParams) {
  return request.get<void>({
    url: '/courseSchedule/query',
    params,
    headers: {
      'Authorization': 'Bearer ' + token
    },
    showErrorMessage: true,
  })
}

/**
 * 导入excel
 * @param string token 用户令牌
 * @param file 文件
 * @returns 导入响应
 */
export function fetchImportSchedule(token: string, file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return request.request({
    url: `/courseSchedule/import`,
    method: 'post',
    data: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })
}