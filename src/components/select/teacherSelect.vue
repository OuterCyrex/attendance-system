<template>
    <div class="custom-select-container">
        <el-input v-model="selectedItem" placeholder="请选择教师" readonly @click="openDialog" :disabled="disabled">
            <template #suffix>
                <el-icon class="custom-select-icon">
                    <ArrowDown />
                </el-icon>
            </template>
        </el-input>

        <el-dialog title="请选择辅导员老师" v-model="dialogVisible" width="400px" destroy-on-close :show-footer="false"
            append-to-body>
            <el-table :data="teacherList" @row-click="handleRowSelect" v-loading="tableLoading"
                highlight-current-row size="small" style="cursor: pointer">
                <el-table-column prop="teacherNo" label="工号" width="100" />
                <el-table-column prop="realName" label="教师名" />
                <el-table-column prop="phone" label="电话" />
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
import { fetchGetTeacherList } from '@/api/teacherMange';

const props = defineProps<{
    collegeName: string
    disabled?: boolean
    reset?: boolean
}>()

const dialogVisible = ref(false)
const selectedItem = ref<string>('')
const teacherList = ref<Array<Api.Teacher.teacherInfo>>([])
const tableLoading = ref<boolean>(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const emits = defineEmits<{
    selected: [teacher: Api.Teacher.teacherInfo]
}>()

const openDialog = () => {
    if (props.disabled) return
    dialogVisible.value = true
    currentPage.value = 1
}

const handleRowSelect = (row: Api.Teacher.teacherInfo) => {
    selectedItem.value = row.realName
    dialogVisible.value = false
    ElMessage.success(`已选择：${row.realName}`)
    emits('selected', row)
}

const handleSizeChange = (val: number) => {
    pageSize.value = val
    currentPage.value = 1
}

const handleCurrentChange = async (val: number) => {
    currentPage.value = val
    await getTeacherList()
}

const getTeacherList = async () => {
    tableLoading.value = true
    const data = await fetchGetTeacherList({department: props.collegeName, pageSize: 10, pageNum: currentPage.value} as any)
    teacherList.value = data.records
    total.value = data.total
    tableLoading.value = false
}

watch(
    () => props.disabled,
    (newDisabled) => {
        if (newDisabled && dialogVisible.value) {
            dialogVisible.value = false
            getTeacherList()
        }
    },
    { immediate: false }
)

watch(
    () => props.collegeName,
    async (newCollegeName, oldCollegeName) => {
        if (newCollegeName !== oldCollegeName) {
            currentPage.value = 1
            selectedItem.value = ''
            await getTeacherList()
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
    getTeacherList()
})
</script>