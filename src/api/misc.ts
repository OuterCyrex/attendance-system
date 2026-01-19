import request from '@/utils/http'
import axios from 'axios'

export function fetchGetCollegeList() {
    return request.get<Array<Api.Misc.collegeInfo>>({
      url: `/college/colleges`,
      showErrorMessage: true,
    })
  }

  export const fetchSemesterList = () => {
    return request.get<any>({
        url: '/semester/names',
    })
}

export const fetchOrderList = () => {
    return request.get<any>({
        url:'/courseSchedule/getAllClassNumbers'
    })
}