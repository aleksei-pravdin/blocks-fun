<template>
  <div class="flex flex-col">
    <div class="flex items-center justify-between mb-2">
      <h2 class="text-[#E5E9EC] font-raj font-bold text-[22px] uppercase">YOUR POSITION DETAILS</h2>
    </div>
    <div class="grid grid-cols-4 gap-5 bg-[rgba(58,60,70,0.3)] rounded-[8px] px-5 py-6 pb-8">
      <!-- Liquidity Provided -->
      <div class="flex flex-col gap-1">
        <div class="flex items-center gap-[6px]">
          <span class="text-[#E5E9EC] font-raj font-semibold text-xl">Liquidity Provided</span>
        </div>
        <div class="flex items-center gap-[10px]">
          <span class="text-[#FCF5F0] font-bold text-[28px] leading-none tracking-[-7%]">{{ liquidityProvided }}</span>
          <img
            v-if="tokenImage"
            class="w-6 h-6 rounded-full"
            :src="tokenImage"
            :alt="tokenSymbol || 'Token'"
          />
        </div>
      </div>
      <!-- Pool Share -->
      <div class="flex flex-col gap-1">
        <div class="flex items-center gap-[6px]">
          <span class="text-[#E5E9EC] font-raj font-semibold text-xl">Pool Share</span>
        </div>
        <span class="text-[#FCF5F0] font-bold text-[28px] leading-none tracking-[-7%]">{{ formatNumber(userLiquidityShare) }} %</span>
      </div>
      <!-- Fees Earned (24h) -->
      <div class="flex flex-col gap-1">
        <div class="flex items-center gap-[6px]">
          <span class="text-[#E5E9EC] font-raj font-semibold text-xl">Fees Earned (24h)</span>
        </div>
        <div class="flex items-center gap-[10px]">
          <span class="text-[#FCF5F0] font-bold text-[28px] leading-none tracking-[-7%]">{{ feesEarned24h }}</span>
          <img
            v-if="tokenImage"
            class="w-6 h-6 rounded-full"
            :src="tokenImage"
            :alt="tokenSymbol || 'Token'"
          />
        </div>
      </div>
      <!-- Total Fees Earned -->
      <div class="flex flex-col gap-1">
        <div class="flex items-center gap-[6px]">
          <span class="text-[#E5E9EC] font-raj font-semibold text-xl">Total Fees Earned</span>
          <div class="w-2 h-2 rounded-full bg-[#88FF00]"></div>
        </div>
        <div class="flex items-center gap-[10px]">
          <span class="text-[#88FF00] font-bold text-[28px] leading-none tracking-[-7%]">{{ totalFeesEarned }}</span>
          <img
            v-if="tokenImage"
            class="w-6 h-6 rounded-full"
            :src="tokenImage"
            :alt="tokenSymbol || 'Token'"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  userLiquidityShare: number | string;
  liquidityProvided?: string;
  feesEarned24h?: string;
  totalFeesEarned?: string;
  tokenImage?: string;
  tokenSymbol?: string;
  formatNumber: (num: number | string) => string;
}

withDefaults(defineProps<Props>(), {
  liquidityProvided: '5,000',
  feesEarned24h: '23,23',
  totalFeesEarned: '242.50',
});
</script>

