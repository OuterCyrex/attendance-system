<template>
    <div class="mt-1">
        <ElCard class="col-span-12" shadow="never">
            <div class="flex items-center gap-4">
                <!-- 单个日期选择器 -->
                <div class="flex items-center">
                    <div class="mr-2 text-gray-500">日期：</div>
                    <el-date-picker v-model="selectedDate" type="date" placeholder="选择日期" format="YYYY-MM-DD"
                        value-format="YYYY-MM-DD" size="default" class="w-[200px]" />
                </div>

                <!-- 查询/重置按钮 -->
                <div class="ml-auto flex gap-2">
                    <el-button type="primary" @click="getAlertList">查询</el-button>
                    <el-button type="info" plain @click="resetSearch">重置</el-button>
                </div>
            </div>
        </ElCard>
        <ElCard class="col-span-12 mt-4" shadow="never" v-loading="tableLoading" style="min-height: 600px">
            <div class="flex items-center px-4 py-3 bg-gray-50 border-b border-gray-200 rounded-t-md">
                <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange"
                    label="选择全部" size="large" />
            </div>

            <el-empty v-if="alertList.length === 0"></el-empty>
            <div class="flex justify-between items-center px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors duration-150"
                v-for="item in alertList" :key="item.id" @click="handleViewDetail(item)">
                <el-checkbox-group class="flex items-center gap-4 flex-1" v-model="checkedList">
                    <el-checkbox @click.stop :value="item.id" @change="handleCheckedChange" class="mt-0.5" />
                    <div class="flex flex-col gap-0.5">
                        <span class="text-sm" style="cursor: pointer;">
                            {{ item.alertMessage }}
                        </span>
                    </div>
                </el-checkbox-group>

                <span class="text-xs text-gray-500 min-w-[80px] text-right">{{ item.updateTime }}</span>
            </div>
        </ElCard>
        <div class="col-span-12 mt-10 mb-15 flex justify-center">
            <ElPagination background layout="prev, pager, next, sizes, total" :total="total"
                v-model:current-page="currentPage" v-model:page-size="pageSize" @current-change="handlePageChange"
                @size-change="handleSizeChange" />
        </div>
        <MessageDialog :currentAlert="currentAlert" v-model:visible="dialogVisible" />
    </div>

</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { CheckboxValueType, ElCard } from 'element-plus';
import { fetchGetAlertList } from '@/api/message';
import { useUserStore } from '@/store/modules/user';
import MessageDialog from './messageDialog.vue';

interface AlertItem {
    /*主键ID */
    id: string;

    /*课程ID */
    courseId: string;

    /*考勤记录ID */
    attendanceId: string;

    /*预警类型：1-人数不足，2-迟到过多，3-旷课严重 */
    alertType: number;

    /*预警级别：1-低，2-中，3-高 */
    alertLevel: number;

    /*预到人数 */
    expectedCount: number;

    /*实到人数 */
    actualCount: number;

    /*预警信息 */
    alertMessage: string;

    /*通知状态：0-未发送，1-已发送，2-发送失败 */
    notifyStatus: number;

    /*通知时间 */
    notifyTime: any;

    /*创建时间 */
    createTime: Record<string, unknown>;

    /*更新时间 */
    updateTime: Record<string, unknown>;
}

const currentPage = ref(1)
const pageSize = ref(10)
const userStore = useUserStore()
const { getToken: token } = userStore
const { getUserInfo: userInfo } = userStore
const total = ref(0)
const selectedDate = ref('')

const checkAll = ref(false);
const checkedList = ref<string[]>([]);
const alertList = ref<AlertItem[]>([]);
const tableLoading = ref(false)

const dialogVisible = ref(false);
const currentAlert = ref<AlertItem | null>(null);
const handleViewDetail = (item: AlertItem) => {
    currentAlert.value = item;
    dialogVisible.value = true;
};

const handlePageChange = (page: number) => {
    currentPage.value = page
    getAlertList()
}

const handleSizeChange = (size: number) => {
    pageSize.value = size
    currentPage.value = 1
    getAlertList()
}

const isIndeterminate = ref(false)

const handleCheckAllChange = (val: any) => {
    checkedList.value = val ? alertList.value.map((el) => el.id) : []
    isIndeterminate.value = false
}

const handleCheckedChange = (val: any) => {
    const valLength = val.length
    const totalLength = alertList.value.length
    checkAll.value = valLength === totalLength
    isIndeterminate.value = valLength > 0 && !checkAll.value
}

const resetSearch = () => {
    selectedDate.value = ''
    getAlertList()
}

const getAlertList = async () => {
    tableLoading.value = true
    const params = {
        date: selectedDate.value,
        pageNum: currentPage.value,
        pageSize: pageSize.value
    }
    const data = await fetchGetAlertList(token, params);
    alertList.value = data.records
    total.value = data.total
    tableLoading.value = false
}

onMounted(() => {
    getAlertList()
});
</script>