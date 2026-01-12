import request from '@/utils/http'
import axios from 'axios'

export function fetchGetCollegeList() {
    return request.get<Array<collegeInfo>>({
      url: `/college/colleges`,
      showErrorMessage: true,
    })
  }