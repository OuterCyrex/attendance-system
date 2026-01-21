<template>
    <el-dialog v-model="dialogVisible" title="新增课程" width="500px" :close-on-click-modal="false">
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
            <el-button type="primary" @click="handleSubmit">新增</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'

export type SelectOption = {
    label: string
    value: string
}

const props = defineProps<{
    visible: boolean
    weekOptions: SelectOption[]
}>()

const emit = defineEmits<{
    (e: 'update:visible', val: boolean): void
    (e: 'submit', data: Api.Schedule.addScheduleParams): void
}>()

const dialogVisible = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val)
})

const defaultForm = {
  id: "",
  courseNo: "",
  orderNo: "",
  courseName: "",
  weekday: "",
  expectedCount: 0,
  weekRange: "",
  startPeriod: 1,
  endPeriod: 2,
  classroom: "",
  teacherName: "",
  courseType: "",
  semesterName: "",
  createTime: "",
  updateTime: ""
}

const formRef = ref<FormInstance>()
const form = reactive({ ...defaultForm })

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

watch(
    () => dialogVisible.value,
    (visible) => {
        if (!visible) return
        Object.assign(form, { ...defaultForm })
    },
    { immediate: true }
)

const handleSubmit = async () => {
    if (!formRef.value) return

    await formRef.value.validate((valid) => {
        if (!valid) return
        emit('submit', form)
        dialogVisible.value = false
    })
}
</script>