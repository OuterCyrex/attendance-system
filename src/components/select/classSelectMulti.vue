<template>
    <div class="custom-select-container">
        <el-select v-model="selectedNames" placeholder="请选择班级" readonly @visible-change="openDialog" multiple
            @remove-tag="handleTagRemove" />

        <el-dialog title="请选择班级" v-model="dialogVisible" width="800px" destroy-on-close :show-footer="false"
            append-to-body>
            <el-table :data="classList" @row-click="handleRowSelect" v-loading="tableLoading" highlight-current-row
                size="small" style="cursor: pointer">
                <el-table-column prop="id" label="班级号" width="100" />
                <el-table-column prop="className" label="班级名称" width="300" />
                <el-table-column prop="count" label="人数" />
                <el-table-column prop="major" label="专业" width="150" />
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
import { ref, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { fetchGetClassList } from '@/api/class';

const props = defineProps<{
    teacherNo: string
    classNames: Array<string>
}>()

const dialogVisible = ref(false)
const selectedNames = ref<Array<string>>([])
const selectedClasses = ref<Array<Api.Class.classInfo>>([])
const classList = ref<Array<Api.Class.classInfo>>([])
const tableLoading = ref<boolean>(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const emits = defineEmits<{
    selected: [classInfo: Api.Class.classInfo]
    removed: [classInfo: Api.Class.classInfo]
}>()

const openDialog = () => {
    dialogVisible.value = true
    currentPage.value = 1
}

const handleRowSelect = (row: Api.Class.classInfo) => {
    if (selectedNames.value.includes(row.className)) {
        ElMessage.error(`已选择：${row.className}`)
        return
    }
    selectedNames.value.push(row.className)
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

const handleTagRemove = (val: string) => {
    const filNames = selectedNames.value.filter(
        name => name !== val
    )
    if (filNames.length <= 0) {
        ElMessage.error(`班级不可为空`)
        selectedNames.value.push(val)
        return
    }
    ElMessage.success(`已移除：${val}`)
    selectedNames.value = filNames
    console.log(selectedClasses.value, val)
    const removedClass = selectedClasses.value.find(
        cls => cls.className === val
    )
    console.log(removedClass)
    if (!removedClass) return
    emits('removed', removedClass)
}

const getClassList = async () => {
    tableLoading.value = true
    const data = await fetchGetClassList({ teacherNo: props.teacherNo, pageSize: pageSize.value, pageNum: currentPage.value } as any)
    classList.value = data.records
    total.value = data.total
    tableLoading.value = false
}

watch(
    () => props.teacherNo,
    async (newTeacherNo, oldTeacherNo) => {
        if (newTeacherNo !== oldTeacherNo) {
            currentPage.value = 1
            await getClassList()
        }
    },
    { immediate: false }
)

onMounted(() => {
    getClassList()
    selectedNames.value = props.classNames
})
</script>