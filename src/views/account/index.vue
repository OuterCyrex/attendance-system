<template>
    <div class="w-full mb-6">
        <el-card shadow="never" class="shadow-sm rounded-lg border-none" style="min-height: 800px">
            <template #header>
                <div class="flex justify-between items-center">
                    <div class="flex items-center gap-4">
                        <div class="flex flex-col">
                            <div class="flex items-center gap-2">
                                <span class="text-xl font-bold text-gray-800">{{ userInfo.realName }}</span>
                            </div>
                            <span class="text-sm text-gray-400 mt-2">
                                工号: <span class="text-sm text-gray-400">{{ userInfo.id }}</span>
                            </span>
                        </div>
                    </div>
                </div>
            </template>

            <el-descriptions :column="3" border class="mt-2">
                <el-descriptions-item label="用户名" label-class-name="bg-gray-50 font-bold text-gray-600">
                    {{ userInfo.username }}
                </el-descriptions-item>

                <el-descriptions-item label="手机号码" label-class-name="bg-gray-50 font-bold text-gray-600">
                    {{ userInfo.phone }}
                </el-descriptions-item>

                <el-descriptions-item label="电子邮箱" label-class-name="bg-gray-50 font-bold text-gray-600">
                    <span class="truncate inline-block" :title="userInfo.email">
                        {{ userInfo.email }}
                    </span>
                </el-descriptions-item>

                <el-descriptions-item label="角色标识" label-class-name="bg-gray-50 font-bold text-gray-600">
                    <div class="flex items-center gap-1.5">
                        <el-tag v-if="userInfo.role === 'teacher'" type="success">辅导员</el-tag>
                        <el-tag v-if="userInfo.role === 'college_admin'"  type="warning">学院管理员</el-tag>
                        <el-tag v-if="userInfo.role === 'admin'" type="danger">学校管理员</el-tag>
                    </div>
                </el-descriptions-item>

                <el-descriptions-item label="所属学院" label-class-name="bg-gray-50 font-bold text-gray-600">
                    {{ userInfo.collegeName }}
                </el-descriptions-item>

                <el-descriptions-item label="工号" label-class-name="bg-gray-50 font-bold text-gray-600">
                    {{ userInfo.id }}
                </el-descriptions-item>

                <el-descriptions-item label="备注说明" :span="3" label-class-name="bg-gray-50 font-bold text-gray-600">
                    <span class="text-gray-500">暂无备注信息...</span>
                </el-descriptions-item>
            </el-descriptions>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()
const userInfo = userStore.getUserInfo
</script>
