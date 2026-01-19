import request from '@/utils/http'
import axios from 'axios'
const { VITE_API_URL, VITE_WITH_CREDENTIALS } = import.meta.env

export const fetchGetTeacherList = (param: Api.Teacher.queryTeacherParams) => {
    return request.post<any>({
        data: param,
        url: '/teacher/teachers/query'
    })
}

export const fetchUpdateTeacher = (id: string, param: Api.Teacher.updateTeacherParams) => {
    return request.put<void>({
        data: param,
        url: `/teacher/teachers/${id}`,
        showSuccessMessage: true,
        showErrorMessage: true
    })
}

export const fetchAddTeacher = (param: Api.Teacher.addTeacherParams) => {
    return request.post<void>({
        data: param,
        params: {collegeNo: param.collegeNo},
        url: `/teacher/teachers`,
        showSuccessMessage: true,
        showErrorMessage: true
    })
}

export const fetchDeleteTeacher = (id: string) => {
    return request.del<void>({
        url: `/teacher/teachers/${id}`,
        showSuccessMessage: true,
        showErrorMessage: true
    })
}

/**
 * 获取模板
 * @param token 令牌
 * @returns file
 */
export function fetchTeacherTemplate(token: string) {
    return axios({
      url: `${import.meta.env.VITE_API_URL}teacher/downloadTemplate`,
      method: 'GET',
      responseType: 'blob',
      headers: { Authorization: 'Bearer ' + token },
      withCredentials: import.meta.env.VITE_WITH_CREDENTIALS === 'true'
    }).then(res => res.data)
  }

  /**
 * 导入excel
 * @param string token 用户令牌
 * @param file 文件
 * @returns 导入响应
 */
export function fetchImportTeacher(token: string, file: File) {
    const formData = new FormData()
    formData.append('file', file)
    return request.request({
      url: `/teacher/import`,
      method: 'post',
      data: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })
  }