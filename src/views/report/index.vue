<template>
    <div class="report-container">
        <div class="grid grid-cols-12 w-full">

            <ElCard class="col-span-12" shadow="never">
                <div class="flex flex-col gap-4">
                    <div class="flex items-center gap-4">
                        <div v-if="userRole === 'admin'" class="flex items-center">
                            <div class="mr-2 text-gray-500">学院名称：</div>
                            <collegeSelect @selected="handleCollegeSelected" :reset="resetFlag" style="width: 200px" />
                        </div>

                        <div v-if="userRole !== 'teacher'" class="flex items-center">
                            <div class="mr-2 text-gray-500">任课教师：</div>
                            <el-input v-model="inputInfo.teacherNames" placeholder="请输入姓名" style="width: 200px"
                                clearable></el-input>
                        </div>

                        <div v-if="userRole !== 'teacher'" class="flex items-center">
                            <div class="mr-2 text-gray-500">课程类型：</div>
                            <el-select v-model="searchForm.courseTypes" placeholder="请选择类型" style="width: 200px" clearable
                                multiple collapse-tags>
                                <el-option label="必修课" value="required"></el-option>
                                <el-option label="选修课" value="elective"></el-option>
                                <el-option label="实验课" value="lab"></el-option>
                            </el-select>
                        </div>
                    </div>

                    <div class="flex items-center gap-4">
                        <div v-if="userRole !== 'teacher'" class="flex items-center">
                            <div class="mr-2 text-gray-500">辅导员工号：</div>
                            <el-input v-model="inputInfo.teacherNos" placeholder="请输入工号" style="width: 200px"
                                clearable></el-input>
                        </div>

                        <div class="flex items-center">
                            <div class="mr-2 text-gray-500">班级名称：</div>
                            <el-input v-model="inputInfo.classNames" placeholder="请输入班级" style="width: 200px"
                                clearable></el-input>
                        </div>

                        <div v-if="userRole !== 'teacher'" class="flex items-center">
                            <div class="mr-2 text-gray-500">课序号：</div>
                            <el-select v-model="searchForm.orderNos" placeholder="请选择课序号" style="width: 200px" clearable multiple
                                collapse-tags>
                                <el-option v-for="value in orderList" :key="value" :label="value"
                                    :value="value"></el-option>
                            </el-select>
                        </div>

                        <div class="flex items-center">
                            <div class="mr-2 text-gray-500">学期：</div>
                            <el-select v-model="searchForm.semester" placeholder="请选择学期" style="width: 200px" clearable multiple
                                collapse-tags>
                                <el-option v-for="value in semesterList" :key="value" :label="value"
                                    :value="value"></el-option>
                            </el-select>
                        </div>

                        <div class="ml-auto flex gap-2">
                            <el-button type="primary" @click="handleSearch">查询</el-button>
                            <el-button type="info" plain @click="resetSearch">重置</el-button>
                        </div>
                    </div>
                </div>
            </ElCard>

            <ElCard class="col-span-12 mt-4" shadow="never">
                <div class="operation-buttons flex">
                    <el-button type="primary" :icon="Download" @click="exportReport">导出报表</el-button>
                </div>
            </ElCard>

            <ElCard class="col-span-12 mt-4" shadow="never">
                <el-table :data="attendanceList" v-loading="tableLoading" border stripe highlight-current-row
                    class="data-table__content" style="min-height: 560px">
                    <el-table-column label="序号" type="index" width="60"></el-table-column>
                    <el-table-column label="课程编号" prop="courseNo" width="120"></el-table-column>
                    <el-table-column label="课程名称" prop="courseName" width="150"></el-table-column>
                    <el-table-column label="教师姓名" prop="teacherName" width="120"></el-table-column>
                    <el-table-column label="课程类型" prop="courseType" width="120"></el-table-column>
                    <el-table-column label="学期" prop="semesterName" width="120"></el-table-column>
                    <el-table-column label="班级名称" width="200">
                        <template #default="scope">
                            <div v-for="className in scope.row.classNames" :key="className" class="
    bg-blue-100 text-blue-500 border border-blue-200 rounded px-2 py-1 text-xs break-all
    inline-flex justify-center items-center text-center">
                                {{ className }}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="课序号" prop="orderNo" width="120"></el-table-column>
                    <el-table-column label="考勤时间" width="180">
                        <template #default="scope">
                            {{ scope.row.checkTime ? scope.row.checkTime.replace('T', ' ') : '-' }}
                        </template>
                    </el-table-column>
                    <el-table-column label="应到人数" prop="expectedCount" width="100"></el-table-column>
                    <el-table-column label="实到人数" prop="actualCount" width="100"></el-table-column>
                    <el-table-column label="出勤率(%)" prop="attendanceRate" width="120">
                        <template #default="scope">
                            <el-progress :percentage="scope.row.attendanceRate" :stroke-width="15"
                                :color="getAttendanceRateColor(scope.row.attendanceRate)" />
                        </template>
                    </el-table-column>
                    <el-table-column label="考勤类型" prop="checkType" width="120">
                        <template #default="scope">
                            <el-tag :type="getCheckTypeTagType(scope.row.checkType)" size="small">
                                {{ getCheckTypeName(scope.row.checkType) }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" prop="status" width="100">
                        <template #default="scope">
                            <el-tag :type="getStatusType(scope.row.status)" size="small">
                                {{ getStatusName(scope.row.status) }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="考勤图片" width="150">
                        <template #default="scope">
                            <el-image v-if="scope.row.imageUrl" :src="scope.row.imageUrl"
                                :preview-src-list="[scope.row.imageUrl]" preview-teleported
                                style="width: 100px; height: 60px; object-fit: cover;" fit="cover" :alt="'签到图片'" />
                            <span v-else>暂无图片</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="备注" prop="remark" min-width="150"></el-table-column>
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
import { Download } from '@element-plus/icons-vue'
import { fetchQueryAttendanceReport, fetchAttendanceReportExcel } from '@/api/report'
import { useUserStore } from '@/store/modules/user'
import { fetchGetCollegeList, fetchSemesterList, fetchOrderList } from '@/api/misc'
import collegeSelect from '@/components/select/collegeSelect.vue'

const currentPage = ref(1)
const total = ref(0)
const pageSize = ref(10)
const tableLoading = ref(false)
const attendanceList = ref([])
const semesterList = ref([])
const orderList = ref([])

const searchForm = reactive({
    orderNos: [],
    courseTypes: [],
    semester: [],
    collegeNames: []
})

const inputInfo = ref({
    classNames: '',
    teacherNames: '',
    teacherNos: ''
})

const userStore = useUserStore()
const { getToken: token } = userStore
const { getUserInfo: userInfo } = userStore

const resetFlag = ref(false)

const handleCollegeSelected = async (college: Api.Misc.collegeInfo) => {
    searchForm.collegeNames = [college.name]
}

// 获取用户角色
const userRole = computed(() => {
    if (userInfo?.role) {
        if (userInfo.role.includes('college_admin')) {
            return 'college_admin'
        } else if (userInfo.role.includes('admin')) {
            return 'admin'
        } else if (userInfo.role.includes('teacher')) {
            return 'teacher'
        }
    }
})

const handlePageChange = (page: number) => {
    currentPage.value = page
    getAttendanceList()
}

const handleSizeChange = (size: number) => {
    pageSize.value = size
    currentPage.value = 1
    getAttendanceList()
}

const splitToArray = (value?: string) => {
    return value
        ? value
            .replace(/，/g, ',')
            .split(',')
            .map(item => item.trim())
            .filter(item => item !== '')
        : []
}

const getAttendanceList = async () => {
    tableLoading.value = true

    let finalClassNames: string[] = []
    finalClassNames = splitToArray(inputInfo.value.classNames)

    let finalTeacherNames: string[] = []
    finalTeacherNames = splitToArray(inputInfo.value.teacherNames)

    let finalTeacherNos: string[] = []
    finalTeacherNos = splitToArray(inputInfo.value.teacherNos)


    const params: any = {
        collegeNames: searchForm.collegeNames.length > 0 ? searchForm.collegeNames : (userInfo?.collegeNames || []),
        teacherNos: finalTeacherNos,
        teacherNames: finalTeacherNames,
        orderNos: searchForm.orderNos,
        courseTypes: searchForm.courseTypes.length > 0 ? searchForm.courseTypes : (userInfo?.courseTypes || []),
        classNames: finalClassNames,
        semester: searchForm.semester.length > 0 ? searchForm.semester : (userInfo?.semester || []),
        pageNum: currentPage.value,
        pageSize: pageSize.value
    }

    const response = await fetchQueryAttendanceReport(params)
    attendanceList.value = response?.records || []
    total.value = response?.total || 0
    tableLoading.value = false
}

const handleSearch = () => {
    currentPage.value = 1
    getAttendanceList()
}

const resetSearch = () => {
    // 重置所有搜索字段
    searchForm.collegeNames = []
    inputInfo.value.teacherNos = ''
    searchForm.orderNos = []
    searchForm.courseTypes = []
    inputInfo.value.classNames = ''
    searchForm.semester = []
    inputInfo.value.teacherNames = ''

    resetFlag.value = !resetFlag.value

    currentPage.value = 1
    getAttendanceList()
}

const getCheckTypeTagType = (type: number) => {
    switch (type) {
        case 1:
            return 'success' // 自动签到用绿色
        case 2:
            return 'warning' // 手动签到用黄色
        default:
            return 'info'    // 默认用蓝色
    }
}

// 获取签到类型名称
const getCheckTypeName = (type: number) => {
    switch (type) {
        case 1:
            return '自动'
        case 2:
            return '手动'
        default:
            return '未知'
    }
}


// 获取状态类型
const getStatusType = (status: number) => {
    switch (status) {
        case 1:
            return 'success' // 正常状态用绿色
        case 2:
            return 'danger'  // 异常状态用红色
        default:
            return 'info'    // 默认状态用蓝色
    }
}

// 获取状态名称
const getStatusName = (status: number) => {
    switch (status) {
        case 1:
            return '正常'
        case 2:
            return '异常'
        default:
            return '未知'
    }
}

// 获取出勤率进度条颜色
const getAttendanceRateColor = (rate: number) => {
    if (rate >= 90) return '#67c23a' // 绿色 - 高出勤率
    if (rate >= 70) return '#e6a23c' // 黄色 - 中等出勤率
    return '#f56c6c' // 红色 - 低出勤率
}

// 导出报表
const exportReport = async () => {
    try {
        // 构建导出参数，使用与查询相同的参数
        let exportParams: any = {
            pageNum: 1,
            pageSize: 99999 // 导出所有数据
        }

        exportParams.collegeNames = searchForm.collegeNames
        exportParams.teacherNos = splitToArray(inputInfo.value.teacherNos)
        exportParams.teacherNames = splitToArray(inputInfo.value.teacherNames)
        exportParams.classNames = splitToArray(inputInfo.value.classNames)
        exportParams.courseTypes = searchForm.courseTypes
        exportParams.orderNos = searchForm.orderNos
        exportParams.semester = searchForm.semester

        // 调用实际的导出接口
        const response = await fetchAttendanceReportExcel(exportParams)

        // 检查响应是否为Blob类型
        let blob;
        if (response instanceof Blob) {
            blob = response;
        } else {
            // 如果响应不是Blob，尝试创建Blob
            blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        }

        // 创建下载链接
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `考勤报表_${new Date().toISOString().slice(0, 10)}.xlsx`;
        link.style.display = 'none';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // 释放URL对象
        URL.revokeObjectURL(url);

        ElMessage.success('报表导出成功');
    } catch (error) {
        console.error('导出报表失败:', error);
        ElMessage.error('报表导出失败，请联系管理员');
    }
}

const getSemesterList = async () => {
    const data = await fetchSemesterList()
    semesterList.value = data
}

const getOrderList = async () => {
    const data = await fetchOrderList()
    orderList.value = data
}

onMounted(() => {
    getAttendanceList()
    if (userRole.value !== 'teacher') {
        getOrderList()
    }
    getSemesterList()
})
</script>

<style scoped>
.report-container {
    padding: 20px;
}

.operation-buttons {
    margin-bottom: 16px;
}
</style>