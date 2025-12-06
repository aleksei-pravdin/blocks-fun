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
        <MineCard
          v-for="mockMine in mockMines"
          :key="mockMine.pool.pubkey"
          :pool="mockMine.pool"
          :token="mockMine.token"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import Arrow from "~/assets/svg/arrow.svg";
import type { Pool } from "~/lib/pools";
import MineCard from "~/components/Mines/MineCard.vue";

const mockMines = [
{
    pool: {
      pubkey: "mock-pubkey-2",
      pool: {
        tokenMint: "So11111111111111111111111111111111111111112" as any,
        liquidityMint: "So11111111111111111111111111111111111111112" as any,
        totalLiquiditySupply: 0n,
        totalPoolTokens: 679000000000n, // 67900 with 9 decimals
        lockedLiquidity: 0n,
        platformFee: 0n,
        houseEdge: 250, // 2.5%
        maxWinLiqThreshold: 3000, // 30%
        bump: 0,
      } as Pool,
    },
    token: {
      symbol: "SOL",
      image: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
      decimals: 9,
    },
  },
  {
    pool: {
      pubkey: "mock-pubkey-2",
      pool: {
        tokenMint: "So11111111111111111111111111111111111111112" as any,
        liquidityMint: "So11111111111111111111111111111111111111112" as any,
        totalLiquiditySupply: 0n,
        totalPoolTokens: 679000000000n, // 67900 with 9 decimals
        lockedLiquidity: 0n,
        platformFee: 0n,
        houseEdge: 250, // 2.5%
        maxWinLiqThreshold: 3000, // 30%
        bump: 0,
      } as Pool,
    },
    token: {
      symbol: "SOL",
      image: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
      decimals: 9,
    },
  },
  {
    pool: {
      pubkey: "mock-pubkey-2",
      pool: {
        tokenMint: "So11111111111111111111111111111111111111112" as any,
        liquidityMint: "So11111111111111111111111111111111111111112" as any,
        totalLiquiditySupply: 0n,
        totalPoolTokens: 679000000000n, // 67900 with 9 decimals
        lockedLiquidity: 0n,
        platformFee: 0n,
        houseEdge: 250, // 2.5%
        maxWinLiqThreshold: 3000, // 30%
        bump: 0,
      } as Pool,
    },
    token: {
      symbol: "SOL",
      image: "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
      decimals: 9,
    },
  },
];
</script>

