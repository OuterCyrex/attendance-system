<template>
  <div class="class-container">
    <div class="grid grid-cols-12 w-full">
      <ElCard class="col-span-12" shadow="never">
        <div class="flex items-center gap-4">
          <div class="year-select flex items-center">
            <div class="mr-2 text-gray-500">年级：</div>
            <el-select v-model="gradeValue" placeholder="请选择年级" style="width: 160px">
              <el-option
                v-for="item in gradeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>

          <div class="year-select flex items-center">
            <div class="mr-2 text-gray-500">专业：</div>
            <el-select v-model="majorValue" placeholder="请选择专业" style="width: 160px">
              <el-option
                v-for="item in majorOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>

          <div class="ml-auto flex gap-2">
            <el-button type="primary">查询</el-button>
            <el-button type="info" plain>重置</el-button>
          </div>
        </div>
      </ElCard>

      <ElCard class="col-span-12 mt-4" shadow="never">
        <div class="operation-buttons">
          <el-button type="primary" :icon="Plus">新增班级</el-button>
          <el-button type="primary"> 导入班级</el-button>
          <el-button type="info" plain @click="downloadTemplate"> 下载班级课程表模板</el-button>
        </div>
      </ElCard>

      <ElCard class="col-span-12 mt-4" shadow="never">
        <el-table
          :data="displayData"
          v-loading=""
          border
          stripe
          highlight-current-row
          class="data-table__content"
        >
          <el-table-column label="id" prop="id"></el-table-column>
          <el-table-column label="班级名称" prop="className"></el-table-column>
          <el-table-column label="年级" prop="grade"></el-table-column>
          <el-table-column label="专业" prop="subject"></el-table-column>
          <el-table-column label="人数" prop="total"></el-table-column>
          <el-table-column label="出勤情况">
            <template #default="scope">
              <el-button type="primary" link @click="goToDetail(scope.row.id)"> 查看 </el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="">
              <el-button type="primary" :icon="Edit" link size="small"> 编辑 </el-button>
              <el-button type="danger" :icon="Delete" link size="small"> 删除 </el-button>
            </template>
          </el-table-column>
        </el-table>
      </ElCard>

      <div class="col-span-12 mt-10 mb-15 flex justify-center">
        <ElPagination
          background
          layout="prev, pager, next, sizes, total"
          :total="total"
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { Plus } from '@element-plus/icons-vue'
  import { Edit, Delete } from '@element-plus/icons-vue'
  import { useRouter } from 'vue-router'
  import { fetchTemplate, fetchGetClassList } from '../../api/class'
  import { useUserStore } from '@/store/modules/user'
  import { majorOptions, gradeOptions } from './select'
  import { mockClassList } from './mock'
  
  const classList = ref([])
  const total = classList.length
  const currentPage = ref(1)
  const pageSize = ref(10)
  const userStore = useUserStore()

  const gradeValue = ref<string>('')
  const majorValue = ref<string>('')

  const router = useRouter()
  function goToDetail(id: string) {
    router.push({
      name: 'attendance',
      params: { id }
    })
  }
  function handlePageChange(page: number) {
    currentPage.value = page
  }

  function handleSizeChange(size: number) {
    pageSize.value = size
    currentPage.value = 1
  }
  const displayData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return classList.value.slice(start, end)
  })

  const downloadTemplate = async () => {
    const { getToken: token } = useUserStore
    const blob = await fetchTemplate(token)
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = '班级导入模板.xlsx'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const getClassList = async () => {
    const { getToken: token } = userStore
    const { getUserInfo: userInfo } = userStore
    const data = await fetchGetClassList(token, {
      teacherNo: userInfo.id,
      pageNum: currentPage.value,
      pageSize: pageSize.value
    })
    classList.value = data.records.length === 0 ? mockClassList : data.records
  }

  onMounted(() => {
    getClassList()
  })
</script>
