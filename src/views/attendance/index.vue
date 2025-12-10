<template>
  <div>
    <ElCard class="col-span-12 font-bold text-2xl">{{ classData.className }}</ElCard>
    <ElCard class="col-span-12 mt-4">
      <div class="flex gap-4">
        <dataCard
          class="flex-1"
          :icon="'ri-git-repository-line'"
          :data="{ label: '课程名称', value: `${classData.currentCourse}` }"
        ></dataCard>
        <dataCard
          class="flex-1"
          :icon="'ri-user-line'"
          :data="{ label: '总人数', value: `${classData.totalStudents}` }"
        ></dataCard>
        <dataCard
          class="flex-1"
          :icon="'ri-user-2-line'"
          :data="{ label: '出勤人数', value: `${classData.attendedCount}` }"
        ></dataCard>
        <dataCard
          class="flex-1"
          :icon="'ri-bar-chart-2-line'"
          :data="{ label: '出勤率', value: `${classData.attendanceRate}` }"
        ></dataCard>
      </div>
    </ElCard>
    <ElCard class="col-span-12 mt-4">
      <ArtLineChart
        height="360px"
        :data="data"
        :xAxisData="xAxisData"
        :showLegend="true"
        :showAxisLabel="true"
        :showAxisLine="false"
        :showSplitLine="true"
      />
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import { classData } from './mock'
  import dataCard from './modules/dataCard.vue'
  const xAxisData = classData.weeklyAttendanceRate.map((item) => item.date)
  const data = classData.weeklyAttendanceRate.map((item) => item.data)
</script>

<style scoped></style>
