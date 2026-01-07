<template>
    <el-dialog v-model="dialogVisible" :title="titleMap[mode]" width="600px" :close-on-click-modal="false"
        destroy-on-close>
        <el-form ref="formRef" :model="form" :rules="rules" label-width="100px">
            <el-form-item label="用户名称" prop="username">
                <el-input v-model="form.username" placeholder="请输入用户名称" />
            </el-form-item>

            <el-form-item label="登录密码" prop="password">
                <el-input v-model="form.password" type="password" show-password placeholder="请输入登录密码" />
            </el-form-item>

            <el-form-item label="真实姓名" prop="realname">
                <el-input v-model="form.realname" placeholder="请输入真实姓名" />
            </el-form-item>

            <el-form-item label="教师工号" prop="teacherNo">
                <el-input v-model="form.teacherNo" placeholder="请输入教师工号" />
            </el-form-item>

            <el-form-item label="所属部门" prop="department">
                <el-select v-model="form.department" class="w-full" placeholder="请选择部门">
                    <el-option v-for="(item, index) in departmentOption" :key="index" :label="item.label" :value="item" />
                </el-select>
            </el-form-item>

            <el-form-item label="联系电话" prop="phone">
                <el-input v-model="form.phone" placeholder="请输入联系电话" />
            </el-form-item>

            <el-form-item label="电子邮箱" prop="email">
                <el-input v-model="form.email" placeholder="请输入电子邮箱" />
            </el-form-item>

            <el-form-item label="备注信息" prop="remark">
                <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="请输入备注内容" />
            </el-form-item>
        </el-form>

        <template #footer>
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleSubmit">
                {{ submitTextMap[mode] }}
            </el-button>
        </template>
    </el-dialog>
</template>



<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { Plus, Edit, Phone } from '@element-plus/icons-vue'

export type SelectOption = {
    label: string
    value: string
}

export type SubmitTeacherData = teacherInfo & {
    id?: string | number
}

const props = withDefaults(
    defineProps<{
        visible: boolean
        mode?: 'add' | 'edit'
        id?: string | number
        formData?: Partial<teacherInfo>
        departmentOption: String[]
    }>(),
    {
        mode: 'add',
        formData: () => ({})
    }
)

const emit = defineEmits<{
    (e: 'update:visible', val: boolean): void
    (e: 'submit', data: SubmitTeacherData): void
}>()

const dialogVisible = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val)
})

const defaultForm: teacherInfo = {
    username: '',
    password: '',
    realname: '',
    teacherNo: 0,
    phone: 0,
    email: '',
    department: '',
    remark: ''
}

const formRef = ref<FormInstance>()
const form = reactive<teacherInfo>({ ...defaultForm })

const rules: FormRules = {
    username: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    department: [{ required: true, message: '请选择部门', trigger: 'change' }],
    realname: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
    teacherNo: [{ required: true, message: '请输入教师工号', trigger: 'blur' }],
    phone: [{ required: true, message: '请输入电话', trigger: 'blur' }],
    email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
    remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
}

const titleMap = {
    add: '新增教师',
    edit: '编辑教师'
}

const submitTextMap = {
    add: '确认新增',
    edit: '保存修改'
}

watch(
    () => dialogVisible.value,
    (visible) => {
        if (!visible) return

        if (props.mode === 'edit') {
            if (!props.id) {
                console.warn('编辑模式下未传入 id')
            }

            Object.assign(form, {
                ...defaultForm,
                ...props.formData
            })
        } else {
            Object.assign(form, { ...defaultForm })
        }
    },
    { immediate: true }
)

const handleSubmit = async () => {
    if (!formRef.value) return

    await formRef.value.validate((valid) => {
        if (!valid) return

        const submitData: SubmitTeacherData =
            props.mode === 'edit'
                ? { id: props.id, ...form }
                : { ...form }

        emit('submit', submitData)
        dialogVisible.value = false
    })
}

const handleCancel = () => {
    dialogVisible.value = false
}
</script>