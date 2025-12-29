<template>
    <el-dialog v-model="dialogVisible" title="编辑教师档案" width="600px" :close-on-click-modal="false" destroy-on-close
        class="rounded-xl" @close="dialogVisible = false">

        <el-form ref="formRef" :model="form" :rules="rules" label-position="top">

            <el-form-item label="系统用户名">
                <el-input v-model="form.username" />
            </el-form-item>

            <el-form-item label="手机号码" prop="phone">
                <el-input v-model="form.phone" placeholder="11位手机号" />
            </el-form-item>

            <el-form-item label="电子邮箱" prop="email">
                <el-input v-model="form.email" placeholder="example@school.com" />
            </el-form-item>

            <el-form-item label="备注说明">
                <el-input v-model="form.remark" type="textarea" :rows="3" placeholder="填写教师简介或备注..." resize="none" />
            </el-form-item>

        </el-form>

        <template #footer>
            <div class="flex justify-end gap-3">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="handleSubmit">
                    保存变更
                </el-button>
            </div>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">

const props = defineProps<{
    visible: boolean,
    formData: any
}>()

const emit = defineEmits<{
    (e: 'update:visible', val: boolean): void,
    (e: 'submit', val: any): void
}>()

const dialogVisible = computed({
    get: () => props.visible,
    set: (val: boolean) => emit('update:visible', val)
})

const form = { ...props.formData }
console.log(form)
const handleSubmit = () => {
    const submitData = { ...form }
    emit('submit', submitData)
    dialogVisible.value = false
}
</script>