<template>
    <div class="w-full mb-6">
        <ElCard shadow="hover" class="rounded-lg overflow-hidden px-3">
            <div class="flex flex-col gap-3">
                <h1 class="text-xl font-bold flex items-center gap-3">
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
                        <h3 class="text-lg font-semibold mb-4 flex items-center gap-2">
                            <el-icon class="text-gray-500">
                                <InfoFilled />
                            </el-icon>
                            基础信息
                        </h3>

                        <div class="space-y-4">
                            <div class="flex items-start">
                                <span class="w-24 text-gray-500 font-medium">用户名：</span>
                                <span class="flex-1">{{ userInfo.username || '-' }}</span>
                            </div>

                            <div class="flex items-start">
                                <span class="w-24 text-gray-500 font-medium">学院：</span>
                                <span class="flex-1 ">{{ userInfo.department || '-' }}</span>
                            </div>

                            <div class="flex items-start">
                                <span class="w-24 text-gray-500 font-medium">权限：</span>
                                <el-tag v-if="userInfo.role === 'teacher'" type="success">辅导员</el-tag>
                                <el-tag v-if="userInfo.role === 'college_admin'" type="warning">学院管理员</el-tag>
                                <el-tag v-if="userInfo.role === 'admin'" type="danger">学校管理员</el-tag>
                            </div>

                            <div class="flex items-start">
                                <span class="w-24 text-gray-500 font-medium">手机号码：</span>
                                <span class="flex-1 ">{{ userInfo.phone || '-' }}</span>
                            </div>

                            <div class="flex items-start">
                                <span class="w-24 text-gray-500 font-medium">电子邮箱：</span>
                                <span class="flex-1 truncate" :title="userInfo.email">
                                    {{ userInfo.email || '-' }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ElCard>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/modules/user'
import { User, InfoFilled } from '@element-plus/icons-vue'

const userStore = useUserStore()
const userInfo = userStore.getUserInfo

console.log(userInfo)
</script>
