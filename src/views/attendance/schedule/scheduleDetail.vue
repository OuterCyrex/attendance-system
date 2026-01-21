<template>
    <el-dialog v-model="dialogVisible" title="考勤详情" width="500px" destroy-on-close align-center>
        <div v-if="attendanceDetail" class="flex flex-col gap-4 text-sm px-4">

            <!-- 打卡时间 -->
            <div class="flex items-center">
                <div class="w-20 text-left text-gray-500 mr-3 shrink-0">打卡时间:</div>
                <div class="flex-1 text-gray-600">{{ attendanceDetail.checkTime || '暂无数据' }}</div>
            </div>

            <!-- 考勤统计 -->
            <div class="flex items-center">
                <div class="w-20 text-left text-gray-500 mr-3 shrink-0">考勤统计:</div>
                <div class="flex-1">
                    应到 {{ attendanceDetail.expectedCount }} 人 / 实到
                    <span class="text-blue-600 font-bold">{{ attendanceDetail.actualCount }}</span> 人
                </div>
            </div>

            <!-- 考勤率 -->
            <div class="flex items-center">
                <div class="w-20 text-left text-gray-500 mr-3 shrink-0">考勤率:</div>
                <div class="flex-1">
                    <el-tag size="small" :type="getAttendanceRateTag().type">
                        {{ (attendanceDetail.attendanceRate * 100).toFixed(1) }}%
                    </el-tag>
                </div>
            </div>

            <!-- 打卡类型 -->
            <div class="flex items-center">
                <div class="w-20 text-left text-gray-500 mr-3 shrink-0">打卡类型:</div>
                <div class="flex-1">
                    <el-tag size="small" :type="getCheckTypeTag().type">
                        {{ getCheckTypeTag().label }}
                    </el-tag>
                </div>
            </div>

            <!-- 状态 -->
            <div class="flex items-center">
                <div class="w-20 text-left text-gray-500 mr-3 shrink-0">状态:</div>
                <div class="flex-1">
                    <el-tag size="small" :type="getStatusTag().type">
                        {{ getStatusTag().label }}
                    </el-tag>
                </div>
            </div>

            <!-- 考勤图片 -->
            <div v-if="attendanceDetail.imageUrl" class="flex items-start">
                <div class="w-20 text-left text-gray-500 mr-3 shrink-0 mt-0.5">考勤图片:</div>
                <div class="flex-1">
                    <el-image :src="attendanceDetail.imageUrl" alt="考勤图片"
                        style="width: 100px; height: 100px; object-fit: cover"
                        :preview-src-list="[attendanceDetail.imageUrl]" />
                </div>
            </div>

            <!-- 备注 -->
            <div class="flex items-start">
                <div class="w-20 text-left text-gray-500 mr-3 shrink-0 mt-0.5">备注:</div>
                <div class="flex-1 text-gray-800 break-all leading-normal">
                    {{ attendanceDetail.remark || '无备注信息' }}
                </div>
            </div>
        </div>
    </el-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store/modules/user'
import { fetchGetAttendance } from '../../../api/attendance';

const userStore = useUserStore()
const { getToken: token } = userStore
const { getUserInfo: userInfo } = userStore

const props = defineProps<{
    id: string
    visible: boolean
}>()


const attendanceDetail = ref({
    id: "",
    courseId: "",
    checkTime: "",
    actualCount: 0,
    expectedCount: 0,
    attendanceRate: 0,
    imageUrl: "",
    checkType: 1,
    status: 1,
    remark: ""
})

const emit = defineEmits<{
    (e: 'update:visible', val: boolean): void,
}>()

const getAttendanceInfo = async () => {
    attendanceDetail.value = await fetchGetAttendance(token, props.id)
}

const dialogVisible = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val)
})

const router = useRouter();

const getAttendanceRateTag = () => {
    const rate = attendanceDetail.value.attendanceRate * 100;
    if (rate >= 90) return { type: 'success' };
    if (rate >= 70) return { type: 'warning' };
    return { type: 'danger' };
};

const getCheckTypeTag = () => {
    switch (attendanceDetail.value.checkType) {
        case 0: return { label: '手动打卡', type: 'info' }
        case 1: return { label: '自动打卡', type: 'success' }
        case 2: return { label: '手动打卡', type: 'info' }
    }
};

const getStatusTag = () => {
    switch (attendanceDetail.value.status) {
        case 0: return { label: '正常', type: 'success' };
        case 1: return { label: '正常', type: 'success' };
        case 2: return { label: '异常', type: 'danger' };
    }
};

onMounted(() => {
    getAttendanceInfo()
})
</script>

<style lang="scss" scoped>
.dialog-footer {
    text-align: right;
}

.el-image {
    cursor: pointer;
}
</style>