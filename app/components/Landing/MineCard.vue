<template>
  <div class="bg-gradient-to-b from-[#222328] to-[#535667] rounded-lg p-5 relative overflow-hidden">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-purple-500"></div>
        <div>
          <h3 class="text-white font-bold text-2xl font-raj">{{ mine.name }}</h3>
          <div class="flex items-center gap-2 mt-1">
            <span class="bg-[rgba(153,29,255,0.32)] text-[#DFB7FF] px-2 py-0.5 rounded text-sm font-bold">
              FEE TIER {{ mine.feeTier }}%
            </span>
            <span v-if="mine.trending" class="bg-[rgba(255,75,1,0.27)] text-[#FF4B01] px-3 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
              <Fire class="w-4 h-4" />
              Trending
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-2 gap-4 mb-4">
      <!-- Max Win -->
      <div>
        <p class="text-[#E5E9EC] text-sm font-semibold mb-1">Max Win</p>
        <p class="text-[#FCF5F0] text-2xl font-bold font-sans">{{ mine.maxWin }}%</p>
      </div>

      <!-- APR -->
      <div>
        <div class="flex items-center gap-2">
          <p class="text-[#E5E9EC] text-sm font-semibold">APR</p>
          <div class="w-2 h-2 rounded-full bg-[#88FF00]"></div>
        </div>
        <p class="text-[#FCF5F0] text-2xl font-bold font-sans">{{ mine.apr }}%</p>
      </div>

      <!-- Liquidity -->
      <div>
        <p class="text-[#E5E9EC] text-sm font-semibold mb-1">Liquidity</p>
        <div class="flex items-center gap-1">
          <p class="text-[#FCF5F0] text-2xl font-bold font-sans">{{ formatNumber(mine.liquidity) }}</p>
          <div class="w-5 h-5 rounded-full bg-purple-500"></div>
        </div>
      </div>

      <!-- Volume 24H -->
      <div>
        <p class="text-[#E5E9EC] text-sm font-semibold mb-1">Volume (24H)</p>
        <div class="flex items-center gap-1">
          <p class="text-[#FCF5F0] text-2xl font-bold font-sans">{{ formatNumber(mine.volume24h) }}</p>
          <div class="w-5 h-5 rounded-full bg-purple-500"></div>
        </div>
      </div>
    </div>

    <!-- Hot mine info -->
    <div v-if="mine.hotInfo" class="flex items-center gap-1 mb-4 text-xs text-[#787B7C]">
      <Fire class="w-5 h-5" />
      <span>{{ mine.hotInfo }}</span>
    </div>

    <!-- CTA Button -->
    <button 
      :class="[
        'w-full py-3 relative font-bold text-base uppercase transition-opacity hover:opacity-90 overflow-hidden',
        mine.featured ? 'text-[#F6F8FF]' : 'text-[#0C100F]'
      ]"
    >
      <ClippedCornerSvg
        :width="300"
        :height="48"
        :fill-color="mine.featured ? '#FF4B01' : '#E9E2DF'"
        :full-width="true"
        :full-height="true"
        border-radius="8px"
        class="absolute inset-0"
      />
      <span class="relative z-10">ENTER MINE</span>
    </button>
  </div>
</template>

<script setup lang="ts">
import Fire from "~/assets/svg/fire.svg";
interface Mine {
  name: string
  feeTier: number
  maxWin: number
  apr: number
  liquidity: number
  volume24h: number
  hotInfo?: string
  trending?: boolean
  featured?: boolean
}

defineProps<{
  mine: Mine
}>()

function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-US').format(num)
}
</script>

