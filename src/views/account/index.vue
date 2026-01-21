<template>
    <div class="w-full mb-6">
        <ElCard shadow="hover" class="rounded-lg overflow-hidden px-3">
            <div class="flex flex-col gap-3">
                <h1 class="text-xl font-bold text-gray-800 flex items-center gap-3">
                    <el-icon class="text-blue-500">
                        <User />
                    </el-icon>
                    {{ userInfo.realName }}
                </h1>
                <div class="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span>工号: </span>
                    <span>{{ userInfo.teacherNo || userInfo.id }}</span>
                </div>
            </div>
        </ElCard>
        <ElCard shadow="never" class="mt-4">
            <div class="px-2 py-2">
                <div class="space-y-6">
                    <div class="rounded-lg p-3">
                        <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center justify-between">
                            <div class="flex items-center gap-2">
                                <el-icon class="text-gray-500">
                                    <InfoFilled />
                                </el-icon>
                                基础信息
                            </div>
                            <div class="flex gap-1">
                                <el-button type="primary" size="small" @click="isShow = true">编辑</el-button>
                                <el-button type="primary" size="small" @click="isVisible = true">修改密码</el-button>
                            </div>
                        </h3>

                        <div class="space-y-4">
                            <div class="flex items-start">
                                <span class="w-24 text-gray-500 font-medium">用户名：</span>
                                <span class="flex-1 text-gray-800">{{ userInfo.username || '-' }}</span>
                            </div>

                            <div class="flex items-start">
                                <span class="w-24 text-gray-500 font-medium">学院：</span>
                                <span class="flex-1 text-gray-800">{{ userInfo.department || '-' }}</span>
                            </div>

                            <div class="flex items-start">
                                <span class="w-24 text-gray-500 font-medium">权限：</span>
                                <el-tag v-if="userInfo.role === 'teacher'" type="success">辅导员</el-tag>
                                <el-tag v-if="userInfo.role === 'college_admin'" type="warning">学院管理员</el-tag>
                                <el-tag v-if="userInfo.role === 'admin'" type="danger">学校管理员</el-tag>
                            </div>

                            <div class="flex items-start">
                                <span class="w-24 text-gray-500 font-medium">手机号码：</span>
                                <span class="flex-1 text-gray-800">{{ userInfo.phone || '-' }}</span>
                            </div>

                            <div class="flex items-start">
                                <span class="w-24 text-gray-500 font-medium">电子邮箱：</span>
                                <span class="flex-1 text-gray-800 truncate" :title="userInfo.email">
                                    {{ userInfo.email || '-' }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ElCard>
        <div class="form-containers">
            <accountForm v-model="isShow" :userInfo="userInfo" @save="handleSave" />
            <passwordForm v-model="isVisible" @save="editPassword" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/modules/user'
import { User, InfoFilled } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { fetchEditSelfInfo } from '@/api/account'
import accountForm from './accountForm.vue'
import passwordForm from './passwordForm.vue'
import { fetchLogout } from '@/api/auth'

const userStore = useUserStore()
const { getToken: token } = userStore
const { getUserInfo: userInfo } = storeToRefs(userStore)
const isShow = ref(false)
const isVisible = ref(false)
const allowedFields = [
    'username',
    'realName',
    'teacherNo',
    'phone',
    'email',
    'status',
    'department',
    'attendanceThreshold',
    'enableEmailNotification'
]
const router = useRouter()


const handleSave = async (params: Api.Auth.userInfo) => {
    const filteredParams: Partial<Api.Auth.userInfo> = {};
    for (const key of allowedFields) {
        const value = params[key];
        filteredParams[key] = value;
    }
    await fetchEditSelfInfo(filteredParams);

    const updatedUserInfo = { ...userStore.getUserInfo, ...filteredParams };
    userStore.setUserInfo(updatedUserInfo);

    isShow.value = false;
    ElMessage.success('修改成功');
}

const editPassword = async (data: { password: string }) => {
    const { password } = data

    const params = {
        username: userInfo.value.username,
        realName: userInfo.value.realName,
        teacherNo: userInfo.value.teacherNo,
        password: password
    }

    await fetchEditSelfInfo(params);
    if (token) {
        await fetchLogout(token)
    }
    isShow.value = false;
    userStore.logOut()
    ElMessage.success('修改成功');
}

console.log(userInfo)
</script>
