<template>
    <div class="custom-select-container">
        <el-input v-model="selectedItem" placeholder="请选择学院" readonly @click="openDialog" :disabled="disabled">
            <template #suffix>
                <el-icon class="custom-select-icon">
                    <ArrowDown />
                </el-icon>
            </template>
        </el-input>

        <el-dialog title="请选择学院" v-model="dialogVisible" width="400px" destroy-on-close :show-footer="false"
            append-to-body>
            <el-table :data="paginatedCollegeList" @row-click="handleRowSelect" v-loading="tableLoading"
                highlight-current-row size="small" style="cursor: pointer">
                <el-table-column prop="collegeNo" label="学院号" width="100" />
                <el-table-column prop="name" label="学院名称" />
            </el-table>

            <div class="flex justify-center mt-4">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="currentPage" :page-sizes="[10]" :page-size="pageSize"
                    layout="total, prev, pager, next" :total="collegeList.length" small>
                </el-pagination>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { fetchGetCollegeList } from '@/api/misc'

const props = defineProps<{
    disabled?: boolean
    reset?: boolean
}>()

const dialogVisible = ref(false)
const selectedItem = ref<string>('')
const collegeList = ref<Array<Api.Misc.collegeInfo>>([])
const tableLoading = ref<boolean>(false)
const currentPage = ref(1)
const pageSize = ref(10)

const emits = defineEmits<{
    selected: [college: Api.Misc.collegeInfo]
}>()

const paginatedCollegeList = computed(() => {
    const startIndex = (currentPage.value - 1) * pageSize.value
    const endIndex = startIndex + pageSize.value
    return collegeList.value.slice(startIndex, endIndex)
})

const openDialog = () => {
    if (props.disabled) return
    dialogVisible.value = true
    currentPage.value = 1
}

const handleRowSelect = (row: Api.Misc.collegeInfo) => {
    selectedItem.value = row.name
    dialogVisible.value = false
    ElMessage.success(`已选择：${row.name}`)
    emits('selected', row)
}

const handleSizeChange = (val: number) => {
    pageSize.value = val
    currentPage.value = 1
}

const handleCurrentChange = (val: number) => {
    currentPage.value = val
}

const getCollegeList = async () => {
    tableLoading.value = true
    const data = await fetchGetCollegeList()
    collegeList.value = data
    tableLoading.value = false
}

watch(
    () => props.disabled,
    (newDisabled) => {
        if (newDisabled && dialogVisible.value) {
            dialogVisible.value = false
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
    getCollegeList()
})
</script>