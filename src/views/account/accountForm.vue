<template>
    <el-dialog v-model="dialogVisible" title="编辑个人信息" width="500px" :before-close="handleClose">
        <el-form :model="updateUserInfo" :rules="rules" ref="formRef" label-width="100px">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="updateUserInfo.username" />
            </el-form-item>

            <el-form-item label="真实姓名" prop="realName">
                <el-input v-model="updateUserInfo.realName" disabled />
            </el-form-item>

            <el-form-item label="工号" prop="teacherNo" v-if="userInfo.role === 'teacher'">
                <el-input v-model="updateUserInfo.teacherNo" disabled />
            </el-form-item>

            <el-form-item label="手机号码" prop="phone">
                <el-input v-model="updateUserInfo.phone" placeholder="请输入手机号码" />
            </el-form-item>

            <el-form-item label="电子邮箱" prop="email">
                <el-input v-model="updateUserInfo.email" placeholder="请输入电子邮箱" />
            </el-form-item>

            <el-form-item label="状态" prop="status">
                <el-tag :type="updateUserInfo.status === 1 ? 'success' : 'danger'">{{ updateUserInfo.status === 1 ?
                    '正常' :
                    '禁用' }}</el-tag>
            </el-form-item>

            <el-form-item label="学院" prop="department" v-if="userInfo.role !== 'admin'">
                <el-input v-model="updateUserInfo.collegeName" disabled />
            </el-form-item>

            <el-form-item label="考勤阈值" prop="attendanceThreshold" v-if="userInfo.role === 'teacher'">
                <el-tag type="primary">{{ updateUserInfo.attendanceThreshold }}</el-tag>
            </el-form-item>

            <el-form-item label="开启邮箱通知" prop="enableEmailNotification" v-if="userInfo.role === 'teacher'">
                <el-switch v-model="updateUserInfo.enableEmailNotification" active-text="开启" inactive-text="关闭"
                    :active-value="true" :inactive-value="false" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="handleUpdateInfo">保存</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useUserStore } from '@/store/modules/user'
import { fetchUpdateSelf } from '@/api/teacherMange';

const props = defineProps<{
    modelValue: boolean
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', val: boolean): null
}>()

const userStore = useUserStore()

const updateUserInfo = ref<Api.Auth.updateSelfParams>({
    username: '',
    realName: '',
    password: '',
    teacherNo: '',
    phone: '',
    email: '',
    status: 0,
    collegeName: '',
    attendanceThreshold: 0,
    enableEmailNotification: false
})
const dialogVisible = ref(props.modelValue)
const { getUserInfo: userInfo } = useUserStore()
const handleFillInfo = () => {
    updateUserInfo.value.username = userInfo.username!
    updateUserInfo.value.realName = userInfo.realName!
    updateUserInfo.value.teacherNo = userInfo.teacherNo!
    updateUserInfo.value.phone = userInfo.phone!
    updateUserInfo.value.email = userInfo.email!
    updateUserInfo.value.status = userInfo.status!
    updateUserInfo.value.collegeName = userInfo.collegeName!
    updateUserInfo.value.attendanceThreshold = userInfo.attendanceThreshold!
    updateUserInfo.value.enableEmailNotification = userInfo.enableEmailNotification!
}

const rules = {
    phone: [
        { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
    ],
    email: [
        { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: '请输入正确的邮箱格式', trigger: 'blur' }
    ]
}


watch(() => props.modelValue, (newVal) => {
    dialogVisible.value = newVal
    if (newVal) {
        handleFillInfo()
    }
})

watch(dialogVisible, (newVal) => {
    emit('update:modelValue', newVal)
})

const handleUpdateInfo = async () => {
    await fetchUpdateSelf(updateUserInfo.value).then(() => {
        dialogVisible.value = false
        userStore.setUserInfo({
            ...updateUserInfo.value,
            role: userInfo.role!,
            remark: userInfo.remark!,
            lastLoginTime: userInfo.lastLoginTime!,
            collegeNo: userInfo.collegeNo!,
            id: userInfo.id!
        })
    })
}

const cancel = () => {
    dialogVisible.value = false
}

const handleClose = (done: () => void) => {
    cancel()
    done()
}

</script>