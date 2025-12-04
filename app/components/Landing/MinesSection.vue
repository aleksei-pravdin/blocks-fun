<template>
  <section class="w-full py-20">
    <div class="max-w-[1040px] w-full mx-auto px-4">
      <!-- Title -->
      <div class="mb-12">
        <div class="flex items-center gap-1.5 mb-4">
          <Arrow class="w-5 h-3" :filled="true" />
          <span class="uppercase font-raj font-semibold text-xl text-[#E5E9EC] tracking-wider">
            LEARN
          </span>
        </div>
        <h2 class="font-black uppercase text-[48px] leading-[0.79] tracking-[-5%] text-white font-sans">
          EXPLORE MINES
        </h2>
      </div>

      <!-- Separator -->
      <div class="h-[3px] bg-[#1E1E1E] mb-12"></div>

      <!-- Mines Grid -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
        <LandingMineCard 
          :mine="{
            name: 'Bonk Mine',
            feeTier: 2,
            maxWin: 60,
            apr: 38.2,
            liquidity: 87900,
            volume24h: 22000,
            hotInfo: 'This is hot mine, 22 bets in the past hour!'
          }"
        />
        <LandingMineCard 
          :mine="{
            name: 'SOL Mine',
            feeTier: 2.5,
            maxWin: 30,
            apr: 80.2,
            liquidity: 67900,
            volume24h: 36200,
            hotInfo: 'This is hot mine, 902 bets in the past hour!',
            trending: true
          }"
        />
        <LandingMineCard 
          :mine="{
            name: 'WIF Mine',
            feeTier: 1.5,
            maxWin: 90,
            apr: 80.3,
            liquidity: 220000,
            volume24h: 2000,
            hotInfo: 'This is hot mine, 90 bets in the past hour!',
            featured: true
          }"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Arrow from "~/assets/svg/arrow.svg";
</script>

