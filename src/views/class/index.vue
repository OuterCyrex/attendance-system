<template>
  <div class="class-container">
    <div class="grid grid-cols-12 w-full">
      <ElCard class="col-span-12" shadow="never">
        <div class="flex items-center gap-4">
          <div class="flex items-center">
            <div class="mr-2 text-gray-500">年级：</div>
            <el-select v-model="gradeValue" placeholder="请选择年级" style="width: 160px">
              <el-option v-for="item in gradeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>

          <div class="flex items-center">
            <div class="mr-2 text-gray-500">专业：</div>
            <el-select v-model="majorValue" placeholder="请选择专业" style="width: 160px">
              <el-option v-for="item in majorOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>

          <div class="flex items-center" v-if="userInfo.role === 'college_admin'">
            <div class="mr-2 text-gray-500">辅导员：</div>
            <el-select v-model="collegeValue" placeholder="请选择辅导员" style="width: 160px">
              <el-option v-for="item in collegeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </div>

          <div class="flex items-center" v-if="userInfo.role === 'admin'">
            <div class="mr-2 text-gray-500">学院：</div>
            <el-select v-model="collegeValue" placeholder="请选择学院" style="width: 160px">
              <el-option v-for="item in collegeOptions" :key="item.id" :label="item.name" :value="item.name" />
            </el-select>
          </div>

          <div class="ml-auto flex gap-2">
            <el-button type="primary" @click="getClassList()">查询</el-button>
            <el-button type="info" plain @click="resetSearch()">重置</el-button>
          </div>
        </div>
      </ElCard>

      <ElCard class="col-span-12 mt-4" shadow="never" v-if="userInfo.role === 'admin'">
        <div class="operation-buttons flex">
          <el-button type="primary" :icon="Plus" @click="addDialogVisible = true">新增班级</el-button>
          <el-upload class="mx-4" :auto-upload="false" :show-file-list="false" :on-change="handleFileChange"
            accept=".xlsx,.xls">
            <el-button type="primary">导入班级</el-button>
          </el-upload>

          <el-button type="info" plain @click="downloadTemplate">下载班级表模板</el-button>
        </div>
      </ElCard>

      <ElCard class="col-span-12 mt-4" shadow="never">
        <el-table :data="classList" v-loading="tableLoading" border stripe highlight-current-row
          class="data-table__content" style="min-height: 560px">
          <el-table-column label="id" prop="id"></el-table-column>
          <el-table-column label="班级名称" prop="className"></el-table-column>
          <el-table-column label="年级" prop="grade"></el-table-column>
          <el-table-column label="专业" prop="major"></el-table-column>
          <el-table-column label="人数" prop="count"></el-table-column>
          <el-table-column label="出勤情况">
            <template #default="scope">
              <el-button type="primary" link @click="goToDetail(scope.row.id)"> 查看 </el-button>
            </template>
          </el-table-column>
          <el-table-column label="班级课程">
            <template #default="scope">
              <el-button type="primary" link @click="goToCourseDetail(scope.row)"> 查看 </el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" v-if="userInfo.role === 'admin'">
            <template #default="scope">
              <el-button type="primary" :icon="Edit" link size="small" @click="showEditForm(scope.row)"> 编辑 </el-button>
              <el-popconfirm title="确认删除该班级吗？" confirm-button-text="确认" cancel-button-text="取消"
                @confirm="DeleteClass(scope.row.id)">
                <template #reference>
                  <el-button type="danger" :icon="Delete" link size="small"> 删除 </el-button>
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
    </div>

    <classFormDialog v-model:visible="addDialogVisible" :majorOptions="majorOptions" :gradeOptions="gradeOptions"
      @submit="AddClass" />
    <classFormDialog v-model:visible="editDialogVisible" :majorOptions="majorOptions" :gradeOptions="gradeOptions"
      mode="edit" :id="editId" @submit="UpdateClass" :formData="editFormData" />
  </div>
</template>

