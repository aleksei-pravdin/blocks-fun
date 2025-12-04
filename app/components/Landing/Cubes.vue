<template>
  <!-- Cubes - 2 left, 2 right from center -->
  <div class="absolute inset-0 pointer-events-none z-20 flex items-center justify-center">
    <div class="relative" style="width: 1200px; height: 650px;">
      <!-- Left cubes -->
      <img
        :src="cube1"
        alt="Cube 1"
        class="absolute cube-animation"
        style="left: 5px; top: 29%; --fade-delay: 0s; --float-delay: 0.5s;"
      />
      <img
        :src="cube2"
        alt="Cube 2"
        class="absolute cube-animation"
        style="left: 13%; top: 60%; --fade-delay: 0.2s; --float-delay: 2.8s;"
      />
      <!-- Right cubes -->
      <img
        :src="cube4"
        alt="Cube 4"
        class="absolute cube-animation"
        style="right: 1%; top: 20%; --fade-delay: 0.1s; --float-delay: 1.3s;"
      />
      <img
        :src="cube3"
        alt="Cube 3"
        class="absolute cube-animation"
        style="right: 12%; top: 52%; --fade-delay: 0.3s; --float-delay: 4s;"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// Component for animated cubes
// Use absolute paths to prevent issues with navigation
const getAbsolutePath = (path: string) => {
  if (typeof window !== 'undefined') {
    return new URL(path, window.location.origin).href
  }
  return path
}

const cube1 = computed(() => getAbsolutePath('/leading/cube_1.svg'))
const cube2 = computed(() => getAbsolutePath('/leading/cube_2.svg'))
const cube3 = computed(() => getAbsolutePath('/leading/cube_3.svg'))
const cube4 = computed(() => getAbsolutePath('/leading/cube_4.svg'))
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.cube-animation {
  opacity: 0;
  animation: 
    fadeIn 1s ease-out var(--fade-delay, 0s) forwards, 
    float 4s ease-in-out var(--float-delay, 1s) infinite;
}
</style>

