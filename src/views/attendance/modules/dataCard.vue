<template>
  <div>
    <div
      class="flex px-5 flex-col justify-center h-55 border border-g-300/85 rounded-xl max-lg:mb-4 max-sm:flex-row max-sm:justify-between max-sm:items-center max-sm:h-40"
    >
      <div class="size-12 rounded-lg flex-cc bg-theme/10">
        <ArtSvgIcon :icon="props.icon" class="text-xl text-theme" />
      </div>

      <div class="max-sm:ml-4 mt-3.5 max-sm:mt-0 max-sm:text-end">
        <span class="text-g-900 tabular-nums">
          {{ props.data.value }}
        </span>
        <p class="mt-2 text-base text-g-600 max-sm:mt-1">{{ props.data.label }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    data: {
      type: Object,
      required: true,
      default: () => ({ value: '', label: '' })
    },
    icon: {
      type: String,
      required: true
    }
  })
</script>

<style scoped></style>
