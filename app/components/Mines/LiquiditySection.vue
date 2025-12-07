<template>
  <div class="flex flex-col mt-7">
    <div class="flex items-center justify-between ">
      <h2 class="text-[#E5E9EC] font-raj font-bold text-[22px] uppercase">LIQUIDITY</h2>
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

    <div class="h-[3px] w-full bg-[#1E1E1E] mb-6"></div>

    <div class="grid grid-cols-4 gap-5">
      <!-- Total Pool Size -->
      <div class="bg-[#2E3239] rounded-[8px] px-5 py-4 flex flex-col gap-1">
        <div class="flex items-center gap-[6px]">
          <span class="text-[#E5E9EC] font-raj font-semibold text-xl">Total Pool Size</span>
        </div>
        <div class="flex items-center gap-[10px]">
          <span class="text-[#FCF5F0] font-bold text-[28px] leading-none tracking-[-7%]">{{ formatNumberNoDecimals(totalPoolSize) }}</span>
          <img
            v-if="tokenImage"
            class="w-6 h-6 rounded-full"
            :src="tokenImage"
            :alt="tokenSymbol || 'Token'"
          />
        </div>
        <span class="text-[#787B7C] font-raj mt-2 font-semibold text-xs">{{ tokenSymbol }}</span>
      </div>
      <!-- Your Share -->
      <div class="bg-[#2E3239] rounded-[8px] px-5 py-4 flex flex-col gap-1">
        <div class="flex items-center gap-[6px]">
          <span class="text-[#E5E9EC] font-raj font-semibold text-xl">Your Share</span>
        </div>
        <span class="text-[#FCF5F0] font-sans font-bold text-[28px] leading-none tracking-[-7%]">{{ formatNumber(userLiquidityShare) }}%</span>
        <span class="text-[#787B7C] font-raj mt-2 font-semibold text-xs">$6,000</span>
      </div>
      <!-- Earned Fees -->
      <div class="bg-[#2E3239] rounded-[8px] px-5 py-4 flex flex-col gap-1">
        <div class="flex items-center gap-[6px]">
          <span class="text-[#E5E9EC] font-raj font-semibold text-xl">Earned Fees</span>
          <div class="w-2 h-2 rounded-full bg-[#88FF00]"></div>
        </div>
        <div class="flex items-end gap-[10px]">
          <span class="text-[#FCF5F0] font-sans font-bold text-[28px] leading-none tracking-[-7%]">70,000</span>
          <img
            v-if="tokenImage"
            class="w-6 h-6 rounded-full"
            :src="tokenImage"
            :alt="tokenSymbol || 'Token'"
          />
        </div>
        <span class="text-[#787B7C] font-raj mt-2 font-semibold text-xs">All time</span>
      </div>
      <!-- Estimated APR -->
      <div class="bg-[#2E3239] rounded-[8px] px-5 py-4 flex flex-col gap-1">
        <div class="flex items-center gap-[6px]">
          <span class="text-[#E5E9EC] font-raj font-semibold text-xl">Estimated APR</span>
          <div class="w-2 h-2 rounded-full bg-[#88FF00]"></div>
        </div>
        <span class="text-[#88FF00] font-bold text-[28px] leading-none tracking-[-7%]">36.2%</span>
        <span class="text-[#88FF00] font-raj mt-2 font-semibold text-xs">Based on 24h volume</span>
      </div>
    </div>

    <!-- Add/Remove Liquidity -->
    <div class="flex gap-5 mt-13">
      <!-- Add Liquidity -->
      <div class="flex-1">
        <div class="flex items-start gap-4 mb-3 ">
          <div class="w-10 h-10 rounded-full border-1 border-[rgba(111,112,119,0.36)] flex items-center justify-center">
            <span class="text-white text-3xl font-normal pb-1.5 leading-[0.5]">+</span>
          </div>
           <div class="text-[#E5E9EC] font-raj">
             <h3 class="font-bold text-2xl leading-[0.9]">Add Liquidity</h3>
             <p class="font-semibold text-base mb-4 leading-[0.9]">Earn fees from bets</p>
           </div>
        </div>

        <p class="text-[#E5E9EC] font-raj font-semibold text-base mt-5 mb-2">Benefits</p>

        <div class="bg-[rgba(58,60,70,0.3)] rounded-[8px] px-5 py-6 flex flex-col">
          <ul class="flex flex-col mb-13">
            <li class="flex items-start gap-2">
              <span class="text-[#E5E9EC] font-raj font-medium text-xl mt-0.5">•</span>
              <span class="text-[#E5E9EC] font-raj font-medium text-xl">Earn 2.5% of every bet</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-[#E5E9EC] font-raj font-medium text-xl mt-0.5">•</span>
              <span class="text-[#E5E9EC] font-raj font-medium text-xl">Current APR: 43.2%</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-[#E5E9EC] font-raj font-medium text-xl mt-0.5">•</span>
              <span class="text-[#E5E9EC] font-raj font-medium text-xl">Withdraw anytime</span>
            </li>
          </ul>
   
          <button
            type="submit"
            :disabled="addLiquidityDisabled"
            class="w-full relative h-[42px] rounded-md overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            @click="$emit('openModal', 'add-liquidity')"
          >
            <ClippedCornerSvg
              :width="1010"
              :height="42"
              :fill-color="addLiquidityDisabled ? '#33383D' : '#E9E2DF'"
              :full-width="true"
              :full-height="true"
              border-radius="0"
              class="absolute inset-0"
            />
            <span :class="['relative z-10 font-chakra font-bold text-base uppercase', addLiquidityDisabled ? 'text-[#85888B]' : 'text-[#0C100F]']">
              ADD LIQUIDITY
            </span>
          </button>
        </div>
      </div>

      <!-- Remove Liquidity -->
      <div class="flex-1">
        <div class="flex items-start gap-4 mb-3">
          <div class="w-10 h-10 rounded-full border-1 border-[rgba(111,112,119,0.36)] flex items-center justify-center">
            <span class="text-white text-3xl font-normal pb-1.5 leading-[0.5]">−</span>
          </div>
          <div class="text-[#E5E9EC] font-raj">
            <h3 class="font-bold text-2xl leading-[0.9]">Remove Liquidity</h3>
            <p class="font-semibold text-base mb-4 leading-[0.9]">Withdraw your funds</p>
          </div>
        </div>

        <p class="text-[#E5E9EC] font-raj font-semibold text-base mt-5 mb-2">Benefits</p>

        <div class="bg-[rgba(58,60,70,0.3)] rounded-[8px] px-5 py-6 flex flex-col">
          <ul class="flex flex-col mb-13">
            <li class="flex items-start gap-2">
              <span class="text-[#E5E9EC] font-raj font-medium text-xl mt-0.5">•</span>
              <span class="text-[#E5E9EC] font-raj font-medium text-xl">Earn 2.5% of every bet</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-[#E5E9EC] font-raj font-medium text-xl mt-0.5">•</span>
              <span class="text-[#E5E9EC] font-raj font-medium text-xl">Current APR: 43.2%</span>
            </li>
            <li class="flex items-start gap-2">
              <span class="text-[#E5E9EC] font-raj font-medium text-xl mt-0.5">•</span>
              <span class="text-[#E5E9EC] font-raj font-medium text-xl">Withdraw anytime</span>
            </li>
          </ul>
 
          <button
            type="submit"
            :disabled="removeLiquidityDisabled"
            class="w-full relative h-[42px] rounded-md overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            @click="$emit('openModal', 'remove-liquidity')"
          >
            <ClippedCornerSvg
              :width="1010"
              :height="42"
              :fill-color="removeLiquidityDisabled ? '#33383D' : '#E9E2DF'"
              :full-width="true"
              :full-height="true"
              border-radius="0"
              class="absolute inset-0"
            />
            <span :class="['relative z-10 font-chakra font-bold text-base uppercase', removeLiquidityDisabled ? 'text-[#85888B]' : 'text-[#0C100F]']">
              REMOVE LIQUIDITY
            </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  totalPoolSize: number;
  userLiquidityShare: number;
  timeFilter: string;
  tokenImage?: string;
  tokenSymbol?: string;
  formatNumberNoDecimals: (num: number) => string;
  formatNumber: (num: number | string) => string;
  addLiquidityDisabled?: boolean;
  removeLiquidityDisabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  addLiquidityDisabled: false,
  removeLiquidityDisabled: true,
});

defineEmits<{
  'update:timeFilter': [value: string];
  'openModal': [modal: string];
}>();
</script>

