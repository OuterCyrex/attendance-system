import request from '@/utils/http'
import axios from 'axios'

export function fetchGetAttendanceList(token: string, params:any) {
    return request.post<Array<attendanceInfo>>({
        url: '/attendance/queryAttendance',
        params,
        showErrorMessage: true
    })
}

export function fetchManualAttendance(token: string, courseId: string) {
    return request.get<void>({
        url: '/attendance/manualAttendance',
        params: {courseId},
        showSuccessMessage: true,
        showErrorMessage: true
    })
}

export function fetchGetAttendance(token: string, attendanceId: string) {
    return request.get<attendanceInfo>({
        url: `/attendance/get/${attendanceId}`,
        showErrorMessage: true
    })
}

export function fetchAttendanceRateByClass(classId:string) {
    return request.get<any>({
        url:`/attendance/queryAttendanceRateByClass/${classId}`
    })
}