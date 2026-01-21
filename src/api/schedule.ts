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
export function fetchGetScheduleList(params: Api.Schedule.GetScheduleListParams) {
  return request.post<any>({
    url: '/courseSchedule/query',
    data: params,
    showErrorMessage: true
  })
}

export function fetchGetScheduleListByCourse(token: string, params: any) {
  return request.post<any>({
    url: '/courseSchedule/queryByClass',
    data: params
  })
}

/**
 * 导入excel
 * @param string token 用户令牌
 * @param file 文件
 * @returns 导入响应
 */
export function fetchImportSchedule(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return request.post({
    url: `/courseSchedule/import`,
    data: formData,
  })
}

export function fetchAddSechedule(teacherNo: string, params: any) {
  return request.post({
    url: '/courseSchedule/add',
    params: { ...params, teacherNo },
    showErrorMessage: true,
    showSuccessMessage: true
  })
}

export function fetchImportClass(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return request.post({
    url: '/courseSchedule/import',
    data: formData,
    showSuccessMessage: true,
    showErrorMessage: true
  })
}

export function fetchUpdateSchedule(id: string, params: Api.Schedule.updateClassParams) {
  return request.put<void>({
    url: `/courseSchedule/update/${id}`,
    params,
    showSuccessMessage: true,
    showErrorMessage: true,
  })
}

export function fetchDeleteSchedule(id: string) {
  return request.del<void>({
    url: `courseSchedule/delete/${id}`,
    showSuccessMessage: true,
    showErrorMessage: true,
  })
}

export function fetchGetSchedule(id: string) {
  return request.get<Api.Schedule.scheduleInfo>({
    url: `courseSchedule/get/${id}`,
    showErrorMessage: true,
  })
}