<template>
    <el-dialog v-model="dialogVisible" :title="titleMap[mode]" width="500px" :close-on-click-modal="false">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="班级名称" prop="className">
                <el-input v-model="form.className" placeholder="请输入班级名称"/>
            </el-form-item>

            <el-form-item label="年级" prop="grade">
                <el-select v-model="form.grade" class="w-full" placeholder="请选择年级">
                    <el-option v-for="item in gradeOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>

            <el-form-item label="专业" prop="major">
                <el-select v-model="form.major" class="w-full" placeholder="请选择专业" filterable>
                    <el-option v-for="item in majorOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>

            <el-form-item label="人数" prop="count">
                <el-input-number v-model="form.count" class="w-full" :min="1" :max="200" />
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
import { Plus, Edit } from '@element-plus/icons-vue'

export type SelectOption = {
    label: string
    value: string
}

export type SubmitClassData = classInfo & {
    id?: string | number
}

const props = withDefaults(
    defineProps<{
        visible: boolean
        mode?: 'add' | 'edit'
        id?: string | number
        formData?: Partial<classInfo>
        majorOptions: SelectOption[]
        gradeOptions: SelectOption[]
    }>(),
    {
        mode: 'add',
        formData: () => ({})
    }
)

const emit = defineEmits<{
    (e: 'update:visible', val: boolean): void
    (e: 'submit', data: SubmitClassData): void
}>()

const dialogVisible = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val)
})

const defaultForm: classInfo = {
    className: '',
    grade: '',
    major: '',
    count: 30
}

const formRef = ref<FormInstance>()
const form = reactive<classInfo>({ ...defaultForm })

const rules: FormRules = {
    className: [{ required: true, message: '请输入班级名称', trigger: 'blur' }],
    grade: [{ required: true, message: '请选择年级', trigger: 'change' }],
    major: [{ required: true, message: '请选择专业', trigger: 'change' }],
    count: [{ required: true, message: '请输入人数', trigger: 'blur' }]
}

const titleMap = {
    add: '新增班级',
    edit: '编辑班级'
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

        const submitData: SubmitClassData =
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