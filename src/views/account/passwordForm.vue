<template>
    <el-dialog v-model="dialogVisible" title="修改密码" width="500px" :before-close="handleClose">
        <el-form :model="form" :rules="rules" ref="formRef" label-width="100px">
            <el-form-item label="新密码" prop="newPassword">
                <el-input v-model="form.newPassword" type="password" show-password placeholder="请输入新密码" />
            </el-form-item>

            <el-form-item label="确认新密码" prop="confirmNewPassword">
                <el-input v-model="form.confirmNewPassword" type="password" show-password placeholder="请再次输入新密码" />
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
import { ref, watch } from 'vue'
import { FormInstance, FormRules } from 'element-plus'

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: true
    }
})

const emit = defineEmits(['update:modelValue', 'save'])

const dialogVisible = ref(props.modelValue)
const formRef = ref<FormInstance>()
const form = ref({
    newPassword: '',
    confirmNewPassword: ''
})

const validateConfirmPassword = (rule: any, value: string, callback: (arg0?: Error) => void) => {
    if (value !== form.value.newPassword) {
        callback(new Error('两次输入的密码不一致'))
    } else {
        callback()
    }
}

const rules: FormRules = {
    newPassword: [
        { required: true, message: '请输入新密码', trigger: 'blur' },
        { min: 6, max: 20, message: '密码长度应在6-20个字符之间', trigger: 'blur' },
        {
            validator: () => {
                if (form.value.confirmNewPassword) {
                    formRef.value?.validateField('confirmNewPassword');
                }
                return true;
            }, trigger: 'change'
        }
    ],
    confirmNewPassword: [
        { required: true, message: '请再次输入新密码', trigger: 'blur' },
        { validator: validateConfirmPassword, trigger: 'blur' }
    ]
}

watch(() => props.modelValue, (newVal) => {
    dialogVisible.value = newVal
    if (!newVal) {
        form.value = {
            newPassword: '',
            confirmNewPassword: ''
        }
        if (formRef.value) {
            formRef.value.clearValidate()
        }
    }
})

watch(dialogVisible, (newVal) => {
    emit('update:modelValue', newVal)
})

const save = async () => {
    if (!formRef.value) return

    try {
        await formRef.value.validate()
        emit('save', {
            password: form.value.newPassword
        })
        dialogVisible.value = false
    } catch (error) {
        console.error('表单验证失败:', error)
    }
}

const cancel = () => {
    dialogVisible.value = false
}

const handleClose = (done: () => void) => {
    cancel()
    done()
}
</script>