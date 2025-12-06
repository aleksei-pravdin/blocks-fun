<template>
  <div class="mx-auto max-w-[1382px] w-full flex flex-col pt-10 gap-8 px-4">
    <!-- Header -->
    <div class="flex items-end justify-between gap-4">
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-1.5">
          <Arrow class="w-6 h-4" :filled="true" style="width: 24px; height: 16px !important;" />
          <span class="uppercase font-raj font-semibold text-xl text-[#E5E9EC] tracking-wider" style="letter-spacing:-0.5px; line-height: 1.5;">
            Tokens
          </span>
        </div>

        <h1 class="font-black uppercase text-[48px] leading-[0.79] tracking-[-5%] text-white font-sans" style="letter-spacing:-2px">
          Explore Tokens
        </h1>
      </div>

      <CreateMineButton variant="clipped" />
    </div>

    <div class="h-px w-full bg-[#262B33]"></div>

    <div
      class="w-full text-white grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-[20px] pb-[200px]"
    >
      <NuxtLink
        v-for="asset in assets"
        :to="`/mines/token/${asset.address}`"
        :key="asset.address"
        class="relative overflow-hidden rounded-[8px] bg-[#2E3239] shadow-[0_18px_40px_rgba(0,0,0,0.6)] px-6 py-3 flex flex-col justify-between w-[260px] h-[220px] transition-transform transition-shadow duration-150 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(0,0,0,0.8)]"
      >
        <!-- subtle diagonal top background -->
        <div
          class="pointer-events-none absolute -top-12 right-0 w-[220px] h-[140px] opacity-40"
          aria-hidden="true"
        >
          <div
            class="w-full h-full bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.12)_0,_transparent_60%)] rotate-[-8deg]"
          ></div>
        </div>

        <!-- Header -->
        <div class="relative z-10 mb-4 flex items-start justify-between gap-3">
          <div class="flex flex-col gap-1">
            <span class="text-lg md:text-xl font-semibold tracking-tight">
              {{ asset.symbol }}
            </span>

            <div
              v-if="asset.players"
              class="inline-flex items-center bg-[#FFFFFF40] rounded-[3px] px-[7px] py-[3px] text-[#E5E9EC]"
            >
              <span
                class="font-raj font-bold text-[12px] leading-[100%] tracking-[0] uppercase"
              >
                {{ formatPlayers(asset.players) }}&nbsp;Players
              </span>
            </div>
          </div>

          <div class="flex flex-col items-end gap-3 mt-[9px] mr-[-7px]">
            <span class="inline-flex items-center justify-center">
              <MineOpenIcon class="w-[13px] h-[13px] text-[#FF4B01]" />
            </span>
          </div>
        </div>

        <!-- Bottom -->
        <div class="relative z-10 flex items-end pb-2 justify-between gap-4 mt-auto">
          <div class="flex flex-col gap-1">
            <span
              class="font-raj font-bold text-xs uppercase tracking-[0.16em] text-[#9FA6B2]"
            >
              Mines
            </span>
            <span class="text-3xl font-black leading-none">
              {{ asset.mines?.toLocaleString?.() ?? "—" }}
            </span>
          </div>

          <img
            class="shrink-0 w-[94px] h-[94px] rounded-full object-contain"
            :src="asset.image"
            :alt="asset.symbol"
          />
        </div>
      </NuxtLink>
    </div>

    <!-- <div
      class="w-full mt-5 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8"
    >
      
    </div> -->
  </div>
</template>

<script setup lang="ts">
import MineOpenIcon from "~/assets/svg/mine_open_icon.svg";
import Arrow from "~/assets/svg/arrow.svg";

const assets = ref([
  {
    symbol: "SOL",
    players: 1800,
    mines: 680,
    image:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
    // address: "So11111111111111111111111111111111111111112",
    address: "4qAzNbdEhxVkJ2ZDuzJDeQVP9Hxwomt32STCfyFkGS4Q",
  },
  {
    symbol: "USDC",
    players: 960,
    mines: 420,
    image:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  },
]);


const formatPlayers = (count: number) => {
  if (count >= 1000) {
    const value = Math.round((count / 1000) * 10) / 10;
    return `${value}K`;
  }
  return count.toString();
};

type LastGame = {
  user: string;
  betAmount: number; // in tokens, already human-readable
  betTokenSymbol: string;
  betTokenLogo: string;
  multiplier: number; // 0, 2, 53.23, etc.
  winAmount: number; // betAmount * multiplier (already computed for mock)
  signature: string;
  poolName: string;
  cluster?: "mainnet" | "devnet" | "testnet";
};

const cluster = "devnet" as const; // change if needed

const TOKEN_LOGO_SOL =
  "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png";

// Mock data
const games: LastGame[] = [
  {
    user: "9wFFo5AFzU6qK2qP5T1P2YZqQyQ7aZvF3t2yGqC1pQqJ",
    betAmount: 0.25,
    betTokenSymbol: "SOL",
    betTokenLogo: TOKEN_LOGO_SOL,
    multiplier: 2,
    winAmount: 0.5,
    signature:
      "4Q4VQxWq7fLZV4hR9Y1uB3uW3N7zKk7H9y3vM2wB2FsvqYk8n3NnHnqK3tF3c9rYW...",
    poolName: "Mines 5x",
    cluster,
  },
  {
    user: "7GvNwz1JjQ4vZp1P3aK8cXzE9PpU7nThpCh7D1L8cM8X",
    betAmount: 1.0,
    betTokenSymbol: "SOL",
    betTokenLogo: TOKEN_LOGO_SOL,
    multiplier: 0,
    winAmount: 0,
    signature:
      "5F3Yqj6R2sVf8PdLw8XnH7tGq2CqTySKkUfG6gkz7QkB9dZ7Hh2B3JtW7yG6f4DqM...",
    poolName: "Mines 10x",
    cluster,
  },
  {
    user: "3sLkYqXz9TbR6LvZs1UeNqf9Sx8RkLc4Am9TzZqR3m9H",
    betAmount: 0.05,
    betTokenSymbol: "SOL",
    betTokenLogo: TOKEN_LOGO_SOL,
    multiplier: 53.23,
    winAmount: 2.6615,
    signature:
      "2YgLhs9QfNwS7BxkDqR5FuP6YsL9Xc1WdG2QpN3ZsV7TgU9Jk3PqWx8Tg4Zs8NvK...",
    poolName: "High Risk",
    cluster,
  },
  {
    user: "Az2Yp5Qh8KkV9Lm4Ns7Tg2Bv6Qp9Wc3Er8Ty9Uj4Io7P",
    betAmount: 0.75,
    betTokenSymbol: "SOL",
    betTokenLogo: TOKEN_LOGO_SOL,
    multiplier: 0,
    winAmount: 0,
    signature:
      "6HwPzD1RfT2GyH3JkL4ZxV5BnM6QwE7RtY8UiO9Pa2Sd3Fg4Hj5Kl6Zx7Cv8Bn9M...",
    poolName: "Classic",
    cluster,
  },
];

// helpers
const shorten = (s: string) => {
  if (s.length <= 12) return s;
  return `${s.slice(0, 4)}…${s.slice(-4)}`;
};

const userUrl = (address: string) =>
  `https://explorer.solana.com/address/${address}?cluster=${cluster}`;

const txUrl = (signature: string) =>
  `https://explorer.solana.com/tx/${signature}?cluster=${cluster}`;
</script>
