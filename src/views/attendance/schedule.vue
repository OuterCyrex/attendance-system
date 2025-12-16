<template>
    <div class="schedule-page pa-1">
        <el-card class="header-card" shadow="never">
            <div class="header">
                <div>
                    <div class="text-2xl font-semibold">{{ schedule.courseName }}</div>
                    <div class="text-sm text-gray-500 mt-2">
                        {{ schedule.className }} · {{ schedule.schoolYear }} 学年 第 {{ schedule.semester }} 学期
                    </div>
                </div>
                <el-tag size="large" type="success" effect="dark">周{{ weekdayText }}</el-tag>
            </div>
        </el-card>

        <div class="mt-4 grid grid-cols-12 gap-4">
            <div class="col-span-3 space-y-4">
                <el-card shadow="never">
                    <div class="text-xl font-semibold mb-3">课程信息</div>
                    <div class="text-sm text-gray-600 space-y-2">
                        <div><span class="font-medium">课程名称：</span>{{ schedule.courseName }}</div>
                        <div><span class="font-medium">班级：</span>{{ schedule.className }}</div>
                        <div><span class="font-medium">学年：</span>{{ schedule.schoolYear }}</div>
                        <div><span class="font-medium">学期：</span>第 {{ schedule.semester }} 学期</div>
                        <div><span class="font-medium">上课时间：</span>{{ schedule.startTime }} - {{ schedule.endTime }}
                        </div>
                        <div><span class="font-medium">上课地点：</span>{{ schedule.classroom }}</div>
                    </div>
                </el-card>

                <el-card shadow="never">
                    <div class="text-xl font-semibold mb-3">最近一次考勤</div>
                    <div class="grid grid-cols-2 gap-3">
                        <div class="stat-box">
                            <div class="label">应到人数</div>
                            <div class="value">{{ latestRecord.expectedCount }}</div>
                        </div>
                        <div class="stat-box">
                            <div class="label">实到人数</div>
                            <div class="value">{{ latestRecord.actualCount }}</div>
                        </div>
                        <div class="stat-box col-span-2">
                            <div class="label">出勤率</div>
                            <div class="value text-blue-600">
                                {{ latestRecord.attendanceRate }}%
                            </div>
                        </div>
                    </div>

                    <div class="flex">
                        <el-button class="ml-auto mr-4 mt-2" type="primary" @click="manualAttendance"
                            v-loading="buttonLoading">手动考勤</el-button>
                    </div>
                </el-card>
            </div>

            <div class="col-span-9">
                <el-card shadow="never">
                    <div class="text-xl font-semibold mb-4">考勤记录</div>
                    <el-table :data="attendanceList" border stripe style="min-height: 500px;" v-loading="tableLoading"
                        empty-text="暂无考勤数据">
                        <el-table-column prop="checkTime" label="考勤时间" width="180" />
                        <el-table-column prop="expectedCount" label="应到" width="80" />
                        <el-table-column prop="actualCount" label="实到" width="80" />
                        <el-table-column label="出勤率" width="100">
                            <template #default="{ row }">
                                {{ row.attendanceRate }}%
                            </template>
                        </el-table-column>
                        <el-table-column label="考勤方式" width="120">
                            <template #default="{ row }">
                                {{ checkTypeMap[row.checkType] }}
                            </template>
                        </el-table-column>
                        <el-table-column label="状态" width="100">
                            <template #default="{ row }">
                                <el-tag :type="row.status === 1 ? 'success' : 'danger'">
                                    {{ row.status === 1 ? '正常' : '异常' }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="remark" label="备注" />
                    </el-table>
                    <div class="col-span-12 mt-10 mb-15 flex justify-center">
                        <ElPagination background layout="prev, pager, next, sizes, total" :total="total"
                            v-model:current-page="currentPage" v-model:page-size="pageSize"
                            @current-change="handlePageChange" @size-change="handleSizeChange" />
                    </div>
                </el-card>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { fetchGetSchedule } from '../../api/schedule'
import { fetchGetAttendanceList, fetchManualAttendance } from '../../api/attendance'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/store/modules/user'
import { userInfo } from 'os'

const userStore = useUserStore()
const { getToken: token } = userStore
const { getUserInfo: userInfo } = userStore

const pageSize = ref(10)
const total = ref(0)
const currentPage = ref(1)

const route = useRoute()
const recordId = route.params.id as string
const tableLoading = ref(false)
const buttonLoading = ref(false)

const schedule = ref({
    id: '',
    courseName: '',
    teacherNo: '',
    className: '',
    weekday: 1,
    startTime: '',
    endTime: '',
    classroom: '',
    semester: '',
    schoolYear: '',
})
const attendanceList = ref<attendanceInfo[]>([])

const getScheduleDetail = async () => {
    schedule.value = await fetchGetSchedule(token, recordId)
}

const getAttendanceList = async () => {
    const params = {
        courseId: recordId,
        date: userInfo.date,
        pageNum: currentPage.value,
        pageSize: pageSize.value
    }
    tableLoading.value = true
    const data = await fetchGetAttendanceList(token, params)
    attendanceList.value = data.records
    total.value = data.total
    tableLoading.value = false
}

const manualAttendance = async () => {
    buttonLoading.value = true
    await fetchManualAttendance(token, recordId)
    getAttendanceList()
    buttonLoading.value = false
}

const handlePageChange = (page: number) => {
    currentPage.value = page
    getAlertList()
}

const handleSizeChange = (size: number) => {
    pageSize.value = size
    currentPage.value = 1
    getAlertList()
}

const latestRecord = computed(() => {
    return (
        attendanceList.value[attendanceList.value.length - 1] || {
            expectedCount: 0,
            actualCount: 0,
            attendanceRate: 0,
        }
    )
})

const weekdayText = computed(() => {
    const map = ['一', '二', '三', '四', '五', '六', '日']
    return map[schedule.value.weekday - 1] || '-'
})

const checkTypeMap: Record<number, string> = {
    1: '自动',
    2: '手动',
}

/* ===== 生命周期 ===== */
onMounted(() => {
    getScheduleDetail()
    getAttendanceList()
})
</script>

<style scoped lang="scss">
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>