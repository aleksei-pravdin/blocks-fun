<script setup lang="ts">
import Mine from "~/assets/svg/mine.svg";
import Arrow from "~/assets/svg/arrow.svg";
import Fire from "~/assets/svg/fire.svg";
import External from "~/assets/svg/external.svg";
import { shorten } from "~/lib/pools";
import { usePoolQuery } from "~/composables/usePoolQuery";
import { useTokenInfoQuery } from "~/composables/useTokenInfoQuery";
import PlayForm from "~/components/Mines/PlayForm.vue";
import HeaderCardBg from "~/components/HeaderCardBg.vue";
import VolumeChart from "~/components/Charts/VolumeChart.vue";
import LiveFeed from "~/components/Mines/LiveFeed.vue";
import MineStatsRow from "~/components/Mines/MineStatsRow.vue";
import LiquiditySection from "~/components/Mines/LiquiditySection.vue";
import YourPositionDetails from "~/components/Mines/YourPositionDetails.vue";
import RecentGames from "~/components/Mines/RecentGames.vue";
import PoolStats from "~/components/Mines/PoolStats.vue";

const route = useRoute();
const router = useRouter();
const { mineAddress } = route.params;

function openModal(modal: string) {
  router.push({ query: { modal, mineAddress } });
}

// 1) Pool query
const {
  pool,
  isLoading: poolLoading,
  isError: poolError,
  refetch: refetchPool,
} = usePoolQuery(mineAddress as string);

// 2) Token info query (dependent on pool.tokenMint)
const tokenMint = computed(() =>
  pool.value?.tokenMint ? pool.value.tokenMint.toString() : null
);

const liquidityMint = computed(() =>
  pool.value?.liquidityMint ? pool.value.liquidityMint.toString() : null
);

const userLiquidityShare = computed(() => {
  if (!pool.value?.totalLiquiditySupply || !liquidityBalance.value) return "0.00";
  return (
    (Number(liquidityBalance.value) /
      Number(pool.value.totalLiquiditySupply)) *
    100
  ).toFixed(2);
});

const {
  token,
  isLoading: tokenLoading,
  isError: tokenError,
  refetch: refetchToken,
} = useTokenInfoQuery(tokenMint);

const {
  balance: liquidityBalance,
  isLoading: balanceLoading,
  isError: balanceError,
  refetch: refetchBalance,
} = getUseTokenBalanceQuery(liquidityMint);

// 3) Combined loaded/error states
const loaded = computed(() => !!pool.value && !!token.value);
const loading = computed(() => poolLoading.value || tokenLoading.value);
const error = computed(() => poolError.value || tokenError.value);

// 4) Derived values (guarded against nulls)
const houseEdge = computed(() => {
  if (!pool.value) return "0.00";
  return (pool.value.houseEdge / 100).toFixed(2);
});

const maxWinPercent = computed(() => {
  if (!pool.value) return "0.00";
  return (pool.value.maxWinLiqThreshold / 100).toFixed(2);
});

const maxWinTokens = computed(() => {
  if (!pool.value || !token.value) return "0.00";

  const thresh = pool.value.maxWinLiqThreshold / 100 / 100;
  const totalTokens = Number(pool.value.totalPoolTokens);
  const decimals = token.value.decimals;

  const maxTokens = (thresh * totalTokens) / 10 ** decimals;
  return maxTokens.toFixed(2);
});

const totalPoolSize = computed(() => {
  if (!pool.value || !token.value) return "0";
  return (
    Number(pool.value.totalPoolTokens) /
    10 ** token.value.decimals
  ).toFixed(2);
});

const lockedLiquidity = computed(() => {
  if (!pool.value || !token.value) return "0";
  return (
    Number(pool.value.lockedLiquidity) /
    10 ** token.value.decimals
  ).toFixed(2);
});

const feeTier = computed(() => {
  if (!pool.value) return "0";
  return Math.round(pool.value.houseEdge / 100).toString();
});

