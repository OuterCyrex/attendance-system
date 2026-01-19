<template>
  <div class="class-container">
    <div class="grid grid-cols-12 w-full">
      <ElCard class="col-span-12" shadow="never" v-if="!isClassMode">
        <div class="flex flex-col gap-4">
          <div class="flex items-center gap-4">
            <div class="flex items-center">
              <div class="mr-2 text-gray-500">课程名称：</div>
              <el-input v-model="courseName" placeholder="请输入课程名称" style="width: 200px" @keyup.enter="handleSearch" />
            </div>

            <div class="flex items-center">
              <div class="mr-2 text-gray-500">学期：</div>
              <el-select v-model="semesterName" placeholder="请选择学期" style="width: 200px">
                <el-option v-for="value in semesterList" :label="value" :value="value"></el-option>
              </el-select>
            </div>

            <div class="flex items-center">
              <div class="mr-2 text-gray-500">任课教师：</div>
              <el-input v-model="teacherName" placeholder="请输入任课教师姓名" style="width: 200px" />
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="flex items-center">
              <div class="mr-2 text-gray-500">课程类型：</div>
              <el-select v-model="courseType" placeholder="请选择课程类型" style="width: 200px">
                <el-option label="必修课" value="required"></el-option>
                <el-option label="选修课" value="elective"></el-option>
                <el-option label="实验课" value="lab"></el-option>
              </el-select>
            </div>

            <div class="flex items-center" v-if="userInfo.role === 'admin'">
              <div class="mr-2 text-gray-500">学院：</div>
              <collegeSelect @selected="handleCollegeSelected" :reset="resetFlag" />
            </div>

            <div class="flex items-center" v-if="userInfo.role !== 'teacher'">
              <div class="mr-2 text-gray-500">辅导员：</div>
              <teacherSelect :collegeNo="collegeNo" :disabled="collegeNo === ''" @selected="handleTeacherSelected"
                :reset="resetFlag" />
            </div>

            <div class="flex items-center">
              <div class="mr-2 text-gray-500">班级：</div>
              <classSelect :teacherNo="teacherNo" :disabled="teacherNo === ''" @selected="handleClassSelected"
                :reset="resetFlag" />
            </div>
            <div class="ml-auto">
              <el-button type="primary" @click="handleSearch">查询</el-button>
              <el-button type="info" plain @click="resetSearch()">重置</el-button>
            </div>
          </div>
        </div>
      </ElCard>

      <ElCard class="col-span-12" shadow="never" v-if="isClassMode">
        <div class="flex justify-between items-center gap-4">
          <div>
            <div class="text-xl font-semibold mb-2">{{ classInfo.className }}</div>
            <div class="flex items-center gap-4">
              <div class="text-sm text-gray-400">专业：<el-tag size="small" type="warning">{{ classInfo.major }}</el-tag>
              </div>
              <div class="text-sm text-gray-400">年级：<el-tag size="small">{{ classInfo.grade }}</el-tag></div>
            </div>
          </div>

          <el-tag size="large"> 人数：{{ classInfo.count }}</el-tag>
        </div>
      </ElCard>

      <ElCard class="col-span-12 mt-4" shadow="never" v-if="userInfo.role === 'admin'">
        <div class="operation-buttons flex">
          <el-button type="primary" :icon="Plus" @click="addDialogVisible = true">新增课程安排</el-button>
          <el-upload class="mx-4" :auto-upload="false" :show-file-list="false" :on-change="handleFileChange"
            accept=".xlsx,.xls">
            <el-button type="primary">导入排课</el-button>
          </el-upload>
          <el-button type="info" plain @click="downloadTemplate"> 下载排课表模板</el-button>
        </div>
      </ElCard>

      <ElCard class="col-span-12 mt-4" shadow="never">
        <el-table v-loading="tableLoading" :data="scheduleList" style="min-height: 400px" border stripe
          highlight-current-row class="data-table__content">
          <el-table-column label="课程号" prop="courseNo" width="120" />
          <el-table-column label="课程名称" prop="courseName" min-width="150" />
          <el-table-column label="周次" prop="weekRange" width="120" />
          <el-table-column label="上课星期">
            <template #default="scope"> {{ scope.row.weekday }} </template>
          </el-table-column>

          <el-table-column label="上课节次" width="160">
            <template #default="scope">
              <el-space :size="4">

                <el-text type="primary" size="large" tag="b">
                  {{ scope.row.startPeriod }}
                </el-text>

                <el-text type="info">-</el-text>

                <el-text type="primary" size="large" tag="b">
                  {{ scope.row.endPeriod }}
                </el-text>

                <el-text type="info" size="small">节</el-text>

              </el-space>
            </template>
          </el-table-column>

          <el-table-column label="教室" prop="classroom" width="150" />

          <el-table-column label="班级名称" min-width="150" show-overflow-tooltip>
            <template #default="scope">
              {{ Array.isArray(scope.row.classNames) ? scope.row.classNames.join('、') : scope.row.classNames }}
            </template>
          </el-table-column>
          <el-table-column label="预计人数" prop="expectedCount" width="100" />
          <el-table-column label="考勤">
            <template #default="scope">
              <el-tag :type="scope.row.isInClassTime ? 'success' : 'info'" effect="dark" style="cursor: pointer"
                @click="goToDetail(scope.row.id)">{{
                  scope.row.isInClassTime ? '上课中' : '未上课' }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column v-if="userInfo.role === 'admin'" label="操作" width="160">
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

      <scheduleFormDialog v-model:visible="addDialogVisible" :weekOptions="weekOptions" @submit="addSchedule"
        mode="add" />
      <scheduleFormDialog v-model:visible="editDialogVisible" :weekOptions="weekOptions" mode="edit" :id="editId"
        @submit="updateSchedule" :formData="editFormData" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import { Plus, Edit, Delete, Timer } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { fetchImportSchedule, fetchTemplate, fetchGetScheduleList, fetchAddSechedule, fetchUpdateSchedule, fetchDeleteSchedule, fetchGetScheduleListByCourse } from '../../api/schedule'
import { useUserStore } from '@/store/modules/user'
import { weekOptions } from './select'
import scheduleFormDialog from './scheduleForm.vue'
import { UploadFile } from 'element-plus'
import { useRoute } from 'vue-router'
import { fetchClassDetail } from '@/api/class'
import { fetchSemesterList } from '@/api/misc'
import classSelect from '@/components/select/classSelect.vue'
import collegeSelect from '@/components/select/collegeSelect.vue'
import teacherSelect from '@/components/select/teacherSelect.vue'

const schoolYear = ref('')
const courseName = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const scheduleList = ref<any[]>([])
const tableLoading = ref(false)
const addDialogVisible = ref(false)
const editDialogVisible = ref(false)
const editId = ref()
const router = useRouter()
const route = useRoute()
const editFormData = ref<Api.Schedule.scheduleInfo>({
  courseNo: "",
  courseName: "",
  weekday: "",
  weekRange: "",
  startPeriod: 1,
  endPeriod: 2,
  classroom: "",
  expectedCount: 0
} as any)

const userStore = useUserStore()
const { getToken: token } = userStore
const { getUserInfo: userInfo } = userStore
const classId = computed(() => (route.query.classId as string))
const classInfo = ref({
  className: "",
  count: 0,
  grade: 0,
  major: '',
})
const isClassMode = computed(() => !!classId.value)

const loadData = async () => {
  if (isClassMode.value) {
    await getScheduleListByClass()
    await getClassInfo()
  } else {
    await getScheduleList()
  }
}

const collegeName = ref<string>('')
const collegeNo = ref<string>('')
const resetFlag = ref(false)
const handleCollegeSelected = async (college: Api.Misc.collegeInfo) => {
  collegeName.value = college.name
  collegeNo.value = college.collegeNo
}

const teacherName = ref<string>('')
const teacherNo = ref<string>('')
const handleTeacherSelected = async (teacher: Api.Teacher.teacherInfo) => {
  teacherNo.value = teacher.teacherNo
}

const className = ref<string>('')
const classNo = ref<string>('')
const handleClassSelected = async (classinfo: Api.Class.classInfo) => {
  className.value = classinfo.className
  classNo.value = classinfo.id
}

const semesterName = ref<string>('')
const semesterList = ref<Array<string>>([])
const getSemesterList = async () => {
  const data = await fetchSemesterList()
  semesterList.value = data
}

const courseType = ref<string>('')

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
  loadData()
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
  loadData()
}

