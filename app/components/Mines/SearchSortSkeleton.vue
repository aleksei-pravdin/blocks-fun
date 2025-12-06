<template>
  <div class="flex items-center gap-4 mb-7 animate-pulse">
    <!-- Search Input Skeleton -->
    <div class="w-[50%] relative">
      <div class="w-full rounded-lg border-2 border-[rgba(83,86,103,0.57)] h-10.5 bg-[rgba(83,86,103,0.25)]"></div>
    </div>

    <!-- Sort Buttons Skeleton -->
    <div class="flex gap-2 flex-1 justify-end">
      <div
        v-for="i in 3"
        :key="`sort-skeleton-${i}`"
        class="w-[140px] h-10 rounded-xl bg-[rgba(83,86,103,0.5)]"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