// Format number with commas
const formatNumber = (num: number | string): string => {
  const numStr = typeof num === 'string' ? num : num.toString();
  const parts = numStr.split('.');
  if (parts[0]) {
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  return parts.join('.');
};

// Format number without decimals
const formatNumberNoDecimals = (num: number | string): string => {
  const numStr = typeof num === 'string' ? num : Math.round(Number(num)).toString();
  return numStr.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// Time filter states
const liquidityTimeFilter = ref("30D");
const statisticsTimeFilter = ref("30D");

// Volume chart data (mock data for now)
const volumeChartData = computed(() => {
  return Array.from({ length: 60 }, () => Math.random() * 100);
});

// Optional: unified refetch
function refetchAll() {
  refetchPool();
  refetchToken();
}
</script>

<template>
  <div class="w-full bg-[#0C100F] min-h-screen">
    <!-- Live Feed -->
    <LiveFeed />

    <div v-if="loading" class="max-w-[1728px] w-full mx-auto px-[60px] py-8">
      <div class="text-white">Loading…</div>
    </div>
    <div v-else-if="error" class="max-w-[1728px] w-full mx-auto px-[60px] py-8">
      <div class="text-white">Something went wrong</div>
    </div>

    <div v-else-if="loaded" class="max-w-[1500px] w-full mx-auto px-[60px] pb-12 pt-9">
      <div class="flex items-start gap-11">
        <!-- Left Sidebar -->
        <div class="w-[330px] flex-shrink-0">
          <div class="bg-[#222328] rounded-[8px] p-5 pb-0 relative overflow-hidden">
            <!-- Background texture -->
            <div class="absolute inset-0 opacity-30 pointer-events-none"></div>
            
            <!-- HeaderCardBg -->
            <HeaderCardBg />

            <!-- Header -->
            <div class="relative z-10 mb-[22px]">
              <div class="flex flex-col items-start gap-2 mb-[22px]">
                <h1 class="text-[22px] font-black uppercase text-white font-sans leading-[0.79] tracking-[-5%]">
                  {{ token!.symbol }} MINE
                </h1>

                <div
                  class="flex items-center justify-center gap-[4px] px-[11px] py-[3px] rounded-[31px] bg-[rgba(255,75,1,0.27)]"
                >
                  <Fire class="w-4 h-4 text-[#FF4B01]" />
                  <span class="text-[#FF4B01] font-raj font-bold leading-[0.1] text-xs">Trending</span>
                </div>
              </div>
            </div>

            <!-- Separator -->
            <div class="relative z-10 h-px w-full bg-[rgba(62,63,71,0.58)] mb-2"></div>

            <!-- Token Address -->
            <div class="relative z-10 mb-3">
              <div class="flex items-center gap-[10px] p-[5px]">
                <img
                  class="w-[50px] h-[50px] rounded-full flex-shrink-0"
                  :src="token?.image ?? ''"
                  :alt="token?.symbol"
                />
                <div class="flex flex-col gap-[7px]">
                  <span class="text-white  font-bold text-md leading-none tracking-[-7%]">Token Address</span>
                  <NuxtLink
                    :to="`https://solscan.io/address/${pool!.tokenMint}`"
                    target="_blank"
                    class="flex items-center justify-between gap-[18px] px-[11px] py-[5px] rounded-[5px] bg-[rgba(111,112,119,0.36)] w-[140px]"
                  >
                    <span class="text-[#9497A4] font-raj font-bold text-sm">{{ shorten(pool!.tokenMint.toString()) }}</span>
                    <External class="w-4 h-4 flex-shrink-0" />
                  </NuxtLink>
                </div>
              </div>
            </div>

            <!-- Mine Address -->
            <div class="relative z-10 mb-7">
              <div class="flex items-center gap-[10px] ">
                <Mine class="w-[50px]! h-[50px]! flex-shrink-0" :filled="true" />
                <div class="flex flex-col gap-[7px]">
                  <span class="text-white  font-bold text-md leading-none tracking-[-7%]">Mine Address</span>
                  <NuxtLink
                    :to="`https://solscan.io/address/${mineAddress}`"
                    target="_blank"
                    class="flex items-center justify-between gap-[18px] px-[11px] py-[5px] rounded-[5px] bg-[rgba(111,112,119,0.36)] w-[140px]"
                  >
                    <span class="text-[#9497A4] font-chakra font-bold text-sm">{{ shorten(mineAddress as string) }}</span>
                    <External class="w-4 h-4 flex-shrink-0" />
                  </NuxtLink>
                </div>
              </div>
            </div>

  

            <!-- Liquidity -->
            <div class="relative z-10 mb-13">
              <div class="flex flex-col  px-2.5 py-4 bg-[#2E3239] rounded-[8px]">
                <div class="flex items-center gap-2">
                  <Arrow class="w-[21px]! h-[13px]!" :filled="true" />
                  <span class="text-[#E5E9EC] font-raj font-semibold text-xl">Liquidity</span>
                </div>
                <div class="flex items-center gap-[10px]">
                  <span class="text-[#FCF5F0]  font-bold text-[28px] leading-none tracking-[-7%]">{{ formatNumberNoDecimals(totalPoolSize) }}</span>
                  <span class="text-[24px]">🪙</span>
                </div>
              </div>
            </div>

            <!-- Volume Over Time Graph -->
            <div class="relative z-10">
              <div class="mb-2">
                <span class="text-[#E5E9EC] font-raj font-bold text-base">Volume Over Time</span>
              </div>
              <ClientOnly>
                <VolumeChart :data="volumeChartData" />
                <template #fallback>
                  <div class="h-[135px] p-5 relative">
                    <div class="w-full h-full flex items-center justify-center">
                      <span class="text-[#9497A4] text-sm">Loading chart...</span>
                    </div>
                  </div>
                </template>
              </ClientOnly>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="flex-1 flex flex-col gap-5">

          <MineStatsRow
            :fee-tier="feeTier"
            :max-win-percent="maxWinPercent"
            :max-win-tokens="formatNumberNoDecimals(maxWinTokens)"
            :token-image="token?.image || undefined"
            :token-symbol="token?.symbol || undefined"
          />

 
          <PlayForm v-if="pool && mineAddress" :pool="pool" :mineAddress="mineAddress as string" />

    
          <LiquiditySection
            :total-pool-size="Number(totalPoolSize)"
            :user-liquidity-share="Number(userLiquidityShare)"
            :time-filter="liquidityTimeFilter"
            :token-image="token?.image || undefined"
            :token-symbol="token?.symbol || undefined"
            :format-number-no-decimals="formatNumberNoDecimals"
            :format-number="formatNumber"
            :add-liquidity-disabled="false"
            :remove-liquidity-disabled="Number(userLiquidityShare) === 0"
            @update:time-filter="liquidityTimeFilter = $event"
            @open-modal="openModal"
          />

          <YourPositionDetails
            :user-liquidity-share="userLiquidityShare"
            :token-image="token?.image || undefined"
            :token-symbol="token?.symbol || undefined"
            :format-number="formatNumber"
          />

          <!-- Pool Statistics -->
          <PoolStats
            :total-games="900"
            :avg-bet-size="90.6"
            :house-edge="houseEdge"
            :win-ratio="60.2"
            :time-filter="statisticsTimeFilter"
            :token-image="token?.image || undefined"
            :token-symbol="token?.symbol || undefined"
            :format-number-no-decimals="formatNumberNoDecimals"
            :format-number="formatNumber"
            @update:time-filter="statisticsTimeFilter = $event"
          />

          <RecentGames />
        </div>
      </div>
    </div>
  </div>
</template>
