<template>
    <div class="class-container">
        <div class="grid grid-cols-12 w-full">
            <!-- 查询条件 -->
            <ElCard class="col-span-12" shadow="never">
                <div class="flex items-center gap-4">
                    <div class="flex items-center">
                        <div class="mr-2 text-gray-500">学年：</div>
                        <el-input v-model="schoolYear" placeholder="如 2024-2025" style="width: 160px" />
                    </div>

                    <div class="flex items-center">
                        <div class="mr-2 text-gray-500">学期：</div>
                        <el-select v-model="semester" placeholder="请选择学期" style="width: 160px">
                            <el-option label="第一学期" value="1" />
                            <el-option label="第二学期" value="2" />
                        </el-select>
                    </div>

                    <div class="ml-auto flex gap-2">
                        <el-button type="primary">查询</el-button>
                        <el-button type="info" plain>重置</el-button>
                    </div>
                </div>
            </ElCard>

            <!-- 操作区 -->
            <ElCard class="col-span-12 mt-4" shadow="never">
                <div class="operation-buttons flex">
                    <el-button type="primary" :icon="Plus">新增课程安排</el-button>
                    <el-upload class="mx-4" :auto-upload="false" :show-file-list="false" :on-change="handleFileChange"
                        accept=".xlsx,.xls">
                        <el-button type="primary">导入排课</el-button>
                    </el-upload>
                    <el-button type="info" plain @click="downloadTemplate"> 下载排课表模板</el-button>
                </div>
            </ElCard>

            <!-- 表格 -->
            <ElCard class="col-span-12 mt-4" shadow="never">
                <el-table :data="displayData" style="min-height: 400px" border stripe highlight-current-row
                    class="data-table__content">
                    <!-- 班级信息在前 -->
                    <el-table-column label="班级ID" prop="id" width="80" />
                    <el-table-column label="班级名称" prop="className" />

                    <!-- 课程信息在后 -->
                    <el-table-column label="课程名称" prop="courseName" />
                    <el-table-column label="授课教师" prop="teacherNo" />
                    <el-table-column label="上课星期">
                        <template #default="scope">
                            星期{{ scope.row.weekday }}
                        </template>
                    </el-table-column>

                    <el-table-column label="上课时间">
                        <template #default="scope">
                            {{ formatTime(scope.row.startTime) }}
                            -
                            {{ formatTime(scope.row.endTime) }}
                        </template>
                    </el-table-column>

                    <el-table-column label="教室" prop="classroom" />
                    <el-table-column label="学年" prop="schoolYear" />
                    <el-table-column label="学期" prop="semester" />

                    <el-table-column label="操作" width="160">
                        <template #default="scope">
                            <el-button link type="primary" :icon="Edit">编辑</el-button>
                            <el-button link type="danger" :icon="Delete">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </ElCard>

            <div class="col-span-12 mt-10 mb-15 flex justify-center">
                <ElPagination background layout="prev, pager, next, sizes, total" :total="total"
                    v-model:current-page="currentPage" v-model:page-size="pageSize" @current-change="handlePageChange"
                    @size-change="handleSizeChange" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { fetchImportSchedule, fetchTemplate } from '../../api/schedule'
import { useUserStore } from '@/store/modules/user'
import { mockScheduleList } from './mock'

const schoolYear = ref('')
const semester = ref('')

const currentPage = ref(1)
const pageSize = ref(10)

const list = ref<any[]>([])
const total = computed(() => list.value.length)

const userStore = useUserStore()
const { getToken: token } = userStore
const { getUserInfo: userInfo } = userStore

const displayData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return list.value.slice(start, end)
})

const downloadTemplate = async () => {
    const blob = await fetchTemplate(token)
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = '排课导入模板.xlsx'
    a.click()
    URL.revokeObjectURL(a.href)
}

const handlePageChange = (page: number) => {
    currentPage.value = page
}

const handleSizeChange = (size: number) => {
    pageSize.value = size
    currentPage.value = 1
}

const formatTime = (time: any) => {
    if (!time) return ''
    const h = String(time.hour).padStart(2, '0')
    const m = String(time.minute).padStart(2, '0')
    return `${h}:${m}`
}

const getScheduleList = async () => {
    tableLoading.value = true
    const data = await fetchGetScheduleList(token, {
        teacherNo: userInfo.id,
        pageNum: currentPage.value,
        pageSize: pageSize.value
    })
    scheduleList.value = data.records
    tableLoading.value = false
}

const handleFileChange = async (uploadFile: UploadFile) => {
  const file = uploadFile.raw
  if (!file) return

  await fetchImportSchedule(token, file)
  getScheduleList()
}

onMounted(() => {
    getScheduleList()
})
</script>
