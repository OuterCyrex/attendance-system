<template>
  <div>
    <ElCard class="col-span-12 font-bold text-2xl">{{ classDetail.className }}</ElCard>
    <ElCard class="col-span-12 mt-4">
      <div class="flex gap-4">
        <dataCard class="flex-1" :icon="'ri-git-repository-line'"
          :data="{ label: '专业名称', value: `${classDetail.major}` }"></dataCard>
        <dataCard class="flex-1" :icon="'ri-user-line'" :data="{ label: '总人数', value: `${classDetail.count}` }">
        </dataCard>
        <dataCard class="flex-1" :icon="'ri-group-fill'" :data="{ label: '年级', value: `${classDetail.grade}` }">
        </dataCard>
        <dataCard class="flex-1" :icon="'ri-bar-chart-2-line'" :data="{ label: '最近出勤率', value: `${classdata[0]}` }">
        </dataCard>
      </div>
    </ElCard>
    <ElCard class="col-span-12 mt-4">
      <ArtLineChart height="360px" :data="classdata" :xAxisData="xAxisData" :showLegend="true" :showAxisLabel="true"
        :showAxisLine="false" :showSplitLine="true" />
    </ElCard>
  </div>
</template>

<script setup lang="ts">
import { classData } from './mock'
import dataCard from './modules/dataCard.vue'
import { fetchAttendanceRateByClass } from '@/api/attendance'
import { fetchClassDetail } from '@/api/class'
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'

const xAxisData = ref<string[]>([])
const classdata = ref([])
const route = useRoute()
const classId = route.params.id as string
const classDetail: Ref<classInfo> = ref(
  {
    id: '',
    className: '',
    teacherNo: '',
    count: 0,
    grade: '',
    major: '',
    createTime: '',
    updateTime: ''
  })

interface classInfo {
  id: string
  className: string
  teacherNo: string
  count: number
  grade: string
  major: string
  createTime: string
  updateTime: string
}

const getLast7Days = () => {
  const dates: string[] = []
  for (let i = 6; i >= 0; i--) {
    const date = new Date()
    date.setDate(date.getDate() - i)

    // 格式化日期，例如 "12-30"
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')

    dates.push(`${month}-${day}`)
  }
  return dates
}

const getWeeklyAttendanceRate = async () => {
  const data = await fetchAttendanceRateByClass(classId)
  classdata.value = data
}
const getClassDetail = async () => {
  const result = await fetchClassDetail(classId)
  classDetail.value = result
}


xAxisData.value = getLast7Days()

onMounted(() => { getWeeklyAttendanceRate(); getClassDetail() })
</script>

<style scoped></style>
