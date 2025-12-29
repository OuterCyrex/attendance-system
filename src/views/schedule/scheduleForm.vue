<template>
    <el-dialog v-model="dialogVisible" :title="titleMap[mode]" width="500px" :close-on-click-modal="false">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="课程号" prop="courseNo" class="flex-1">
                <el-input v-model="form.courseNo" placeholder="例如: CS101" />
            </el-form-item>

            <el-form-item label="课程名称" prop="courseName">
                <el-input v-model="form.courseName" placeholder="请输入课程名称" />
            </el-form-item>

            <el-form-item label="上课星期" prop="weekday">
                <el-select v-model="form.weekday" class="w-full" placeholder="请选择星期">
                    <el-option v-for="item in weekOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>

            <el-form-item label="周次范围" prop="weekRange" class="flex-1">
                <el-input v-model="form.weekRange" placeholder="例如: 1-16" />
            </el-form-item>

            <el-form-item label="教室" prop="classroom">
                <el-input v-model="form.classroom" placeholder="请输入上课教室" />
            </el-form-item>

            <el-form-item label="上课节次" required>
                <div class="flex items-center gap-2">
                    <el-form-item prop="startPeriod" class="mb-0">
                        <el-input-number v-model="form.startPeriod" :min="1" :max="12" placeholder="开始"
                            controls-position="right" />
                    </el-form-item>
                    <span class="text-gray-400">至</span>
                    <el-form-item prop="endPeriod" class="mb-0">
                        <el-input-number v-model="form.endPeriod" :min="form.startPeriod" :max="12" placeholder="结束"
                            controls-position="right" />
                    </el-form-item>
                    <span class="text-gray-400 text-xs ml-2">节</span>
                </div>
            </el-form-item>

            <el-form-item label="预计人数" prop="expectedCount" class="flex-1">
                <el-input-number v-model="form.expectedCount" :min="0" :max="999" controls-position="right"
                    class="w-full" />
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

export type SubmitScheduleData = scheduleInfo

const props = withDefaults(
    defineProps<{
        visible: boolean
        mode?: 'add' | 'edit'
        formData?: Partial<scheduleInfo>
        weekOptions: SelectOption[]
    }>(),
    {
        mode: 'add',
        formData: () => ({})
    }
)

const emit = defineEmits<{
    (e: 'update:visible', val: boolean): void
    (e: 'submit', data: SubmitScheduleData): void
}>()

const dialogVisible = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val)
})

const defaultForm: scheduleInfo = {
    courseNo: '',
    courseName: '',
    weekday: '',
    weekRange: '',
    startPeriod: 1,
    endPeriod: 2,
    classroom: '',
    expectedCount: 0
}

const formRef = ref<FormInstance>()
const form = reactive<scheduleInfo>({ ...defaultForm })

const rules: FormRules = {
    courseNo: [{ required: true, message: '请输入课程号', trigger: 'blur' }],
    courseName: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
    weekday: [{ required: true, message: '请选择上课星期', trigger: 'change' }],
    weekRange: [{ required: true, message: '请输入周次范围(如1-16)', trigger: 'blur' }],
    classroom: [{ required: true, message: '请输入上课教室', trigger: 'blur' }],
    startPeriod: [{ required: true, message: '必填', trigger: 'change' }],
    endPeriod: [
        { required: true, message: '必填', trigger: 'change' },
        {
            validator: (rule: any, value: any, callback: any) => {
                if (value < form.startPeriod) {
                    callback(new Error('结束节次不能小于开始节次'))
                } else {
                    callback()
                }
            },
            trigger: 'change'
        }
    ]
}

const titleMap = {
    add: '新增课程安排',
    edit: '编辑排课'
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
            props.mode === 'edit' ? { ...form, id: props.id } : { ...form }

        emit('submit', submitData)
        dialogVisible.value = false
    })
}

const handleCancel = () => {
    dialogVisible.value = false
}
</script>
