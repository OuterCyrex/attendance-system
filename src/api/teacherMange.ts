import request from '@/utils/http'
import axios from 'axios'
const { VITE_API_URL, VITE_WITH_CREDENTIALS } = import.meta.env

export const fetchGetTeacherList = () => {
    return request.get<any>({
        url: '/teacher/teachers'
    })
}