const getScheduleList = async () => {
  tableLoading.value = true
  const params = {
    teacherNo: teacherNo.value,
    teacherName: teacherName.value,
    courseType: courseType.value,
    semesterName: semesterName.value,
    collegeName: collegeName.value,
    pageNum: currentPage.value,
    pageSize: pageSize.value,
    courseName: courseName.value,
    className: className.value
  }
  const data = await fetchGetScheduleList(params)
  scheduleList.value = data.records
  total.value = data.total
  tableLoading.value = false
}

const getScheduleListByClass = async () => {
  tableLoading.value = true
  const params = {
    classId: classId.value,
    pageNum: currentPage.value,
    pageSize: pageSize.value
  }
  const data = await fetchGetScheduleListByCourse(token, params)
  scheduleList.value = data.records
  total.value = data.total
  tableLoading.value = false
}

const getClassInfo = async () => {
  tableLoading.value = true
  const data = await fetchClassDetail(classId.value)
  classInfo.value = data
  tableLoading.value = false
}

const resetSearch = async () => {
  resetFlag.value = !resetFlag.value
  collegeName.value = ''
  collegeNo.value = ''
  teacherNo.value = ''
  teacherName.value = ''
  classNo.value = ''
  className.value = ''
  courseType.value = ''
  courseName.value = ''
  schoolYear.value = ''
  semesterName.value = ''
  className.value = ''
  currentPage.value = 1

  if (userInfo.role === 'college_admin') collegeNo.value = userInfo.collegeNo || ''
  if (userInfo.role === 'teacher') teacherNo.value = userInfo.teacherNo || ''
  loadData()
}

const handleSearch = () => {
  currentPage.value = 1
  loadData()
}

function goToDetail(id: string) {
  router.push({
    name: 'attendance/schedule',
    params: { id }
  })
}

const handleFileChange = async (uploadFile: UploadFile) => {
  const file = uploadFile.raw
  if (!file) return

  await fetchImportSchedule(token, file)
  loadData()
}

const addSchedule = async (record: Api.Schedule.scheduleInfo) => {
  const data = await fetchAddSechedule(token, userInfo.teacherNo, record)
  loadData()
}

const showEditForm = (row: Api.Schedule.scheduleInfo) => {
  editId.value = row.id
  editFormData.value = {
    ...row,
    courseNo: row.courseNo,
    courseName: row.courseName,
    weekday: row.weekday,
    weekRange: row.weekRange,
    startPeriod: row.startPeriod,
    endPeriod: row.endPeriod,
    classroom: row.classroom,
    expectedCount: row.expectedCount
  }
  editDialogVisible.value = true
}

const updateSchedule = async (record: Api.Schedule.scheduleInfo) => {
  const data = await fetchUpdateSchedule(token, editId.value, record)
  loadData()
}

const DeleteSchedule = async (id: string) => {
  const data = await fetchDeleteSchedule(token, id)
  loadData()
}


onMounted(() => {
  getSemesterList()
  resetSearch()
})
</script>
