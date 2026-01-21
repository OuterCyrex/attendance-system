import request from '@/utils/http'

export function fetchEditSelfInfo(userInfo: Api.Auth.updateSelfParams) {
    return request.put({
        url: '/teacher/profile',
        data:userInfo,
        showErrorMessage: true,
        showSuccessMessage: true
    });
}