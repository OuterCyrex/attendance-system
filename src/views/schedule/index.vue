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
            <el-button type="primary" @click="handleSearch">查询</el-button>
            <el-button type="info" plain @click="resetSearch()">重置</el-button>
          </div>
        </div>
      </ElCard>

      <!-- 操作区 -->
      <ElCard class="col-span-12 mt-4" shadow="never">
        <div class="operation-buttons flex">
          <el-button type="primary" :icon="Plus" @click="addDialogVisible = true">新增课程安排</el-button>
          <el-upload class="mx-4" :auto-upload="false" :show-file-list="false" :on-change="handleFileChange"
            accept=".xlsx,.xls">
            <el-button type="primary">导入排课</el-button>
          </el-upload>
          <el-button type="info" plain @click="downloadTemplate"> 下载排课表模板</el-button>
        </div>
      </ElCard>

      <!-- 表格 -->
      <ElCard class="col-span-12 mt-4" shadow="never">
        <el-table v-loading="tableLoading" :data="scheduleList" style="min-height: 400px" border stripe
          highlight-current-row class="data-table__content">
          <!-- 班级信息在前 -->
          <el-table-column label="班级ID" prop="id" width="80" />
          <el-table-column label="班级名称" prop="className" />

          <!-- 课程信息在后 -->
          <el-table-column label="课程名称" prop="courseName" />
          <el-table-column label="授课教师" prop="teacherNo" />
          <el-table-column label="上课星期">
            <template #default="scope"> 星期{{ scope.row.weekday }} </template>
          </el-table-column>

          <el-table-column label="上课时间">
            <template #default="scope">
              {{ scope.row.startTime.slice(0, 5) }}
              -
              {{ scope.row.endTime.slice(0, 5) }}
            </template>
          </el-table-column>

          <el-table-column label="教室" prop="classroom" />
          <el-table-column label="学年" prop="schoolYear" />
          <el-table-column label="学期" prop="semester" />

          <el-table-column label="操作" width="160">
            <template #default="scope">
              <el-button link type="primary" :icon="Edit" @click="showEditForm(scope.row)">编辑</el-button>
              <el-popconfirm title="确认删除该课程吗？" confirm-button-text="确认" cancel-button-text="取消"
                @confirm="DeleteSchedule(scope.row.id)">
                <template #reference>
                  <el-button type="danger" :icon="Delete" link size="small">
                    删除
                  </el-button>
                </template>
              </el-popconfirm>

            </template>
          </el-table-column>
        </el-table>
      </ElCard>

      <div class="col-span-12 mt-10 mb-15 flex justify-center">
        <ElPagination background layout="prev, pager, next, sizes, total" :total="total"
          v-model:current-page="currentPage" v-model:page-size="pageSize" @current-change="handlePageChange"
          @size-change="handleSizeChange" />
      </div>

      <scheduleFormDialog v-model:visible="addDialogVisible" :weekOptions="weekOptions" :yearOptions="yearOptions"
        :semesterOptions="semesterOptions" @submit="addSchedule" mode="add" />
      <scheduleFormDialog v-model:visible="editDialogVisible" :weekOptions="weekOptions" :yearOptions="yearOptions"
        :semesterOptions="semesterOptions" mode="edit" :id="editId" @submit="updateSchedule" :formData="editFormData" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { fetchImportSchedule, fetchTemplate, fetchGetScheduleList, fetchAddSechedule, fetchUpdateSchedule, fetchDeleteSchedule } from '../../api/schedule'
import { useUserStore } from '@/store/modules/user'
import { mockScheduleList } from './mock'
import { weekOptions, yearOptions, semesterOptions } from './select'
import scheduleFormDialog from './scheduleForm.vue'
import { UploadFile } from 'element-plus'

const schoolYear = ref('')
const semester = ref('')

const currentPage = ref(1)
const pageSize = ref(10)

const total = ref(0)

const scheduleList = ref<any[]>([])
const tableLoading = ref(false)
const addDialogVisible = ref(false)
const editDialogVisible = ref(false)
const editId = ref()
const editFormData = ref<scheduleInfo>({
  courseName: "",
  className: "",
  weekday: 0,
  startTime: "",
  endTime: "",
  classroom: "",
  semester: "",
  schoolYear: "",
})

const userStore = useUserStore()
const { getToken: token } = userStore
const { getUserInfo: userInfo } = userStore


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
  getScheduleList()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  getScheduleList()
}

const formatTime = (time: any) => {
  if (!time) return ''
  const h = String(time.hour).padStart(2, '0')
  const m = String(time.minute).padStart(2, '0')
  return `${h}:${m}`
}

const getScheduleList = async () => {
  tableLoading.value = true
  const params = {
    teacherNo: userInfo.id,
    pageNum: currentPage.value,
    pageSize: pageSize.value,
    schoolYear: schoolYear.value,
    semester: semester.value
  }
  // debug: 查看实际发送的查询参数
  console.log('[Schedule] fetchGetScheduleList params:', params)

  const data = await fetchGetScheduleList(token, params)
  scheduleList.value = data.records
  total.value = data.total
  //console.log(scheduleList.value)
  tableLoading.value = false
}

const resetSearch = async () => {
  schoolYear.value = ''
  semester.value = ''
  currentPage.value = 1
  getScheduleList()
}

const handleSearch = () => {
  currentPage.value = 1
  getScheduleList()
}

const handleFileChange = async (uploadFile: UploadFile) => {
  const file = uploadFile.raw
  if (!file) return

  await fetchImportSchedule(token, file)
  getScheduleList()
}

const addSchedule = async (record: scheduleInfo) => {
  const data = await fetchAddSechedule(token, userInfo.id, record)
  getScheduleList()
}

const showEditForm = (row: scheduleInfo) => {
  editId.value = row.id
  editFormData.value = {
    ...row,
    startTime: row.startTime,
    endTime: row.endTime
  }
  editDialogVisible.value = true
}

const updateSchedule = async (record: scheduleInfo) => {
  const data = await fetchUpdateSchedule(token, editId.value, record)
  getScheduleList()
}

const DeleteSchedule = async (id: string) => {
  const data = await fetchDeleteSchedule(token, id)
  getScheduleList()
}


onMounted(() => {
  getScheduleList()
})
</script>
