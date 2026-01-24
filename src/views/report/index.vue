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
                            <div class="mr-2 text-gray-500">辅导员：</div>
                            <teacherSelect :collegeName="searchForm.collegeNames[0]" @selected="handleTeacherSelected"
                                :disabled="collegeName === ''" :reset="resetFlag" style="width: 200px" />
                        </div>

                        <div class="flex items-center">
                            <div class="mr-2 text-gray-500">班级名称：</div>
                            <classSelect :teacherNo="teacherNo" @selected="handleClassSelected"
                                :disabled="teacherNo === ''" style="width: 200px" :reset="resetFlag" />
                        </div>


                        <div v-if="userRole !== 'teacher'" class="flex items-center">
                            <div class="mr-2 text-gray-500">课程：</div>
                            <el-select v-model="searchForm.courseTypes" placeholder="请选择类型" style="width: 200px"
                                clearable multiple collapse-tags>
                                <el-option label="必修课" value="required"></el-option>
                                <el-option label="选修课" value="elective"></el-option>
                                <el-option label="实验课" value="lab"></el-option>
                            </el-select>
                        </div>
                    </div>

                    <div class="flex items-center gap-4">
                        <div v-if="userRole !== 'teacher'" class="flex items-center">
                            <div class="mr-2 text-gray-500">任课教师：</div>
                            <el-input v-model="inputInfo.courseTeachers" placeholder="请输入任课教师姓名"
                                style="width: 200px;"></el-input>
                        </div>

                        <div v-if="userRole !== 'teacher'" class="flex items-center">
                            <div class="mr-2 text-gray-500">课序号：</div>
                            <el-select v-model="searchForm.orderNos" placeholder="请选择课序号" style="width: 200px" clearable
                                multiple collapse-tags>
                                <el-option v-for="value in orderList" :key="value" :label="value"
                                    :value="value"></el-option>
                            </el-select>
                        </div>

                        <div class="flex items-center">
                            <div class="mr-2 text-gray-500">学期：</div>
                            <el-select v-model="searchForm.semester" placeholder="请选择学期" style="width: 200px" clearable
                                multiple collapse-tags>
                                <el-option v-for="value in semesterList" :key="value" :label="value"
                                    :value="value"></el-option>
                            </el-select>
                        </div>

                        <div class="flex items-center">
                            <div class="mr-2 text-gray-500">日期：</div>
                            <el-date-picker v-model="dateRange" type="daterange" range-separator="至"
                                start-placeholder="开始日期" end-placeholder="结束日期" value-format="YYYY-MM-DD"
                                style="width: 240px" clearable />
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
                        <template #default="{ row }">
                            <el-tag :type="CheckTypeConfig[row.checkType]?.type || 'info'" size="small">
                                {{ CheckTypeConfig[row.checkType]?.label || '未知' }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="状态" prop="status" width="100">
                        <template #default="{ row }">
                            <el-tag :type="StatusConfig[row.status]?.type || 'info'" size="small">
                                {{ StatusConfig[row.status]?.label || '未知' }}
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
import { fetchSemesterList, fetchOrderList } from '@/api/misc'
import collegeSelect from '@/components/select/collegeSelect.vue'
import classSelect from '@/components/select/classSelect.vue'
import teacherSelect from '@/components/select/teacherSelect.vue'

const currentPage = ref(1)
const total = ref(0)
const pageSize = ref(10)
const tableLoading = ref(false)
const attendanceList = ref([])
const semesterList = ref([])
const orderList = ref([])
const dateRange = ref<string[]>()
const collegeName = ref('')
const teacherNo = ref('')

const searchForm = reactive({
    orderNos: [] as string[],
    courseTypes: [] as string[],
    semester: [] as string[],
    collegeNames: [] as string[],
    teacherNames: [] as string[],
    classNames: [] as string[],
})

const inputInfo = ref({
    courseTeachers: ''
})

const userStore = useUserStore()
const { getToken: token } = userStore
const { getUserInfo: userInfo } = userStore

const resetFlag = ref(false)

const handleCollegeSelected = async (college: Api.Misc.collegeInfo) => {
    searchForm.collegeNames = [college.name]
    collegeName.value = college.name
}

const handleTeacherSelected = (teacher: Api.Teacher.teacherInfo) => {
    searchForm.teacherNames = [teacher.realName]
    teacherNo.value = teacher.teacherNo
}

const handleClassSelected = (classInfo: Api.Class.classInfo) => {
    searchForm.classNames = [classInfo.className]
}

const userRole = computed(() => {
    const roles = userInfo?.role || []
    if (roles.includes('college_admin')) return 'college_admin'
    if (roles.includes('admin')) return 'admin'
    if (roles.includes('teacher')) return 'teacher'
    return ''
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

    const finalTeacherNames = splitToArray(inputInfo.value.courseTeachers)

    const startDate = dateRange.value && dateRange.value[0] ? dateRange.value[0] : ''
    const endDate = dateRange.value && dateRange.value[1] ? dateRange.value[1] : ''

    const params = {
        ...searchForm,
        courseTeachers: finalTeacherNames,
        startDate: startDate,
        endDate: endDate,
        pageNum: currentPage.value,
        pageSize: pageSize.value
    }

    const response = await fetchQueryAttendanceReport(params)
    attendanceList.value = response.records || []
    total.value = response?.total || 0
    tableLoading.value = false
}

const handleSearch = () => {
    currentPage.value = 1
    getAttendanceList()
}

const resetSearch = () => {
    Object.keys(searchForm).forEach(key => {
        (searchForm as any)[key] = []
    })
    dateRange.value = []
    inputInfo.value.courseTeachers = ''
    resetFlag.value = !resetFlag.value

    handleSearch()
}

const CheckTypeConfig: Record<number, { label: string; type: string }> = {
    1: { label: '自动', type: 'success' },
    2: { label: '手动', type: 'warning' }
}

const StatusConfig: Record<number, { label: string; type: string }> = {
    1: { label: '正常', type: 'success' },
    2: { label: '异常', type: 'danger' }
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
        const exportParams = {
            ...searchForm,
            pageNum: 1,
            pageSize: 99999
        }

        // 调用实际的导出接口
        const response = await fetchAttendanceReportExcel(exportParams)

        const blob = response instanceof Blob
            ? response
            : new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

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

onMounted(async () => {
    const promises = [getAttendanceList(), fetchSemesterList()]

    if (userRole.value !== 'teacher') {
        promises.push(fetchOrderList().then(data => orderList.value = data))
    }

    const [_, semesterData] = await Promise.all(promises)
    semesterList.value = semesterData
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