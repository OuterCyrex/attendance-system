<template>
    <div class="class-container">
        <div class="grid grid-cols-12 w-full">
            <ElCard class="col-span-12" shadow="never">
                <div class="flex items-center gap-4">
                    <div class="year-select flex items-center">
                        <div class="mr-2 text-gray-500">年级：</div>
                        <el-select v-model="gradeValue" placeholder="请选择年级" style="width: 160px">
                            <el-option v-for="item in gradeOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </div>

                    <div class="year-select flex items-center">
                        <div class="mr-2 text-gray-500">专业：</div>
                        <el-select v-model="majorValue" placeholder="请选择专业" style="width: 160px">
                            <el-option v-for="item in majorOptions" :key="item.value" :label="item.label"
                                :value="item.value" />
                        </el-select>
                    </div>

                    <div class="ml-auto flex gap-2">
                        <el-button type="primary">查询</el-button>
                        <el-button type="info" plain>重置</el-button>
                    </div>
                </div>
            </ElCard>

            <ElCard class="col-span-12 mt-4" shadow="never">
                <div class="operation-buttons">
                    <el-button type="primary" :icon="Plus">新增班级</el-button>
                    <el-button type="primary"> 导入班级</el-button>
                    <el-button type="info" plain> 下载班级课程表模板</el-button>
                </div>
            </ElCard>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Search, Plus } from '@element-plus/icons-vue'

</script>