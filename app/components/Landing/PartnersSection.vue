<template>
  <section class="w-full h-[82px] flex items-center justify-center">
    <div class="max-w-full w-full mx-auto px-4">
      <img 
        :src="logoStripPath" 
        alt="Partners" 
        class="w-full h-auto object-contain"
        style="height: 182px; padding-left: 140px;"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
// Use absolute path to prevent navigation issues
const getAbsolutePath = (path: string) => {
  if (typeof window !== 'undefined') {
    return new URL(path, window.location.origin).href
  }
  return path
}

const logoStripPath = computed(() => getAbsolutePath('/leading/logo strip.png'))
</script>

