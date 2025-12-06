<template>
  <div class="flex flex-col relative h-[420px] bg-gradient-to-b from-[#2c2d33] to-[#0f1312] p-5 pt-3 rounded-lg overflow-hidden">
    <HeaderCardBg />
    
    <div class="flex gap-2">
      <img class="size-11! rounded-full mt-1" :src="token.image" />

      <div class="flex flex-col font-bold">
        <span class="text-2xl font-raj leading-[1.2] tracking-[1%]">{{ token.symbol }} Mine</span>
        <span
          class="bg-[rgba(153,29,255,0.33)] text-[#DFB7FF] px-2 font-raj text-xs rounded-[3px] uppercase"
          >House Edge {{ (pool.pool.houseEdge / 100).toFixed(2) }}%</span
        >
      </div>
    </div>

    <div class="my-3 bg-[rgba(62,63,71,0.58)] w-full h-px"></div>

    <div class="flex">
      <div class="w-[57%] flex flex-col">
        <span class="font-medium font-raj text-xl tracking-[0.2px] text-[#E5E9EC]">Liquidity</span>
        <div class="flex items-center gap-1"> 
          <span class="font-[600] text-white text-2xl leading-[0.7] tracking-[1px]">{{
            (
              Number(pool.pool.totalPoolTokens) /
              10 ** token.decimals
              ).toFixed(2)
            }}
          </span>
          <img class="size-5! rounded-full" :src="token.image" />  
        </div>
      </div>

      <div class="w-[43%] flex flex-col">
        <span class="font-medium font-raj text-xl tracking-[0.2px] text-[#E5E9EC]">Max Win</span>
        <span class="font-[600] text-white text-2xl leading-[0.7] tracking-[1px]"
          >{{ (pool.pool.maxWinLiqThreshold / 100).toFixed(2) }}%</span
        >
      </div>
    </div>

    <div class="flex pt-8">
      <div class="w-[57%] flex flex-col">
        <span class="font-medium text-xl font-raj tracking-[0.2px] text-[#E5E9EC]">Volume (24h)</span>
        <div class="flex items-center gap-1"> 
          <span class="font-[600] text-white text-2xl leading-[0.7] tracking-[1px]">
            36,200
          </span>
          <img class="size-5! rounded-full" :src="token.image" />  
        </div>
      </div>

      <div class="w-[43%] flex flex-col">
        <span class="font-medium font-raj text-xl tracking-[0.2px] text-[#E5E9EC]">APR</span>
        <span class="font-[600] text-white text-2xl leading-[0.7] tracking-[1px]"
          >
          80.2%
          </span>
      </div>
    </div>
    
    
    <div class="flex flex-col gap-2 justify-end h-full pb-2">
      <div class="flex flex-col gap-2 justify-start h-full">
        <div class="mt-7 mb-1 bg-[rgba(62,63,71,0.58)] w-full h-px"></div>

        <div class="flex items-center gap-1 pl-3">
          <Fire class="w-5! h-5! text-[#787B7C]" />
          
          <div class="font-[500] text-[11px] text-[#787B7C] tracking-[-0.3px]">
            This is hot mine, 22 bets in the past hour!
          </div>
        </div>

      </div>
      <NuxtLink
        class="relative text-[#0C100F] font-bold uppercase flex gap-2.5 items-center justify-center py-3 overflow-hidden"
        :to="`/mines/${pool.pubkey}`"
      >
        <ClippedCornerSvg
          :width="200"
          :height="48"
          :percent="5"
          fill-color="#E9E2DF"
          :full-width="true"
          :full-height="true"
          :clip-size="16"
          border-radius="8px"
          class="absolute inset-0"
        />
        <span class="relative z-10 flex gap-2.5 items-center text-[15px] font-[500] tracking-[0.1px]">
          Enter Mine
          <div class="flex items-center gap-2.5">
            <Pickaxe class="w-[26px]! h-[21px]!" :filled="true" />
          </div>
        </span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Pool } from "~/lib/pools";
import Pickaxe from "~/assets/svg/pickaxe.svg";
import Fire from "~/assets/svg/fire.svg";

interface Props {
  pool: {
    pubkey: string;
    pool: Pool;
  };
  token: {
    symbol: string;
    image: string | null;
    decimals: number;
  };
}

defineProps<Props>();
</script>

