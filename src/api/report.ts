import http from '@/utils/http'

export const fetchQueryAttendanceReport = (params: any) => {
    return http.post<any>({
        url: '/attendance/queryAttendanceReport',
        data: params
    })
}

export const fetchAttendanceReportExcel = (params: any) => {
    return http.post<Blob>({
        url: '/attendance/exportAttendanceReport',
        data: params,
        headers: {
            'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Type': 'application/json'
        },
        responseType: 'blob',
        showSuccessMessage: true
    })
}


