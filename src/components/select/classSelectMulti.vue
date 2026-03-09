<template>
    <div class="custom-select-container">
        <el-select v-model="selectedClasses" placeholder="请选择班级" readonly @visible-change="openDialog" multiple>
            <template #tag>
                <el-tag v-for="item in selectedClasses" closable @close="handleTagRemove(item)" type="info">{{
                    item.className }}</el-tag>
            </template>
        </el-select>

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
    classes: Array<Api.Class.classInfo>
}>()

const dialogVisible = ref(false)
const selectedClasses = ref<Array<Api.Class.classInfo>>([])
const classList = ref<Array<Api.Class.classInfo>>([])
const tableLoading = ref<boolean>(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const emits = defineEmits<{
    change: [classInfo: Array<Api.Class.classInfo>]
}>()

const openDialog = () => {
    dialogVisible.value = true
    currentPage.value = 1
}

const handleRowSelect = (row: Api.Class.classInfo) => {
    if (selectedClasses.value.includes(row)) {
        ElMessage.error(`已选择：${row.className}`)
        return
    }
    selectedClasses.value.push(row)
    dialogVisible.value = false
    ElMessage.success(`已选择：${row.className}`)
    emits('change', selectedClasses.value)
}

const handleSizeChange = (val: number) => {
    pageSize.value = val
    currentPage.value = 1
}

const handleCurrentChange = async (val: number) => {
    currentPage.value = val
    await getClassList()
}

const handleTagRemove = (val: Api.Class.classInfo) => {
    const leftClasses = selectedClasses.value.filter(
        item => item.id !== val.id
    )
    ElMessage.success(`已移除：${val.className}`)
    selectedClasses.value = leftClasses
    emits('change', selectedClasses.value)
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

watch(
    () => props.classes,
    async (newClasses, oldClasses) => {
        if (newClasses !== oldClasses) {
            selectedClasses.value = props.classes
        }
    },
    { immediate: true }
)

onMounted(() => {
    getClassList()
})
</script>