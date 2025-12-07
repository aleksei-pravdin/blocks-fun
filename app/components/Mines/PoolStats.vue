<template>
  <div class="flex flex-col mt-7">
    <div class="flex items-center justify-between ">
      <h2 class="text-[#E5E9EC] font-raj font-bold text-[22px] uppercase">STATISTICS</h2>
      <div class="flex items-center gap-[10px] pb-4">
        <button
          v-for="period in ['24H', '7D', '30D', 'ALL']"
          :key="period"
          @click="$emit('update:timeFilter', period)"
          :class="[
            'w-[80px] h-[30px] rounded-[6px] flex items-center justify-center font-chakra font-bold text-base',
            timeFilter === period
              ? 'bg-[#991DFF] text-[#F7F8FF]'
              : 'bg-[rgba(83,86,103,0.48)] text-[#9497A4]'
          ]"
        >
          {{ period }}
        </button>
      </div>
    </div>

    <div class="h-[3px] w-full bg-[#1E1E1E] mb-10"></div>

    <div class="grid grid-cols-4 gap-5">
      <!-- Total Games -->
      <div class="bg-[#2E3239] rounded-[8px] px-5 py-4 flex flex-col gap-1">
        <div class="flex items-center gap-[6px]">
          <span class="text-[#E5E9EC] font-raj font-semibold text-xl">Total Games</span>
        </div>
        <span class="text-[#FCF5F0] font-bold text-[28px] leading-none tracking-[-7%]">{{ formatNumberNoDecimals(totalGames) }}</span>
      </div>
      <!-- Avg. Bet Size -->
      <div class="bg-[#2E3239] rounded-[8px] px-5 py-4 flex flex-col gap-1">
        <div class="flex items-center gap-[6px]">
          <span class="text-[#E5E9EC] font-raj font-semibold text-xl">Avg. Bet Size</span>
        </div>
        <div class="flex items-center gap-[10px]">
          <span class="text-[#FCF5F0] font-bold text-[28px] leading-none tracking-[-7%]">{{ avgBetSize }}</span>
          <img
            v-if="tokenImage"
            class="w-6 h-6 rounded-full"
            :src="tokenImage"
            :alt="tokenSymbol || 'Token'"
          />
        </div>
      </div>
      <!-- House Edge -->
      <div class="bg-[#2E3239] rounded-[8px] px-5 py-4 flex flex-col gap-1">
        <div class="flex items-center gap-[6px]">
          <span class="text-[#E5E9EC] font-raj font-semibold text-xl">House Edge</span>
        </div>
        <span class="text-[#FCF5F0] font-bold text-[28px] leading-none tracking-[-7%]">{{ houseEdge }}%</span>
      </div>
      <!-- Win Ratio -->
      <div class="bg-[#2E3239] rounded-[8px] px-5 py-4 flex flex-col gap-1">
        <div class="flex items-center gap-[6px]">
          <span class="text-[#E5E9EC] font-raj font-semibold text-xl">Win Ratio</span>
          <div class="w-2 h-2 rounded-full bg-[#88FF00]"></div>
        </div>
        <span class="text-[#88FF00] font-bold text-[28px] leading-none tracking-[-7%]">{{ winRatio }}%</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  totalGames: number | string;
  avgBetSize: number | string;
  houseEdge: number | string;
  winRatio: number | string;
  timeFilter: string;
  tokenImage?: string;
  tokenSymbol?: string;
  formatNumberNoDecimals: (num: number | string) => string;
  formatNumber: (num: number | string) => string;
}

withDefaults(defineProps<Props>(), {
  totalGames: '900',
  avgBetSize: '90.6',
  houseEdge: '2.5',
  winRatio: '60.2',
  timeFilter: '30D',
});

defineEmits<{
  'update:timeFilter': [value: string];
}>();
</script>

