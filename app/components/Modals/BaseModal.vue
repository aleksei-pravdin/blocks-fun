<template>
  <TransitionRoot as="template" :show="open">
    <Dialog class="relative z-50" @close="close">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to=""
        leave="ease-in duration-200"
        leave-from=""
        leave-to="opacity-0"
      >
        <div
          class="fixed inset-0 bg-[rgba(12,16,15,0.83)] transition-opacity"
        ></div>
      </TransitionChild>

      <div class="fixed inset-0 z-50 w-screen overflow-y-auto">
        <div
          class="flex min-h-full items-end justify-center p-4 sm:items-center sm:p-0"
        >
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel
              :class="[
                'relative transform overflow-hidden rounded-lg text-white shadow-xl transition-all sm:my-8 sm:w-full',
                maxWidthClass
              ]"
              :style="{ '--max-width': maxWidth }"
            >
              <div class="relative bg-[#222328] pt-3 pb-6 sm:px-5 sm:pt-3 sm:pb-8 overflow-hidden" :class="props.class">
                <!-- Background image -->
                <HeaderCardBg />
                
                <!-- Gradient overlay at bottom -->
                <div class="absolute bottom-0 left-0 right-0 h-[300px] bg-gradient-to-t from-[#0e1211] to-transparent pointer-events-none z-0"></div>
                
                <!-- Content slot -->
                <div class="relative z-10">
                  <slot />
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";

interface Props {
  open: boolean;
  maxWidth?: string;
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  maxWidth: "660px",
});

const emit = defineEmits<{
  close: [];
}>();

const maxWidthClass = computed(() => {
  // Use standard Tailwind classes for common sizes, or use arbitrary value
  const widthMap: Record<string, string> = {
    "660px": "sm:max-w-[660px]",
    "512px": "sm:max-w-lg",
    "640px": "sm:max-w-2xl",
    "768px": "sm:max-w-3xl",
  };
  return widthMap[props.maxWidth] || `sm:max-w-[${props.maxWidth}]`;
});

function close() {
  emit("close");
}
</script>

