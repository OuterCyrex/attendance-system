<template>
    <div style="position: relative; width: 100%; height: 400px;">
        <div id="courseAttendRateLineChart" style="width: 100%; height: 100%;"></div>
        <div
            style="position: absolute; top: 10px; right: 60px; z-index: 10; padding: 4px;">
            <el-select v-model="selectedGranularityId" @change="handleGranularityChange" placeholder="选择统计粒度"
                size="small" style="width: 120px;">
                <el-option v-for="item in granularityOptions" :key="item.id" :label="item.name"
                    :value="item.id"></el-option>
            </el-select>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref } from 'vue'
import * as echarts from 'echarts'

interface attendRecord {
    date: string
    attendRate: number
}

const props = defineProps<{
    data: Array<attendRecord>
}>()

const emits = defineEmits<{
    change: [granularityId: number]
}>()

const granularityOptions = ref([
    { id: 2, name: '最近一周' },
    { id: 3, name: '最近一个月' },
    { id: 4, name: '最近一学期' }
])

const selectedGranularityId = ref<number>(2)

let myChart: echarts.ECharts | null = null

const initAttendRateChart = () => {
    const chartDom = document.getElementById('courseAttendRateLineChart')
    if (!chartDom) return
    if (!myChart) {
        myChart = echarts.init(chartDom)
    }

    let xAxisData: string[] = []
    let yAxisData: number[] = []

    if (props.data && props.data.length > 0) {
        xAxisData = props.data.map(item => item.date)
        yAxisData = props.data.map(item => item.attendRate)
    }

    const option = {
        title: {
            text: '每日考勤率趋势折线图',
        },
        tooltip: {
            trigger: 'axis',
            formatter: '{b}<br/>考勤率：{c}%'
        },
        legend: {
            data: ['考勤率'],
            left: 'right'
        },
        grid: {
            left: '3%',
            right: '6%',
            bottom: '3%',
            containLabel: true
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            data: xAxisData,
        },
        yAxis: {
            type: 'value',
            name: '考勤率（%）',
            min: 0,
            max: 100,
            axisLabel: {
                formatter: '{value}%'
            }
        },
        series: [
            {
                name: '考勤率',
                type: 'line',
                data: yAxisData,
                symbol: 'circle',
                symbolSize: 6,
                lineWidth: 2,
                itemStyle: {
                    color: '#409eff'
                },
                areaStyle: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: 'rgba(64, 158, 255, 0.3)'
                        }, {
                            offset: 1, color: 'rgba(64, 158, 255, 0.05)'
                        }]
                    }
                }
            }
        ]
    }

    myChart.setOption(option)
    window.addEventListener('resize', () => {
        myChart?.resize()
    })
}

const handleGranularityChange = (val: number) => {
    emits('change', val)
}

watch(() => props.data, () => {
    initAttendRateChart()
}, { deep: true })

onMounted(() => {
    initAttendRateChart()
})
</script>