<template>
  <el-dialog v-model="dialogVisible" :title="titleMap[mode]" width="500px" :close-on-click-modal="false">
    <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
      <el-form-item label="班级名称" prop="className">
        <el-input v-model="form.className" placeholder="请输入班级名称" />
      </el-form-item>

      <el-form-item label="课程名称" prop="courseName">
        <el-input v-model="form.courseName" placeholder="请输入课程名称" />
      </el-form-item>

      <el-form-item label="上课星期" prop="weekday">
        <el-select v-model="form.weekday" class="w-full" placeholder="请选择星期">
          <el-option v-for="item in weekOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="上课时间" prop="timeRange">
        <el-time-picker v-model="form.timeRange" is-range range-separator="To" start-placeholder="Start time"
          end-placeholder="End time" format="HH:mm" value-format="HH:mm" />
      </el-form-item>

      <el-form-item label="教室" prop="classroom">
        <el-input v-model="form.classroom" placeholder="请输入上课教室" />
      </el-form-item>

      <el-form-item label="学年" prop="schoolYear">
        <el-select v-model="form.schoolYear" class="w-full" placeholder="请选择学年">
          <el-option v-for="item in yearOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="学期" prop="semester">
        <el-select v-model="form.semester" class="w-full" placeholder="请选择学期">
          <el-option v-for="item in semesterOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
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
    yearOptions: SelectOption[]
    semesterOptions: SelectOption[]
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
  courseName: '',
  className: '',
  weekday: 0,
  startTime: '',
  endTime: '',
  classroom: '',
  semester: '',
  schoolYear: '',
  timeRange: []
}

const formRef = ref<FormInstance>()
const form = reactive<scheduleInfo>({ ...defaultForm })

const rules: FormRules = {
  className: [{ required: true, message: '请输入班级名称', trigger: 'blur' }],
  courseName: [{ required: true, message: '请输入课程名称', trigger: 'blur' }],
  weekday: [{ required: true, message: '请选择上课星期', trigger: 'change' }],
  timeRange: [{ type: 'array', required: true, message: '请选择上课时间段', trigger: 'change' }],
  classroom: [{ required: true, message: '请输入上课教室', trigger: 'blur' }],
  schoolYear: [{ required: true, message: '请选择学年', trigger: 'change' }],
  semester: [{ required: true, message: '请选择学期', trigger: 'change' }]
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

      // 初始化时间范围（timeRange）: 如果传入了 startTime/endTime，则使用它们
      const p: any = props.formData || {}
      if (p.startTime && p.endTime) {
        // 后端可能返回带秒的时间字符串（如 '08:30:00'），统一截取到 HH:mm
        const s = String(p.startTime).slice(0, 5)
        const e = String(p.endTime).slice(0, 5)
        form.timeRange = [s, e]
      } else if (Array.isArray(p.timeRange) && p.timeRange.length === 2) {
        form.timeRange = p.timeRange
      } else {
        form.timeRange = []
      }
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

    if (form.timeRange && form.timeRange.length === 2) {
      form.startTime = form.timeRange[0]
      form.endTime = form.timeRange[1]
    }
    const { timeRange, ...rawData } = form

    const submitData: SubmitClassData =
      props.mode === 'edit' ? { id: props.id, ...rawData } : { ...rawData }

    emit('submit', submitData)
    dialogVisible.value = false
  })
}

const handleCancel = () => {
  dialogVisible.value = false
}
</script>
