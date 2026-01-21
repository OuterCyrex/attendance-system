<template>

    <el-dialog v-model="dialogVisible" title="预警详情" width="500px" destroy-on-close align-center>

        <div v-if="currentAlert" class="flex flex-col gap-4 text-sm">

            <div class="flex items-center">
                <div class="w-20 text-left text-gray-500 mr-3 shrink-0">课程ID:</div>
                <div class="flex-1 font-medium">{{ currentAlert.courseId }}</div>
            </div>

            <div class="flex items-center">
                <div class="w-20 text-left text-gray-500 mr-3 shrink-0">预警类型:</div>
                <div class="flex-1">
                    <el-tag size="small" :type="getAlertTypeTag(currentAlert.alertType).type">
                        {{ getAlertTypeTag(currentAlert.alertType).label }}
                    </el-tag>
                </div>
            </div>

            <div class="flex items-center">
                <div class="w-20 text-left text-gray-500 mr-3 shrink-0">预警级别:</div>
                <div class="flex-1">
                    <el-tag size="small" :type="getAlertLevelTag(currentAlert.alertLevel).type">
                        {{ getAlertLevelTag(currentAlert.alertLevel).label }}
                    </el-tag>
                </div>
            </div>

            <div class="flex items-start">
                <div class="w-20 text-left text-gray-500 mr-3 shrink-0 mt-0.5">预警内容:</div>
                <div class="flex-1 text-gray-800 break-all leading-normal">
                    {{ currentAlert.alertMessage }}
                </div>
            </div>

            <div class="flex items-center">
                <div class="w-20 text-left text-gray-500 mr-3 shrink-0">考勤统计:</div>
                <div class="flex-1">
                    应到 {{ currentAlert.expectedCount }} 人 / 实到
                    <span class="text-blue-600 font-bold">{{ currentAlert.actualCount }}</span> 人
                </div>
            </div>

            <div class="flex items-center">
                <div class="w-20 text-left text-gray-500 mr-3 shrink-0">通知时间:</div>
                <div class="flex-1 text-gray-600">{{ currentAlert.updateTime }}</div>
            </div>

        </div>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="dialogVisible = false">关闭</el-button>
                <el-button type="primary" @click="handleGoToSchedule">
                    查看考勤
                </el-button>
            </div>
        </template>

    </el-dialog>

</template>

<script setup lang="ts">
import { router } from '@/router';
import { computed } from 'vue';

type AlertType = "info" | "primary" | "success" | "warning" | "danger"

const props = (
    defineProps<{
        visible: boolean,
        currentAlert: any
    }>()
)

const emit = defineEmits<{
    (e: 'update:visible', val: boolean): void
}>()

const dialogVisible = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val)
})

const getAlertTypeTag = (type: number) => {
    switch (type) {
        case 1: return { label: '人数不足', type: 'warning' as AlertType };
        case 2: return { label: '迟到过多', type: 'danger' as AlertType };
        case 3: return { label: '旷课严重', type: 'danger' as AlertType };
        default: return { label: '普通预警', type: 'info' as AlertType };
    }
};

const getAlertLevelTag = (type: number) => {
    switch (type) {
        case 1: return { label: '中', type: 'warning' as AlertType };
        case 2: return { label: '高', type: 'danger' as AlertType };
        case 3: return { label: '低', type: 'info' as AlertType };
        default: return { label: '低', type: 'info' as AlertType };
    }
};

const handleGoToSchedule = () => {
    if (props.currentAlert && props.currentAlert.courseId) {
        router.push({
            path: `/attendance/schedule/${props.currentAlert.courseId}`,
        });
        dialogVisible.value = false;
    } else {
        console.warn('缺少课程ID，无法跳转');
    }
}
</script>

<style lang="scss" scoped></style>