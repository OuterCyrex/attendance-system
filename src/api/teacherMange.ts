import request from '@/utils/http'
import axios from 'axios'
const { VITE_API_URL, VITE_WITH_CREDENTIALS } = import.meta.env

export const fetchGetTeacherList = (param: queryTeacherParams) => {
    return request.post<any>({
        data: param,
        url: '/teacher/teachers/query'
    })
}

export const fetchUpdateTeacher = (id: string, param: updateTeacherParams) => {
    return request.put<void>({
        data: param,
        url: `/teacher/teachers/${id}`,
        showSuccessMessage: true,
        showErrorMessage: true
    })
}

export const fetchAddTeacher = (param: addTeacherParams) => {
    return request.post<void>({
        data: param,
        params: {collegeNo: param.collegeNo},
        url: `/teacher/teachers`,
        showSuccessMessage: true,
        showErrorMessage: true
    })
}