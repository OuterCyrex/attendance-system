<template>
    <div class="custom-select-container">
        <el-input v-model="props.classNames" placeholder="请选择班级" readonly @click="openDialog" :disabled="disabled">
            <template #suffix>
                <el-icon class="custom-select-icon">
                    <ArrowDown />
                </el-icon>
            </template>
        </el-input>

        <el-dialog title="请选择班级" v-model="dialogVisible" width="800px" destroy-on-close :show-footer="false"
            append-to-body>
            <el-table ref="tableRef" :data="classList" @selection-change="handleSelectionChange"
                @row-click="handleRowSelect" row-key="id" v-loading="tableLoading" highlight-current-row size="small"
                style="cursor: pointer">
                <el-table-column v-if="multiple" type="selection" width="55" reserve-selection />
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

            <div class="dialog-footer" style="text-align: right; margin-top: 20px;">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="confirmMultiSelect">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { fetchGetClassList } from '@/api/class';

const props = defineProps<{
    teacherNo: string
    disabled?: boolean
    reset?: boolean
    multiple?: boolean
    modelValue?: string | string[],
    classNames: string[]
}>()

const dialogVisible = ref(false)
const classList = ref<Array<Api.Class.classInfo>>([])
const tableLoading = ref<boolean>(false)
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const singleSelection = ref<Api.Class.classInfo | null>(null)
const multiSelection = ref<Api.Class.classInfo[]>([])
const tempMultiSelection = ref<Api.Class.classInfo[]>([])
const tableRef = ref()

const emits = defineEmits<{
    selected: [classinfo: Api.Class.classInfo | Api.Class.classInfo[]]
    'update:modelValue': [value: string | string[]]
}>()

const openDialog = async () => {
    if (props.disabled) return
    dialogVisible.value = true
    if (classList.value.length === 0) {
        await getClassList()
    }

    if (props.multiple && tableRef.value) {
        await nextTick()

        tableRef.value!.clearSelection()

        let idsToSelect: string[] = []
        if (typeof props.modelValue === 'string') {
            idsToSelect = [props.modelValue]
        } else if (Array.isArray(props.modelValue)) {
            idsToSelect = props.modelValue
        }

        idsToSelect.forEach(id => {
            const row = classList.value.find(item => item.id === id)
            if (row) {
                tableRef.value!.toggleRowSelection(row, true)
            }
        })

        tempMultiSelection.value = classList.value.filter(item => idsToSelect.includes(item.id))
        multiSelection.value = [...tempMultiSelection.value]
    }
}

const allSelectedMap = ref(new Map<string, Api.Class.classInfo>());
watch(
    [() => classList.value, () => props.modelValue],
    ([newList, newVal]) => {
        const ids = Array.isArray(newVal) ? newVal : (newVal ? [newVal] : []);

        newList.forEach(item => {
            if (ids.includes(item.id)) {
                allSelectedMap.value.set(item.id, item);
            }
        });

        multiSelection.value = ids.map(id => {
            return allSelectedMap.value.get(id) || { id, className: id } as any;
        });

        tempMultiSelection.value = [...multiSelection.value];
    },
    { immediate: true }
)

const handleRowSelect = (row: Api.Class.classInfo) => {
    if (props.multiple) {
        tableRef.value?.toggleRowSelection(row, undefined)
    } else {
        singleSelection.value = row
        dialogVisible.value = false
        ElMessage.success(`已选择：${row.className}`)
        emits('selected', row)
    }
}

const handleSelectionChange = (rows: Api.Class.classInfo[]) => {
    if (props.multiple) {
        tempMultiSelection.value = rows
        const selectedIds = rows.map(row => row.id)
        emits('update:modelValue', selectedIds)
    }
}

const confirmMultiSelect = () => {
    multiSelection.value = tempMultiSelection.value
    dialogVisible.value = false

    const selectedIds = multiSelection.value.map(row => row.id)
    emits('update:modelValue', selectedIds)

    emits('selected', multiSelection.value)
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

    const params = {
        teacherNo: props.teacherNo,
        pageNum: currentPage.value,
        size: pageSize.value
    }
    const data = await fetchGetClassList(params as any)
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
            singleSelection.value = null
            multiSelection.value = []
            tempMultiSelection.value = []
            if (tableRef.value) {
                tableRef.value.clearSelection()
            }
            await getClassList()
        }
    },
    { immediate: false }
)

watch(
    () => props.reset,
    () => {
        singleSelection.value = null

        multiSelection.value = []
        tempMultiSelection.value = []

        if (tableRef.value) {
            tableRef.value.clearSelection()
        }
    },
    { immediate: false }
)

onMounted(() => {
    getClassList()
})
</script>