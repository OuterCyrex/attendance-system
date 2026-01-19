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
    headers: { Authorization: 'Bearer ' + token },
    withCredentials: import.meta.env.VITE_WITH_CREDENTIALS === 'true'
  }).then(res => res.data)
}

/**
 * 退出登录
 * @param string token 用户令牌
 * @returns 退出登录响应
 */
export function fetchGetClassList(params: GetClassListParams) {
  return request.post<any>({
    url: '/class/query',
    params: params,
    showErrorMessage: true,
  })
}

/**
 * 导入excel
 * @param string token 用户令牌
 * @param file 文件
 * @returns 导入响应
 */
export function fetchImportClass(token: string, file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return request.request({
    url: `/class/import`,
    method: 'post',
    data: formData,
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })
}

/**
 * 手动添加班级
 * @param token 令牌
 * @param params 班级参数
 * @returns 添加响应
 */
export function fetchAddClass(token: string, teacherNo: string,  params: classInfo) {
  return request.post<void>({
    url: '/class/add',
    data: {...params, teacherNo},
    headers: {
      'Authorization': 'Bearer ' + token
    },
    showSuccessMessage: true,
    showErrorMessage: true,
  })
}

/**
 * 删除班级
 * @param token 令牌
 * @param string 班级名称
 * @returns 删除响应
 */
export function fetchDeleteClass(token: string, id: string) {
  return request.del<void>({
    url: `/class/delete/${id}`,
    headers: {
      'Authorization': 'Bearer ' + token
    },
    showSuccessMessage: true,
    showErrorMessage: true,
  })
}

/**
 * 更新班级
 * @param token 令牌
 * @param id 课程id
 * @param params 班级信息
 * @returns 响应
 */
export function fetchUpdateClass(token: string, id: string, params: classInfo) {
  return request.put<void>({
    url: `/class/update/${id}`,
    params,
    headers: {
      'Authorization': 'Bearer ' + token
    },
    showSuccessMessage: true,
    showErrorMessage: true,
  })
}

export function fetchClassDetail(id:string) {
  return request.get<any>({
    url:`/class/get/${id}`
  })
}