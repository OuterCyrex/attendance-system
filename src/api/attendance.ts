import request from '@/utils/http'
import axios from 'axios'

export function fetchGetAttendanceList(token: string, courseId: string) {
    return request.get<Array<attendanceInfo>>({
        url: '/attendance/queryAttendance',
        params: {courseId},
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