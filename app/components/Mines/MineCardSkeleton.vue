<template>
  <div class="flex flex-col relative h-[420px] bg-gradient-to-b from-[#2c2d33] to-[#0f1312] p-5 pt-3 rounded-lg overflow-hidden animate-pulse">
    <!-- Header -->
    <div class="flex gap-2 mb-3">
      <div class="size-11 rounded-full bg-[#535667]"></div>
      <div class="flex flex-col gap-2">
        <div class="h-7 w-32 bg-[#535667] rounded"></div>
        <div class="h-5 w-24 bg-[#535667] rounded"></div>
      </div>
    </div>

    <!-- Divider -->
    <div class="my-3 bg-[rgba(62,63,71,0.58)] w-full h-px"></div>

    <!-- Stats row 1 -->
    <div class="flex mb-8">
      <div class="w-[57%] flex flex-col gap-2">
        <div class="h-6 w-20 bg-[#535667] rounded"></div>
        <div class="flex items-center gap-1">
          <div class="h-8 w-24 bg-[#535667] rounded"></div>
          <div class="size-5 rounded-full bg-[#535667]"></div>
        </div>
      </div>
      <div class="w-[43%] flex flex-col gap-2">
        <div class="h-6 w-20 bg-[#535667] rounded"></div>
        <div class="h-8 w-16 bg-[#535667] rounded"></div>
      </div>
    </div>

    <!-- Stats row 2 -->
    <div class="flex pt-8">
      <div class="w-[57%] flex flex-col gap-2">
        <div class="h-6 w-24 bg-[#535667] rounded"></div>
        <div class="flex items-center gap-1">
          <div class="h-8 w-20 bg-[#535667] rounded"></div>
          <div class="size-5 rounded-full bg-[#535667]"></div>
        </div>
      </div>
      <div class="w-[43%] flex flex-col gap-2">
        <div class="h-6 w-12 bg-[#535667] rounded"></div>
        <div class="h-8 w-16 bg-[#535667] rounded"></div>
      </div>
    </div>

    <!-- Bottom section -->
    <div class="flex flex-col gap-2 justify-end h-full pb-2 mt-auto">
      <div class="mt-7 mb-1 bg-[rgba(62,63,71,0.58)] w-full h-px"></div>
      <div class="flex items-center gap-1 pl-3 mb-4">
        <div class="w-5 h-5 bg-[#535667] rounded"></div>
        <div class="h-4 w-48 bg-[#535667] rounded"></div>
      </div>
      <div class="h-12 w-full bg-[#535667] rounded-lg"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

