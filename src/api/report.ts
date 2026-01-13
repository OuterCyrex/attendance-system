import http from '@/utils/http'
import { ApiResponse, PageResponse, AttendanceRecord } from '@/types/report'

// 查询考勤报表
export const fetchQueryAttendanceReport = (params: any) => {
    return http.post<ApiResponse<PageResponse<AttendanceRecord>>>({
        url: '/attendance/queryAttendanceReport',
        data: params
    })
}

// 新增：导出考勤报表Excel接口
export const fetchAttendanceReportExcel = (params: any) => {
    return http.post<Blob>({
        url: '/attendance/exportAttendanceReport',
        data: params,
        headers: {
            'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Type': 'application/json'
        },
        responseType: 'blob'
    })
}

/* 暂时先放这里下面这些接口，后面再换位置 */

export const fetchSemesterList = () => {
    return http.get({
        url: '/semester/list',
    })
}

export const fetchOrderList = () => {
    return http.get({
        url:'/courseSchedule/getAllClassNumbers'
    })
}
