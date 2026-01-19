import request from '@/utils/http'

export const fetchGetClassChart = (params: Api.Chart.getClassChartParams) => {
    return request.post<any>({
        url: '/attendance/queryAttendanceChartByClass',
        data: params,
        showErrorMessage: true,
        showSuccessMessage: true
    })
}

export const fetchGetCourseChart = (params: Api.Chart.getCourseChartParams) => {
    return request.post<any>({
        url: '/attendance/queryAttendanceChartByCourse',
        data: params,
        showErrorMessage: true,
        showSuccessMessage: true
    })
}