<template>
  <!-- Background vectors positioned according to Figma -->
  <!-- Позиции из Figma: контейнер bg = 1728x780px -->
  <div class="absolute inset-0 pointer-events-none opacity-30 flex items-center justify-center">
    <div class="relative" style="width: 1728px; height: 780px; max-width: 100vw; max-height: 100%;">
      <!-- Все векторы с точными позициями из Figma -->
      <div
        v-for="(vector, index) in vectors" 
        :key="index"
        :ref="el => { if (el) vectorRefs[index] = el as HTMLElement }"
        class="glitch-vector-wrapper"
        :style="`--delay: ${vector.delay}; --start-x: ${vector.startX}px; --start-y: ${vector.startY}px; --scale: ${vector.scale};`"
        @animationiteration="() => updateRandomProps(index)"
      >
        <LandingBackgroundVector 
          :x="vector.x" 
          :y="vector.y" 
          :width="vector.width" 
          :height="vector.height" 
          class="glitch-vector"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// Component for background vectors

// Generate random starting positions and scale for each vector
const generateRandomProps = () => {
  return {
    startX: Math.floor(Math.random() * 200) - 100, // -100 to 100px
    startY: Math.floor(Math.random() * 200) - 100, // -100 to 100px
    scale: 0.5 + Math.random() * 1.5, // 0.5 to 2.0
  }
}

const vectorRefs: Record<number, HTMLElement> = {}

const vectors = reactive([
  { x: 174, y: 41, width: 41, height: 41, delay: '0s', ...generateRandomProps() },
  { x: 217, y: 67, width: 53, height: 53, delay: '0.5s', ...generateRandomProps() },
  { x: 1307, y: 282, width: 80, height: 80, delay: '1s', ...generateRandomProps() },
  { x: 1347, y: 160, width: 57, height: 57, delay: '1.5s', ...generateRandomProps() },
  { x: 1454, y: 355, width: 134, height: 134, delay: '2s', ...generateRandomProps() },
  { x: 220, y: 35, width: 27, height: 27, delay: '0.2s', ...generateRandomProps() },
  { x: 276, y: 0, width: 43, height: 43, delay: '0.7s', ...generateRandomProps() },
  { x: 0, y: 140, width: 195, height: 195, delay: '1.2s', ...generateRandomProps() },
  { x: 1709, y: 355, width: 195, height: 195, delay: '1.7s', ...generateRandomProps() },
  { x: 421, y: 360, width: 42, height: 42, delay: '2.2s', ...generateRandomProps() },
  { x: 421, y: 259, width: 26, height: 26, delay: '0.3s', ...generateRandomProps() },
  { x: 161, y: 341, width: 26, height: 26, delay: '0.8s', ...generateRandomProps() },
  { x: 1459, y: 189, width: 26, height: 26, delay: '1.3s', ...generateRandomProps() },
  { x: 1540, y: 53, width: 81, height: 81, delay: '1.8s', ...generateRandomProps() },
  { x: 1628, y: 8, width: 46, height: 46, delay: '2.3s', ...generateRandomProps() },
  { x: 395, y: 483, width: 26, height: 26, delay: '0.4s', ...generateRandomProps() },
  { x: 352, y: 291, width: 59, height: 59, delay: '0.9s', ...generateRandomProps() },
  { x: 207, y: 248, width: 80, height: 80, delay: '1.4s', ...generateRandomProps() },
])

const updateRandomProps = (index: number) => {
  const vector = vectors[index]
  if (!vector) return
  
  const newProps = generateRandomProps()
  vector.startX = newProps.startX
  vector.startY = newProps.startY
  vector.scale = newProps.scale
  
  // Update CSS variables
  const element = vectorRefs[index]
  if (element) {
    element.style.setProperty('--start-x', `${newProps.startX}px`)
    element.style.setProperty('--start-y', `${newProps.startY}px`)
    element.style.setProperty('--scale', `${newProps.scale}`)
  }
}
</script>

<style scoped>
@keyframes fade {
  0% {
    opacity: 0;
  }
  5% {
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@keyframes glitch {
  0% {
    transform: translate(var(--start-x, 0), var(--start-y, 0)) scale(var(--scale, 1));
  }
  15% {
    transform: translate(0, 0) scale(1);
  }
  20% {
    transform: translate(2px, -2px) scale(1);
  }
  25% {
    transform: translate(-2px, 2px) scale(1);
  }
  30% {
    transform: translate(0, 0) scale(1);
  }
  35% {
    transform: translate(-3px, 0) scale(1);
  }
  40% {
    transform: translate(3px, 3px) scale(1);
  }
  45% {
    transform: translate(0, -3px) scale(1);
  }
  50% {
    transform: translate(-2px, 2px) scale(1);
  }
  55% {
    transform: translate(2px, -2px) scale(1);
  }
  60%, 70% {
    transform: translate(0, 0) scale(1);
  }
  100% {
    transform: translate(var(--start-x, 0), var(--start-y, 0)) scale(var(--scale, 1));
  }
}

.glitch-vector-wrapper {
  position: absolute;
}

.glitch-vector {
  opacity: 0;
  animation: 
    fade 3s ease-in-out var(--delay, 0s) infinite,
    glitch 3s steps(1, end) var(--delay, 0s) infinite;
}
</style>

