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
                            <teacherSelect :collegeName="collegeName || ''" @selected="handleTeacherSelected"
                                :disabled="collegeName === ''" :reset="resetFlag" style="width: 200px" />
                        </div>

                        <div class="flex items-center">
                            <div class="mr-2 text-gray-500">班级名称：</div>
                            <classSelect :teacherNo="teacherNo" @selected="handleClassSelected"
                                :disabled="teacherNo === ''" style="width: 200px" :reset="resetFlag" />
                        </div>


                        <div v-if="userRole !== 'teacher'" class="flex items-center">
                            <div class="mr-2 text-gray-500">课程类型：</div>
                            <el-select v-model="courseType" placeholder="请选择类型" style="width: 200px">
                                <el-option v-for="item in courseTypeList" :value="item" :label="item"></el-option>
                            </el-select>
                        </div>
                    </div>

                    <div class="flex items-center gap-4">
                        <div v-if="userRole !== 'teacher'" class="flex items-center">
                            <div class="mr-2 text-gray-500">任课教师：</div>
                            <el-input v-model="courseTeacher" placeholder="请输入任课教师姓名" style="width: 200px;"></el-input>
                        </div>

                        <div v-if="userRole !== 'teacher'" class="flex items-center">
                            <div class="mr-2 text-gray-500">课序号：</div>
                            <el-select v-model="orderNo" placeholder="请选择课序号" style="width: 200px">
                                <el-option v-for="value in orderList" :key="value" :label="value"
                                    :value="value"></el-option>
                            </el-select>
                        </div>

                        <div class="flex items-center">
                            <div class="mr-2 text-gray-500">学期：</div>
                            <el-select v-model="semester" placeholder="请选择学期" style="width: 200px">
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
                    <el-table-column label="课程编号" prop="courseNo" width="120"></el-table-column>
                    <el-table-column label="课程名称" prop="courseName" width="150"></el-table-column>
                    <el-table-column label="教师姓名" prop="teacherName" width="120"></el-table-column>
                    <el-table-column label="学期" prop="semesterName" width="120"></el-table-column>
                    <el-table-column label="班级名称" min-width="200" show-overflow-tooltip>
                        <template #default="scope">
                            {{ scope.row.classNames.join('、') }}
                        </template>
                    </el-table-column>
                    <el-table-column label="课序号" prop="orderNo" width="120"></el-table-column>
                    <el-table-column label="应到人数" prop="expectedCount" width="100"></el-table-column>
                    <el-table-column label="实到人数" prop="actualCount" width="100"></el-table-column>
                    <el-table-column label="出勤率(%)" prop="attendanceRate" width="120">
                        <template #default="scope">
                            <el-progress :percentage="scope.row.attendanceRate" :stroke-width="15"
                                :color="getAttendanceRateColor(scope.row.attendanceRate)" />
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
                    <el-table-column label="状态" prop="status" width="100">
                        <template #default="{ row }">
                            <el-tag :type="StatusConfig[row.status]?.type || 'info'" size="small">
                                {{ StatusConfig[row.status]?.label || '未知' }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="考勤类型" prop="checkType" width="120">
                        <template #default="{ row }">
                            <el-tag :type="CheckTypeConfig[row.checkType]?.type || 'info'" size="small">
                                {{ CheckTypeConfig[row.checkType]?.label || '未知' }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column label="备注" prop="remark" min-width="150"></el-table-column>

                    <el-table-column label="考勤时间" fixed="right" width="180">
                        <template #default="scope">
                            {{ scope.row.checkTime ? scope.row.checkTime.replace('T', ' ') : '-' }}
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
import { Download } from '@element-plus/icons-vue'
import { fetchQueryAttendanceReport, fetchAttendanceReportExcel } from '@/api/report'
import { useUserStore } from '@/store/modules/user'
import { fetchSemesterList, fetchOrderList, fetchGetCourseType } from '@/api/misc'
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
const courseTypeList = ref<Array<string>>([])
const dateRange = ref<string[]>()

const collegeName = ref<string>('')
const teacherNo = ref<string>('')
const className = ref<string>('')
const courseType = ref<string>('')
const orderNo = ref<string>('')
const semester = ref<string>('')
const courseTeacher = ref<string>('')

const userStore = useUserStore()
const { getUserInfo: userInfo } = userStore

const resetFlag = ref(false)

const handleCollegeSelected = async (college: Api.Misc.collegeInfo) => {
    collegeName.value = college.name
}

const handleTeacherSelected = (teacher: Api.Teacher.teacherInfo) => {
    teacherNo.value = teacher.teacherNo
}

const handleClassSelected = (classInfo: Api.Class.classInfo) => {
    className.value = classInfo.className
}

const userRole = computed(() => {
    const roles = userInfo.role
    if (!roles) return ''
    if (roles.includes('college_admin')) return 'college_admin'
    if (roles.includes('admin')) return 'admin'
    if (roles.includes('teacher')) return 'teacher'
    return ''
})

const handlePageChange = (page: number) => {
    currentPage.value = page
    handleGetAttendanceList()
}

const handleSizeChange = (size: number) => {
    pageSize.value = size
    currentPage.value = 1
    handleGetAttendanceList()
}

const toArray = (value: string) => value ? [value] : [];

const handleGetAttendanceList = async () => {
    tableLoading.value = true
    const startDate = dateRange.value && dateRange.value[0] ? dateRange.value[0] : ''
    const endDate = dateRange.value && dateRange.value[1] ? dateRange.value[1] : ''
    await fetchQueryAttendanceReport({
        collegeNames: toArray(collegeName.value),
        teacherNos: toArray(teacherNo.value),
        orderNos: toArray(orderNo.value),
        courseTypes: toArray(courseType.value),
        classNames: toArray(className.value),
        courseTeachers: toArray(courseTeacher.value),
        startDate: startDate,
        endDate: endDate,
        pageNum: currentPage.value,
        pageSize: pageSize.value
    }).then(res => {
        attendanceList.value = res.records || []
        total.value = res.total || 0
    }).finally(() => {
        tableLoading.value = false
    })
}

const handleSearch = () => {
    currentPage.value = 1
    handleGetAttendanceList()
}

const handleGetOrderList = async () => {
    await fetchOrderList().then(data => orderList.value = data)
}

const resetSearch = () => {
    collegeName.value = ''
    teacherNo.value = ''
    className.value = ''
    courseType.value = ''
    orderNo.value = ''
    semester.value = ''
    dateRange.value = []
    courseTeacher.value = ''
    resetFlag.value = !resetFlag.value
    teacherNo.value = ''
    if (userInfo.role === 'collegeAdmin') collegeName.value = userInfo.collegeName || ''
    if (userInfo.role === 'teacher') {
        teacherNo.value = userInfo.teacherNo || ''
    }

    handleSearch()
}


const exportReport = async () => {
    await fetchAttendanceReportExcel({
        collegeNames: toArray(collegeName.value),
        teacherNos: toArray(teacherNo.value),
        orderNos: toArray(orderNo.value),
        courseTypes: toArray(courseType.value),
        classNames: toArray(className.value),
        pageNum: 1,
        pageSize: 10000
    }).then(blob => {
        const a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = '考勤报表.xlsx'
        a.click()
        URL.revokeObjectURL(a.href)
    })

}

onMounted(async () => {
    await handleGetAttendanceList()
    await handleGetOrderList()
    semesterList.value = await fetchSemesterList()
    courseTypeList.value = await fetchGetCourseType()
})


const CheckTypeConfig: Record<number, { label: string; type: 'success' | 'warning' }> = {
    1: { label: '自动', type: 'success' },
    2: { label: '手动', type: 'warning' }
}

const StatusConfig: Record<number, { label: string; type: 'success' | 'danger' }> = {
    1: { label: '正常', type: 'success' },
    2: { label: '异常', type: 'danger' }
}

const getAttendanceRateColor = (rate: number) => {
    if (rate >= 90) return '#67c23a'
    if (rate >= 70) return '#e6a23c'
    return '#f56c6c'
}
</script>
