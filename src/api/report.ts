import http from '@/utils/http'
import { ApiResponse, PageResponse, AttendanceRecord } from '@/types/report'

// 查询考勤报表
export const fetchQueryAttendanceReport = (params: any) => {
    return http.post<ApiResponse<PageResponse<AttendanceRecord>>>({
        url: '/attendance/queryAttendanceReport',
        data: params
    })
}

// 导出考勤报表
export const fetchExportAttendanceReport = (params: any) => {
    return http.post({
        url: '/attendance/export',
        data: params,
        responseType: 'blob'
    })
}

// 新增：导出考勤报表Excel接口
export const exportAttendanceReportExcel = (params: any) => {
    return http.post({
        url: '/attendance/exportAttendanceReport',
        data: params,
        headers: {
            'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        },
        responseType: 'blob'
    })
}