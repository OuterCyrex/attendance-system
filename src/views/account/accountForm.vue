<template>
    <el-dialog v-model="dialogVisible" title="编辑个人信息" width="500px" :before-close="handleClose">
        <el-form :model="localUserInfo" :rules="rules" ref="formRef" label-width="100px">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="localUserInfo.username" />
            </el-form-item>

            <el-form-item label="真实姓名" prop="realName">
                <el-input v-model="localUserInfo.realName" disabled />
            </el-form-item>

            <el-form-item label="工号" prop="teacherNo">
                <el-input v-model="localUserInfo.teacherNo" disabled />
            </el-form-item>

            <el-form-item label="手机号码" prop="phone">
                <el-input v-model="localUserInfo.phone" placeholder="请输入手机号码" />
            </el-form-item>

            <el-form-item label="电子邮箱" prop="email">
                <el-input v-model="localUserInfo.email" placeholder="请输入电子邮箱" />
            </el-form-item>

            <el-form-item label="状态" prop="status">
                <el-tag :type="localUserInfo.status === 1 ? 'success' : 'danger'">{{ localUserInfo.status === 1 ?
                    '正常' :
                    '禁用' }}</el-tag>
            </el-form-item>

            <el-form-item label="学院" prop="department">
                <el-input v-model="localUserInfo.department" disabled />
            </el-form-item>

            <el-form-item label="考勤阈值" prop="attendanceThreshold" v-if="userStore.isTeacher">
                <el-tag type="primary">{{ localUserInfo.attendanceThreshold }}</el-tag>
            </el-form-item>

            <el-form-item label="开启邮箱通知" prop="enableEmailNotification" v-if="userStore.isTeacher">
                <el-switch v-model="localUserInfo.enableEmailNotification" active-text="开启" inactive-text="关闭"
                    :active-value="true" :inactive-value="false" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" @click="save">保存</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { PropType, ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/modules/user'

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    },
    userInfo: {
        type: Object as PropType<Api.Auth.userInfo>,
        required: true
    }

})

const emit = defineEmits(['update:modelValue', 'save'])
const localUserInfo = ref({ ...props.userInfo })
const dialogVisible = ref(props.modelValue)
const userStore = useUserStore()

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
        localUserInfo.value = { ...props.userInfo }
        console.log("数据：", localUserInfo.value)
    }
})

watch(dialogVisible, (newVal) => {
    emit('update:modelValue', newVal)
})

const save = () => {
    emit('save', localUserInfo.value)
    dialogVisible.value = false
}

const cancel = () => {
    dialogVisible.value = false
}

const handleClose = (done: () => void) => {
    cancel()
    done()
}

</script>