<template>
    <div class="teacherManage-container">
        <div class="grid grid-cols-12 w-full">

            <ElCard class="col-span-12" shadow="never">
                <div class="flex flex-wrap items-center gap-4">
                    <div class="flex items-center">
                        <span class="mr-2 text-gray-500 text-sm">教师工号:</span>
                        <el-input v-model="searchForm.teacherNo" placeholder="请输入工号" style="width: 160px" clearable />
                    </div>

                    <div class="flex items-center">
                        <span class="mr-2 text-gray-500 text-sm">真实姓名:</span>
                        <el-input v-model="searchForm.realName" placeholder="模糊搜索" style="width: 160px" clearable />
                    </div>

                    <div class="flex items-center" v-if="userInfo.role === 'admin'">
                        <span class="mr-2 text-gray-500 text-sm">部门/学院:</span>
                        <el-select v-model="searchForm.department" placeholder="请选择部门/学院" style="width: 160px"
                            clearable>
                            <el-option v-for="item in departmentOption" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </div>

                    <div class="ml-auto flex gap-2">
                        <el-button type="primary" @click="handleSearch">查询</el-button>
                        <el-button type="info" plain @click="resetSearch">重置</el-button>
                    </div>
                </div>
            </ElCard>

            <ElCard class="col-span-12 mt-4" shadow="never">
                <div class="operation-buttons flex">
                    <el-button type="primary" :icon="Plus" @click="addDialogVisible = true">新增教师</el-button>
                    <el-upload class="mx-4" :auto-upload="false" :show-file-list="false" :on-change="handleFileChange"
                        accept=".xlsx,.xls">
                        <el-button type="primary">导入教师</el-button>
                    </el-upload>

                    <el-button type="info" plain @click="downloadTemplate">下载教师表模板</el-button>
                </div>
            </ElCard>

            <ElCard class="col-span-12 mt-4" shadow="never">
                <el-table :data="teacherList" v-loading="tableLoading" border stripe highlight-current-row
                    class="data-table__content" style="min-height: 560px">
                    <el-table-column label="用户名" prop="username"></el-table-column>
                    <el-table-column label="真实姓名" prop="realName"></el-table-column>
                    <el-table-column label="教师工号" prop="teacherNo"></el-table-column>
                    <el-table-column label="电话" prop="phone"></el-table-column>
                    <el-table-column label="邮箱" prop="email"></el-table-column>
                    <el-table-column label="所属部门/学院"
                        prop="department"></el-table-column>
                    <el-table-column label="是否禁用">
                        <template #default="scope">
                            <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">{{ scope.row.status === 1 ?
                                '启用' : `禁用` }}</el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template #default="scope">
                            <el-button type="primary" :icon="Edit" link size="small"
                                @click="UpdateTeacher(scope.$index)">
                                编辑 </el-button>
                            <el-popconfirm title="确认删除该教师吗？" confirm-button-text="确认" cancel-button-text="取消"
                                @confirm="DeleteTeacher">
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
        <AddForm v-if="addDialogVisible" @close="addDialogVisible = false" @submit="getTeacherList"/>
        <UpdateForm :id="teacherList[editIndex].id" :formData="teacherList[editIndex]" v-if="editDialogVisible"
            @close="editDialogVisible = false" @submit="getTeacherList"/>
    </div>
</template>

<script lang="ts" setup>
import { ref, reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { Edit, Delete } from '@element-plus/icons-vue'
import { departmentOption } from './select'
import UpdateForm from './updateForm.vue'
import AddForm from './addForm.vue'
import { fetchGetTeacherList } from '@/api/teacherMange'
import { useUserStore } from '@/store/modules/user'

const currentPage = ref(1)
const total = ref(0)
const pageSize = ref(10)
const tableLoading = ref(false)
const teacherList = ref([])
const editIndex = ref<number>(0)
const addDialogVisible = ref(false)
const editDialogVisible = ref(false)

const searchForm = reactive({
    teacherNo: '',
    department: '',
    realName: '',
})
const userStore = useUserStore()
const { getUserInfo: userInfo } = userStore

const handlePageChange = (page: number) => {
    currentPage.value = page
}

const handleSizeChange = (size: number) => {
    pageSize.value = size
    currentPage.value = 1
}

const getTeacherList = async () => {
    tableLoading.value = true
    const params = {
        pageNum: currentPage.value,
        pageSize: pageSize.value,
        teacherNo: searchForm.teacherNo,
        realName: searchForm.realName,
    }
    const data = await fetchGetTeacherList(params)
    teacherList.value = data.records
    tableLoading.value = false
}

const UpdateTeacher = (index: number) => {
    editIndex.value = index
    editDialogVisible.value = true
}

const DeleteTeacher = () => {

}

const handleSearch = () => {
    getTeacherList()
}

const resetSearch = () => {
    searchForm.teacherNo = ''
    searchForm.realName = ''
    searchForm.department = ''
    getTeacherList()
}

onMounted(() => getTeacherList())
</script>