<script lang="ts" setup>
import { Plus } from '@element-plus/icons-vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { fetchTemplate, fetchGetClassList, fetchImportClass, fetchAddClass, fetchDeleteClass, fetchUpdateClass } from '../../api/class'
import { useUserStore } from '@/store/modules/user'
import { majorOptions, gradeOptions } from './select'
import classFormDialog from './classForm.vue'
import type { UploadFile } from 'element-plus'
import { fetchGetCollegeList } from '@/api/misc'

const classList = ref([])
const collegeOptions = ref<Array<collegeInfo>>([])
const total = ref(0)
const currentPage = ref(1)
const pageSize = ref(10)
const tableLoading = ref(false)

const userStore = useUserStore()
const { token } = userStore
const { getUserInfo: userInfo } = userStore

const gradeValue = ref<string>('')
const majorValue = ref<string>('')
const teacherValue = ref<string>('')
const collegeValue = ref<string>('')

const addDialogVisible = ref<boolean>(false)
const editDialogVisible = ref<boolean>(false)
const editId = ref<string>('')
const editFormData = ref<classInfo>({
  className: '',
  grade: '',
  major: '',
  count: 30
})

const router = useRouter()
function goToDetail(id: string) {
  router.push({
    name: 'attendance/class',
    params: { id }
  })
}
function goToCourseDetail(row: any) {
  router.push({
    name: 'schedule',
    query: {
      classId: row.id,
    }
  })
}
function handlePageChange(page: number) {
  currentPage.value = page
}

function handleSizeChange(size: number) {
  pageSize.value = size
  currentPage.value = 1
}

const downloadTemplate = async () => {
  const blob = await fetchTemplate(token)
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = '班级导入模板.xlsx'
  a.click()
  URL.revokeObjectURL(a.href)
}

const showEditForm = (row: classInfo) => {
  editId.value = row.id
  editFormData.value = row
  editDialogVisible.value = true
}

const getClassList = async (tid?: string) => {
  tableLoading.value = true
  const queryParams = {
    grades: [gradeValue.value],
    majors: [majorValue.value],
    pageNum: currentPage.value,
    pageSize: pageSize.value,
    collegeName: '',
  }
  switch (userInfo.role) {
    case 'college_admin':
      queryParams['collegeName'] = userInfo.collegeName
      break
    case 'admin':
      queryParams['collegeName'] = collegeValue.value
      break
  }
  const data = await fetchGetClassList(token, queryParams)
  classList.value = data.records
  total.value = data.total
  tableLoading.value = false
}

const handleFileChange = async (uploadFile: UploadFile) => {
  const file = uploadFile.raw
  if (!file) return

  await fetchImportClass(token, file)
  getClassList()
}

const getCollegeList = async () => {
  tableLoading.value = true
  const data = await fetchGetCollegeList()
  collegeOptions.value = data
  tableLoading.value = false
}

const resetSearch = async () => {
  gradeValue.value = ''
  majorValue.value = ''
  teacherValue.value = ''
  collegeValue.value = ''
  getClassList()
}

const AddClass = async (record: classInfo) => {
  const data = await fetchAddClass(token, userInfo.teacherNo, record)
  getClassList()
}

const UpdateClass = async (record: classInfo) => {
  const data = await fetchUpdateClass(token, editId.value, record)
  getClassList()
}

const DeleteClass = async (id: string) => {
  const data = await fetchDeleteClass(token, id)
  getClassList()
}

const getTeacherList = async () => {
        tableLoading.value = true

        const params = {
            pageNum: currentPage.value,
            pageSize: pageSize.value,
            collegeNo: userInfo.collegeNo || '',
            teacherNo: searchForm.teacherNo,
            realName: searchForm.realName,
            phone: searchForm.phone,
            department: searchForm.department
        }
        try {
            const data = await fetchGetTeacherList()
            teacherList.value = data
        } catch {

        }
        tableLoading.value = false
    }

onMounted(() => {
  getClassList()
  if (userInfo.role === 'admin') getCollegeList()
  if (userInfo.role === 'college_admin') getTeacherList()
})
</script>
