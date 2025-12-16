import request from '@/utils/http'

export function fetchGetAlertList(token:string,params:any) {
    return request.post<any>({
        url: '/alert/getAlertList',
        data: params
    })
}