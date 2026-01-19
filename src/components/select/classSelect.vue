<template>
    <div class="custom-select-container">
        <el-input v-model="selectedItem" placeholder="请选择班级" readonly @click="openDialog" :disabled="disabled">
            <template #suffix>
                <el-icon class="custom-select-icon">
                    <ArrowDown />
                </el-icon>
            </template>
        </el-input>

        <el-dialog title="请选择班级" v-model="dialogVisible" width="800px" destroy-on-close :show-footer="false"
            append-to-body>
            <el-table :data="classList" @row-click="handleRowSelect" v-loading="tableLoading"
                highlight-current-row size="small" style="cursor: pointer">
                <el-table-column prop="id" label="班级号" width="100" />
                <el-table-column prop="className" label="班级名称" width="300"/>
                <el-table-column prop="count" label="人数" />
                <el-table-column prop="major" label="专业" width="150"/>
                <el-table-column prop="grade" label="年级" />
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
import { fetchGetClassList } from '@/api/class';

const props = defineProps<{
    teacherNo: string
    disabled?: boolean
    reset?: boolean
}>()

const dialogVisible = ref(false)
const selectedItem = ref<string>('')
const classList = ref<Array<Api.Class.classInfo>>([])
const tableLoading = ref<boolean>(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const emits = defineEmits<{
    selected: [classinfo: Api.Class.classInfo]
}>()

const openDialog = () => {
    if (props.disabled) return
    dialogVisible.value = true
    currentPage.value = 1
}

const handleRowSelect = (row: Api.Class.classInfo) => {
    selectedItem.value = row.className
    dialogVisible.value = false
    ElMessage.success(`已选择：${row.className}`)
    emits('selected', row)
}

const handleSizeChange = (val: number) => {
    pageSize.value = val
    currentPage.value = 1
}

const handleCurrentChange = async (val: number) => {
    currentPage.value = val
    await getClassList()
}

const getClassList = async () => {
    tableLoading.value = true
    const data = await fetchGetClassList({teacherNo: props.teacherNo})
    classList.value = data.records
    total.value = data.total
    tableLoading.value = false
}

watch(
    () => props.disabled,
    async (newDisabled) => {
        if (newDisabled && dialogVisible.value) {
            dialogVisible.value = false
            await getClassList()
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
            await getClassList()
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
    getClassList()
})
</script>