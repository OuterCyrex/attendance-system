<template>
    <el-dialog v-model="localDialogVisible" title="编辑教师" width="600px" @closed="handleCancel">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">

            <el-form-item label="教师工号" prop="teacherNo">
                <el-input v-model="form.teacherNo" placeholder="请输入教师工号" />
            </el-form-item>

            <el-form-item label="用户名称" prop="username">
                <el-input v-model="form.username" placeholder="请输入用户名称" />
            </el-form-item>

            <el-form-item label="真实姓名" prop="realName">
                <el-input v-model="form.realName" placeholder="请输入真实姓名" />
            </el-form-item>

            <el-form-item v-if="userInfo.role === 'admin'" label="所属部门" prop="department">
                <el-select v-model="form.department" class="w-full" placeholder="请选择部门">
                    <el-option v-for="(item, index) in departmentOption" :key="index" :label="item.name"
                        :value="item.name" />
                </el-select>
            </el-form-item>

            <el-form-item label="联系电话" prop="phone">
                <el-input v-model="form.phone" placeholder="请输入联系电话" />
            </el-form-item>

            <el-form-item label="电子邮箱" prop="email">
                <el-input v-model="form.email" placeholder="请输入电子邮箱" />
            </el-form-item>

            <el-form-item label="启用状态" prop="status">
                <el-switch v-model="form.status" :active-value="1" :inactive-value="0"/>
            </el-form-item>

            <el-form-item label="邮箱通知" prop="enableEmailNotification">
                <el-switch v-model="form.enableEmailNotification" :active-value="1" :inactive-value="0"/>
            </el-form-item>

            <el-form-item label="通知阈值" prop="attendanceThreshold">
                <el-input-number v-model="form.attendanceThreshold" :step="0.1" :max="1" :min="0" />
            </el-form-item>
        </el-form>

        <template #footer>
            <el-button @click="handleCancel">取消</el-button>
            <el-button type="primary" @click="handleSubmit">保存修改</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useUserStore } from '@/store/modules/user'
import type { FormInstance, FormRules } from 'element-plus'
import { fetchUpdateTeacher } from '@/api/teacherMange';

const props = defineProps<{
    id: string,
    formData?: updateTeacherParams
    departmentOption?: Array<collegeInfo>
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'submit'): void
}>()

const localDialogVisible = ref(true)
const userStore = useUserStore()
const { getUserInfo: userInfo } = userStore

const formRef = ref<FormInstance>()
const defaultForm: updateTeacherParams = {
    username: '',
    realname: '',
    teacherNo: '',
    phone: '',
    email: '',
    department: '',
    status: 0,
    attendanceThreshold: 0,
    enableEmailNotification: false
}
const form = reactive<updateTeacherParams>({ ...defaultForm })

const rules: FormRules = {
    username: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
    department: [{ required: true, message: '请选择部门', trigger: 'change' }],
    realname: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
    phone: [{ required: true, message: '请输入电话', trigger: 'blur' }],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入合法的邮箱格式', trigger: 'blur' }
    ],
    password: [{ required: false, message: '请输入密码', trigger: 'blur' }]
}

onMounted(() => {
    if (!props.id) {
        emit('close')
        return
    }
    Object.assign(form, { ...defaultForm, ...props.formData })
})

const handleCancel = () => {
    if (formRef.value) {
        formRef.value.clearValidate()
    }
    Object.assign(form, { ...defaultForm })
    emit('close')
}

const handleSubmit = async () => {
    if (!formRef.value) return
    if (!props.id) {
        return
    }

    try {
        await formRef.value.validate()
    } catch (error) {
        console.error('表单校验失败：', error)
        return
    }

    const data = {
        username:  form.username,
        realName:  form.realName,
        teacherNo:  form.teacherNo,
        phone:  form.phone,
        email:  form.email,
        department:  form.department,
        status: form.status,
        attendanceThreshold: form.attendanceThreshold,
        enableEmailNotification: form.enableEmailNotification === 1
    }

    fetchUpdateTeacher(props.id, data).then(() => {
        handleCancel()
        emit('submit')
    })
}
</script>