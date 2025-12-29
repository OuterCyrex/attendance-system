<template>
    <div class="w-full mb-6">

        <el-card class="box-card shadow-sm rounded-lg border-none" :body-style="{ padding: '20px' }">

            <template #header>
                <div class="flex justify-between items-center">

                    <div class="flex items-center gap-4">

                        <div class="flex flex-col">
                            <div class="flex items-center gap-2">
                                <span class="text-lg font-bold text-gray-800">{{ userInfo.realName }}</span>
                                <el-tag type="primary">{{ userInfo.department || '未分配部门' }}</el-tag>
                            </div>
                            <span class="text-sm text-gray-400 mt-1">
                                工号: <span class="text-sm text-gray-400">{{ userInfo.teacherNo }}</span>
                            </span>
                        </div>
                    </div>

                    <el-button type="primary" plain :icon="Edit" @click="handleEdit">
                        修改信息
                    </el-button>
                </div>
            </template>

            <el-descriptions :column="4" border class="mt-2">

                <el-descriptions-item label="用户名" label-class-name="bg-gray-50 font-bold text-gray-600">
                    {{ userInfo.username }}
                </el-descriptions-item>

                <el-descriptions-item label="手机号码" label-class-name="bg-gray-50 font-bold text-gray-600">
                    {{ userInfo.phone }}
                </el-descriptions-item>

                <el-descriptions-item label="电子邮箱" label-class-name="bg-gray-50 font-bold text-gray-600">
                    <span class="truncate max-w-[150px] inline-block" :title="userInfo.email">{{ userInfo.email
                        }}</span>
                </el-descriptions-item>

                <el-descriptions-item label="账号状态" label-class-name="bg-gray-50 font-bold text-gray-600">
                    <div class="flex items-center gap-1.5">
                        <el-tag size="small" :type="userInfo.status === 1 ? 'success' : 'info'">{{ userInfo.status === 1
                            ?
                            '正常' : '禁用'
                        }}</el-tag>
                    </div>
                </el-descriptions-item>

                <el-descriptions-item label="最后登录" :span="2" label-class-name="bg-gray-50 font-bold text-gray-600">
                    <span class="font-mono text-gray-600">{{ userInfo.lastLoginTime || '尚未登录' }}</span>
                </el-descriptions-item>

                <el-descriptions-item label="备注说明" :span="2" label-class-name="bg-gray-50 font-bold text-gray-600">
                    <span class="text-gray-500">{{ userInfo.remark || '暂无备注信息...' }}</span>
                </el-descriptions-item>

            </el-descriptions>
        </el-card>



        <teacherEditDialog v-model:visible="showEditDialog" :form-data="userInfo" :user-info="userInfo"
            @submit="handleSuccess" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Edit, Bottom } from '@element-plus/icons-vue'
import teacherEditDialog from './teacherEditDialog.vue'

// 状态控制
const showEditDialog = ref(false)

// 你的用户数据
const userInfo = ref({
    teacherNo: "T20238812",
    username: "wang_math",
    realName: "王伟",
    department: "数学教研组",
    phone: "13812345678",
    email: "wangwei@highschool.edu.cn",
    remark: "备注信息..."
})

// 打开弹窗
const handleEdit = () => {
    showEditDialog.value = true
}

// 保存成功后的回调
const handleSuccess = () => {
    console.log('子组件保存成功了，我可以刷新页面数据了')
    // 这里通常调用 api.getUserInfo() 刷新页面
}
</script>