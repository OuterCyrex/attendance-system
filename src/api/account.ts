import request from '@/utils/http'

export function fetchEditSelfInfo(userInfo: Api.Auth.userInfo) {
    return request.put({
        url: '/teacher/profile',
        data:userInfo
    });
}