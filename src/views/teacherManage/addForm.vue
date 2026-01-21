<template>
    <el-dialog v-model="localDialogVisible" title="新增教师" width="600px" @closed="handleCancel">
        <el-form ref="formRef" :model="formData" :rules="rules" label-width="100px" autocomplete="off">

            <el-form-item label="教师工号" prop="teacherNo">
                <el-input v-model="formData.teacherNo" placeholder="请输入教师工号" />
            </el-form-item>

            <!--这里是防止浏览器自动填充-->
            <div style="position: absolute; top: -9999px; left: -9999px; opacity: 0;">
                <input type="text" name="fake-username" id="fake-username" autocomplete="off" />
                <input type="password" name="fake-password" id="fake-password" autocomplete="new-password" />
            </div>

            <el-form-item label="用户名称" prop="username" autocomplete="off">
                <el-input v-model="formData.username" placeholder="请输入用户名称" />
            </el-form-item>

            <el-form-item label="登录密码" prop="password" autocomplete="off" >
                <el-input v-model="formData.password" disabled placeholder="修改请输入新密码" />
            </el-form-item>

            <el-form-item label="真实姓名" prop="realName">
                <el-input v-model="formData.realName" placeholder="请输入真实姓名" />
            </el-form-item>

            <el-form-item v-if="currentUserInfo.role === 'admin'" label="所属部门" prop="department">
                <el-select v-model="formData.department" class="w-full" placeholder="请选择部门">
                    <el-option v-for="(item, index) in departmentOption" :key="index" :label="item.name"
                        :value="item.name" />
                </el-select>
            </el-form-item>

            <el-form-item label="联系电话" prop="phone">
                <el-input v-model="formData.phone" placeholder="请输入联系电话" />
            </el-form-item>

            <el-form-item label="电子邮箱" prop="email">
                <el-input v-model="formData.email" placeholder="请输入电子邮箱" />
            </el-form-item>

            <el-form-item label="启用状态" prop="status">
                <el-switch v-model="formData.status" :active-value="1" :inactive-value="0" />
            </el-form-item>

            <el-form-item label="邮箱通知" prop="enableEmailNotification">
                <el-switch v-model="formData.enableEmailNotification" :active-value="1" :inactive-value="0" />
            </el-form-item>

            <el-form-item label="通知阈值" prop="attendanceThreshold">
                <el-input-number v-model="formData.attendanceThreshold" :step="0.1" :max="1" :min="0" />
            </el-form-item>
        </el-form>

        <template #footer>
            <el-button @click="handleCancel">取消</el-button>
            <el-button type="primary" @click="handleSubmit">保存修改</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useUserStore } from '@/store/modules/user'
import type { FormInstance, FormRules } from 'element-plus'
import { fetchAddTeacher } from '@/api/teacherMange';
import { fetchGetCollegeList } from '@/api/misc';

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'submit'): void
}>()

const props = defineProps<{
    departmentOption?: Array<Api.Misc.collegeInfo>
}>()

const localDialogVisible = ref(true)
const userStore = useUserStore()
const { getUserInfo: currentUserInfo } = userStore

const formRef = ref<FormInstance>()
const defaultForm = {
    username: '',
    password: '123456',
    realName: '',
    teacherNo: '',
    phone: '',
    email: '',
    department: '',
    status: 0,
    attendanceThreshold: 0,
    enableEmailNotification: 0,
    collegeNo: ''
}
const formData = reactive(JSON.parse(JSON.stringify(defaultForm)));

const rules: FormRules = {
    teacherNo: [{ required: true, message: '请输入教师工号', trigger: 'blur' }],
    username: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
    department: [{ required: true, message: '请选择部门', trigger: 'change' }],
    realName: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
    phone: [{ required: true, message: '请输入电话', trigger: 'blur' }],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { type: 'email', message: '请输入合法的邮箱格式', trigger: 'blur' }
    ],
    password: [{ required: false, message: '请输入密码', trigger: 'blur' }]
}
const departmentOption = ref<Array<Api.Misc.collegeInfo>>([])

const handleCancel = () => {
    if (formRef.value) {
        formRef.value.clearValidate()
    }
    Object.assign(formData, { ...defaultForm })
    emit('close')
}

const handleSubmit = async () => {
    if (!formRef.value) return

    try {
        await formRef.value.validate()
    } catch (error) {
        console.error('表单校验失败：', error)
        return
    }

    if (currentUserInfo.role === 'college_admin') {
        formData.collegeNo = currentUserInfo.collegeNo
    }

    fetchAddTeacher(formData).then(() => {
        handleCancel()
        emit('submit')
    })
}

const getDepartmentOption = async () => {
    let result = await fetchGetCollegeList()
    departmentOption.value = result
}

onMounted(() => {
    Object.assign(formData, { ...defaultForm })
    getDepartmentOption()
})
</script>