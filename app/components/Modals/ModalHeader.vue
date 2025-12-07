<template>
  <div class="flex items-start justify-between mb-3">
    <div class="flex flex-col gap-0.5">
      <h3 class="font-raj font-bold text-2xl text-[#E5E9EC]">
        {{ title }}
      </h3>
      <p v-if="subtitle" class="text-base text-[#E5E9EC] font-raj font-bold leading-[0.6]">
        {{ subtitle }}
      </p>
    </div>
    <button
      v-if="showClose"
      @click="$emit('close')"
      class="mt-3 text-white hover:text-gray-300 transition-colors"
    >
      <CancelIcon class="w-[23px]! h-[23px]!" />
    </button>
  </div>
</template>

<script setup lang="ts">
import CancelIcon from "~/assets/svg/cancel.svg";

interface Props {
  title: string;
  subtitle?: string;
  showClose?: boolean;
}

withDefaults(defineProps<Props>(), {
  showClose: true,
});

defineEmits<{
  close: [];
}>();
</script>

