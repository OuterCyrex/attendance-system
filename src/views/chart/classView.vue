<template>
    <div class="class-chart-container">
        <div class="grid grid-cols-12 w-full">

            <ElCard class="col-span-12" shadow="never">
                <div class="mb-4 font-semibold text-xl">班级出勤情况图表 </div>
                <div class="flex flex-wrap items-center gap-4">

                    <div v-if="userInfo.role === 'admin'" class="flex items-center">
                        <span class="mr-2 text-gray-500 text-sm">学院名称:</span>
                        <collegeSelect @selected="handleCollegeSelect" :reset="resetFlag" />
                    </div>

                    <div v-if="userInfo.role !== 'teacher'" class="flex items-center">
                        <span class="mr-2 text-gray-500 text-sm">辅导员名称:</span>
                        <teacherSelect @selected="handleTeacherSelect" :collegeNo="collegeNo"
                            :disabled="collegeNo === ''" :reset="resetFlag" />
                    </div>

                    <div class="flex items-center">
                        <span class="mr-2 text-gray-500 text-sm">班级名称:</span>
                        <classSelect @selected="handleClassSelect" :teacherNo="teacherNo"
                            :disabled="teacherNo === ''" :reset="resetFlag" />
                    </div>

                    <div class="flex items-center">
                        <span class="mr-2 text-gray-500 text-sm">学期:</span>
                        <el-select v-model="semesterName" placeholder="请选择学期" style="width: 160px">
                            <el-option v-for="value in semesterList" :label="value" :value="value"></el-option>
                        </el-select>
                    </div>


                    <div class="ml-auto flex gap-2">
                        <el-button type="primary" @click="handleSearch">查询</el-button>
                        <el-button type="info" plain @click="resetSearch">重置</el-button>
                    </div>
                </div>
            </ElCard>

            <ElCard class="col-span-12 mt-4" shadow="never" v-loading="chartLoading">
                <div class="flex">
                    <classChart :data="classChartData" @change="handleGranularityChange" :loading="chartLoading" />
                </div>
            </ElCard>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useUserStore } from '@/store/modules/user'
import collegeSelect from '@/components/select/collegeSelect.vue'
import teacherSelect from '@/components/select/teacherSelect.vue'
import classSelect from '@/components/select/classSelect.vue'
import { fetchSemesterList } from '@/api/misc'
import { fetchGetClassChart } from '@/api/chart'
import classChart from './classChart.vue'

const userStore = useUserStore()
const { getUserInfo: userInfo } = userStore
const chartLoading = ref<boolean>(false)

const collegeName = ref<string>('')
const collegeNo = ref<string>('')
const handleCollegeSelect = (college: Api.Misc.collegeInfo) => {
    collegeName.value = college.name
    collegeNo.value = college.collegeNo
    console.log(collegeNo.value)
}

const teacherName = ref<string>('')
const teacherNo = ref<string>('')
const handleTeacherSelect = (teacher: Api.Teacher.teacherInfo) => {
    teacherName.value = teacher.realName
    teacherNo.value = teacher.teacherNo

}

const className = ref<string>('')
const classNo = ref<string>('')
const handleClassSelect = (classinfo: Api.Class.classInfo) => {
    className.value = classinfo.className
    classNo.value = classinfo.id
}

const semesterName = ref<string>('')
const semesterList = ref<Array<string>>([])
const getSemesterList = async () => {
    const data = await fetchSemesterList()
    semesterList.value = data
}

const granularity = ref<number>(2)
const classChartData = ref<Array<{
    date: string
    attendRate: number
}>>([])
const getClassChart = async () => {
    chartLoading.value = true
    const data = await fetchGetClassChart({
        teacherName: teacherName.value,
        className: className.value,
        semesterName: semesterName.value,
        collegeName: collegeName.value,
        granularity: granularity.value
    })
    classChartData.value = data
    chartLoading.value = false
}

const handleGranularityChange = async (value: number) => {
    granularity.value = value
    await getClassChart()
}

const handleSearch = () => {
    getClassChart()
}

const resetFlag = ref<boolean>(false)
const resetSearch = () => {
    chartLoading.value = true
    resetFlag.value = !resetFlag.value
    collegeName.value = ''
    collegeNo.value = ''
    teacherName.value = ''
    teacherNo.value = ''
    className.value = ''
    classNo.value = ''
    semesterName.value = ''
    granularity.value = 2
    classChartData.value = []
    chartLoading.value = false

    if (userInfo.role === 'college_admin') collegeNo.value = userInfo.collegeNo || ''
    if (userInfo.role === 'teacher') teacherNo.value = userInfo.teacherNo || ''
}

onMounted(() => {
    getSemesterList()
    resetSearch()
})
</script>