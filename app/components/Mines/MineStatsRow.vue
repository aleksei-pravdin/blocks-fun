<template>
  <div class="flex px-2 py-4 pb-6 bg-[#2E3239] rounded-[8px]">
    <!-- Fees Collected -->
    <div class="flex-1 flex flex-col px-2.5 ">
      <div class="flex items-center gap-[6px]">
        <Arrow class="w-[21px]! h-[13px]!" :filled="true" />
        <span class="text-[#E5E9EC] font-raj font-semibold text-xl">Fees Collected</span>
      </div>
      <div class="flex items-center gap-[10px]">
        <span class="text-[#FCF5F0] font-sans font-bold text-[28px] leading-none tracking-[-7%]">29,000</span>
        <img
          v-if="tokenImage"
          class="w-6 h-6 rounded-full"
          :src="tokenImage"
          :alt="tokenSymbol || 'Token'"
        />
      </div>
    </div>
    <!-- Separator -->
    <div class="w-px h-[58px] mr-8 ml-4 bg-[#484D57]"></div>
    <!-- Fee Tier -->
    <div class="flex-1 flex flex-col px-2.5">
      <div class="flex items-center gap-[6px]">
        <Arrow class="w-[21px]! h-[13px]!" :filled="true" />
        <span class="text-[#E5E9EC] font-raj font-semibold text-xl">Fee Tier</span>
      </div>
      <span class="text-[#FCF5F0] font-sans font-bold text-[28px] leading-none tracking-[-7%]">{{ feeTier }}%</span>
    </div>
    <!-- Separator -->
    <div class="w-px h-[58px] mr-3 ml-3 bg-[#484D57]"></div>
    <!-- Max Win -->
    <div class="flex-1 flex flex-col px-2.5">
      <div class="flex items-center gap-[6px]">
        <Arrow class="w-[21px]! h-[13px]!" :filled="true" />
        <span class="text-[#E5E9EC] font-raj font-semibold text-xl">Max Win</span>
      </div>
      <div class="flex items-end gap-1">
        <span class="text-[#FCF5F0] font-bold text-[28px] leading-none tracking-[-7%]">{{ maxWinPercent }}%</span>
        <span class="text-[18px]">/</span>
        <span class="text-[#FCF5F0] font-bold text-[28px] leading-none tracking-[-7%]">{{ maxWinTokens }}</span>
        <img
          v-if="tokenImage"
          class="w-6 h-6 rounded-full"
          :src="tokenImage"
          :alt="tokenSymbol || 'Token'"
        />
      </div>
    </div>
    <!-- Separator -->
    <div class="w-px h-[58px] mr-6 ml-12 bg-[#484D57]"></div>
    <!-- Volume (24H) -->
    <div class="flex-1 flex flex-col items-end  px-2.5">
      <div class="flex flex-col ">
        <div class="flex items-center gap-[6px]">
          <Arrow class="w-[21px]! h-[13px]!" :filled="true" />
          <span class="text-[#E5E9EC] font-raj font-semibold text-xl">Volume (24H)</span>
        </div>
        <div class="flex items-end gap-1">
          <span class="text-[#FCF5F0] font-bold text-[28px] leading-none tracking-[-7%]">$32,300</span>
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
import Arrow from "~/assets/svg/arrow.svg";

interface Props {
  feeTier: string;
  maxWinPercent: string;
  maxWinTokens: string;
  tokenImage?: string;
  tokenSymbol?: string;
}

defineProps<Props>();
</script>

