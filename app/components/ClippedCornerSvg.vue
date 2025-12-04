<template>
  <div
    :style="{
      width: fullWidth ? '100%' : `${width}px`,
      height: fullHeight ? '100%' : `${height}px`,
      clipPath: `polygon(0 0, calc(100% - ${computedClipSize}px) 0, 100% ${computedClipSize}px, 100% 100%, 0 100%)`,
      borderRadius: borderRadius || undefined,
      overflow: 'hidden',
    }"
    class="pointer-events-none"
  >
    <svg
      :width="fullWidth ? '100%' : width"
      :height="fullHeight ? '100%' : height"
      :viewBox="`0 0 ${width} ${height}`"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <rect
        :width="width"
        :height="height"
        :fill="fillColor"
      />
      <slot />
    </svg>
  </div>
</template>

<script setup lang="ts">
interface Props {
  width: number
  height: number
  fillColor?: string
  clipSize?: number
  clipPercent?: number
  fullWidth?: boolean
  fullHeight?: boolean
  borderRadius?: string
}

const props = withDefaults(defineProps<Props>(), {
  fillColor: '#D3DBE6',
  clipSize: undefined,
  clipPercent: 30,
  fullWidth: false,
  fullHeight: false,
  borderRadius: undefined,
})

// Вычисляем размер обрезки на основе меньшей стороны (width или height)
// Если указан clipSize (в пикселях), он имеет приоритет
// Иначе используется clipPercent (процент от меньшей стороны, по умолчанию 10%)
const computedClipSize = computed(() => {
  if (props.clipSize !== undefined) {
    return props.clipSize
  }
  const minSide = Math.min(props.width, props.height)
  return Math.round(minSide * (props.clipPercent / 100))
})
</script>

