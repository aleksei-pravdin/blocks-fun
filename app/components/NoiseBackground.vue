<template>
  <div
    :style="{
      backgroundImage: mode === 'full' ? 'url(/noise_full_bg.png)' : 'url(/noise_bg.png)',
      backgroundSize: backgroundSize || 'cover',
      backgroundPosition: backgroundPosition || 'center',
      backgroundRepeat: backgroundRepeat || 'no-repeat',
      mixBlendMode: blendMode || 'overlay',
      opacity: opacity || 1,
      borderRadius: borderRadius || undefined,
    }"
    class="absolute inset-0 pointer-events-none"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
interface Props {
  mode?: 'normal' | 'full'
  blendMode?: 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten' | 'color-dodge' | 'color-burn' | 'hard-light' | 'soft-light' | 'difference' | 'exclusion' | 'hue' | 'saturation' | 'color' | 'luminosity'
  opacity?: number
  backgroundSize?: string
  backgroundPosition?: string
  backgroundRepeat?: string
  borderRadius?: string
}

withDefaults(defineProps<Props>(), {
  mode: 'normal',
  blendMode: 'overlay',
  opacity: 1,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  borderRadius: undefined,
})
</script>

