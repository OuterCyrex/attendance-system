<template>
    <div class="custom-select-container">
        <el-input v-model="selectedItem" placeholder="请选择课程" readonly @click="openDialog" :disabled="disabled">
            <template #suffix>
                <el-icon class="custom-select-icon">
                    <ArrowDown />
                </el-icon>
            </template>
        </el-input>

        <el-dialog title="请选择课程" v-model="dialogVisible" width="600px" destroy-on-close :show-footer="false"
            append-to-body>
            <el-table :data="courseList" @row-click="handleRowSelect" v-loading="tableLoading"
                highlight-current-row size="small" style="cursor: pointer">
                <el-table-column prop="courseNo" label="课程号" width="100"/>
                <el-table-column prop="courseName" label="课程名" width="250"/>
                <el-table-column prop="courseType" label="类型"/>
                <el-table-column prop="expectedCount" label="预期人数" />
            </el-table>

            <div class="flex justify-center mt-4">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="currentPage" :page-sizes="[10]" :page-size="pageSize"
                    layout="total, prev, pager, next" :total="total" small>
                </el-pagination>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { fetchGetScheduleList } from '@/api/schedule';


const props = defineProps<{
    teacherNo: string
    disabled?: boolean
    reset?: boolean
}>()

const dialogVisible = ref(false)
const courseList = ref<Array<Api.Schedule.scheduleInfo>>([])
const selectedItem = ref<string>('')
const tableLoading = ref<boolean>(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const emits = defineEmits<{
    selected: [course: Api.Schedule.scheduleInfo]
}>()

const openDialog = () => {
    if (props.disabled) return
    dialogVisible.value = true
    currentPage.value = 1
}

const handleRowSelect = (row: Api.Schedule.scheduleInfo) => {
    selectedItem.value = row.courseName
    dialogVisible.value = false
    ElMessage.success(`已选择：${row.courseName}`)
    emits('selected', row)
}

const handleSizeChange = (val: number) => {
    pageSize.value = val
    currentPage.value = 1
}

const handleCurrentChange = async (val: number) => {
    currentPage.value = val
    await getCourselist()
}

const getCourselist = async () => {
    tableLoading.value = true
    const data = await fetchGetScheduleList({teacherNo: props.teacherNo, pageSize: 10, pageNum: currentPage.value} as any)
    courseList.value = data.records
    total.value = data.total
    tableLoading.value = false
}

watch(
    () => props.disabled,
    async (newDisabled) => {
        if (newDisabled && dialogVisible.value) {
            dialogVisible.value = false
            await getCourselist()
        }
    },
    { immediate: false }
)

watch(
    () => props.teacherNo,
    async (newTeacherNo, oldTeacherNo) => {
        if (newTeacherNo !== oldTeacherNo) {
            currentPage.value = 1
            selectedItem.value = ''
            await getCourselist()
        }
    },
    { immediate: false }
)

watch(
    () => props.reset,
    () => {
            selectedItem.value = ''
    },
    { immediate: false }
)

onMounted(() => {
    getCourselist()
})
</script>