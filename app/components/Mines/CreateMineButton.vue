<template>
  <button
    type="button"
    @click="openCreateMineModal"
    :class="buttonClass"
  >
    <ClippedCornerSvg
      v-if="variant === 'clipped'"
      :width="220"
      :height="52"
      fill-color="#535667"
      :full-width="true"
      :full-height="true"
      border-radius="8px 0 8px 8px"
      class="absolute inset-0"
    />

    <div v-if="variant === 'clipped'" :class="contentClass">
      <span>{{ text }}</span>
      <span class="text-[39px] leading-[0] font-medium">+</span>
    </div>
    <span v-else>{{ text }}</span>
  </button>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'clipped' | 'simple'
  text?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'clipped',
  text: 'Create mine',
})

const router = useRouter();
const route = useRoute();

function openCreateMineModal() {
  router.push({ query: { ...route.query, modal: "createMine" } });
}

const buttonClass = computed(() => {
  if (props.variant === 'clipped') {
    return 'hidden sm:inline-flex relative group text-white font-raj font-semibold text-[20px] uppercase tracking-[1px] cursor-pointer hover:opacity-90 transition-opacity overflow-hidden';
  }
  return 'bg-[#535667] text-white text-lg font-bold py-4.5 max-w-[290px] w-full rounded-xl uppercase hover:opacity-90 transition-opacity';
})

const contentClass = computed(() => {
  if (props.variant === 'clipped') {
    return 'relative z-10 flex items-center gap-3 px-17 py-3';
  }
  return '';
})
</script>

