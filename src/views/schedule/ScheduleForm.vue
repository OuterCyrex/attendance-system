<template>
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑课程' : '新增课程'" width="500px" :close-on-click-modal="false">
        <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="课程号" prop="courseNo" class="flex-1">
                <el-input v-model="form.courseNo" placeholder="例如: CS101" />
            </el-form-item>

            <el-form-item label="课序号" prop="orderNo" class="flex-1">
                <el-input v-model="form.orderNo" placeholder="例如: 01" />
            </el-form-item>

            <el-form-item label="课程名称" prop="courseName">
                <el-input v-model="form.courseName" placeholder="请输入课程名称" />
            </el-form-item>

            <el-form-item label="上课星期" prop="weekday">
                <el-select v-model="form.weekday" class="w-full" placeholder="请选择星期">
                    <el-option v-for="item in weekOptions" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </el-form-item>

            <el-form-item label="上课班级" prop="">
                <classSelect ref="classSelectRef" v-model="classId" :classNames="classNames" :multiple="true"
                    style="width:500px;" />
            </el-form-item>

            <el-form-item label="课程类型" prop="courseType">
                <el-select v-model="form.courseType" placeholder="请选择类型" style="width: 200px" clearable collapse-tags>
                    <el-option label="必修课" value="required"></el-option>
                    <el-option label="选修课" value="elective"></el-option>
                    <el-option label="实验课" value="lab"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="周次范围" prop="weekRange" class="flex-1">
                <el-input v-model="form.weekRange" placeholder="例如: 1-16" />
            </el-form-item>

            <el-form-item label="教室" prop="classroom">
                <el-input v-model="form.classroom" placeholder="请输入上课教室" />
            </el-form-item>

            <el-form-item label="任课教师" prop="teacherName">
                <el-input v-model="form.teacherName" placeholder="请输入任课教师姓名"></el-input>
            </el-form-item>

            <el-form-item label="学期" prop="semester">
                <el-select v-model="form.semesterName" placeholder="请选择学期" style="width: 200px" clearable collapse-tags>
                    <el-option v-for="value in semesterList" :key="value" :label="value" :value="value"></el-option>
                </el-select>
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
            <el-button type="primary" @click="handleSubmit">{{ isEdit ? '编辑' : '新增' }}</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import classSelect from '@/components/select/classSelect.vue';
import { useUserStore } from '@/store/modules/user';
import { fetchGetClassList } from '@/api/class';
import { fetchGetSchedule } from '@/api/schedule';

const userStore = useUserStore()
const semesterList = ref()
onMounted(async () => {
    semesterList.value = await userStore.getSemesterList()
})

export type SelectOption = {
    label: string
    value: string
}

const props = defineProps<{
    visible: boolean
    weekOptions: SelectOption[],
    rowData?: any
}>()

const isEdit = computed(() => !!props.rowData && !!props.rowData.id)

const emit = defineEmits<{
    (e: 'update:visible', val: boolean): void
    (e: 'submit', data: Api.Schedule.addScheduleParams): void
}>()

const dialogVisible = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val)
})

const classId = ref<string[]>()
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
    updateTime: "",
}

const formRef = ref<FormInstance>()
const form = reactive({ ...defaultForm })
const classNames = ref()

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
    ],
}



watch(
    () => props.visible,
    async (visible) => {
        if (visible) {
            formRef.value?.resetFields()
            const classIds = props.rowData.classes.map((item: any) => item.id)
            classNames.value = props.rowData.classes.map((item: any) => item.className)
            console.log("props", props.rowData, classIds)
            if (props.rowData) {
                Object.assign(form, props.rowData)
                if (classIds) {
                    classId.value = classIds
                    console.log("classId", classId)
                } else {
                    classId.value = []
                }
            } else {
                Object.assign(form, defaultForm)
                classId.value = []
            }
        } else {
            Object.assign(form, { ...defaultForm })
            classId.value = []
        }
    }
)


const handleSubmit = async () => {
    if (!formRef.value) return

    await formRef.value.validate((valid) => {
        if (!valid) return
        const submitData = {
            courseSchedule: {
                ...form,
                id: isEdit.value ? form.id : undefined
            },
            classIds: classId.value || []
        }
        console.log(submitData)
        emit('submit', submitData)
        dialogVisible.value = false
    })
}


</script>