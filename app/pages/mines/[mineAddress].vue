<script setup lang="ts">
import Mine from "~/assets/svg/mine.svg";
import Arrow from "~/assets/svg/arrow.svg";
import Fire from "~/assets/svg/fire.svg";
import External from "~/assets/svg/external.svg";

import { usePoolQuery } from "~/composables/usePoolQuery";
import { useTokenInfoQuery } from "~/composables/useTokenInfoQuery";

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

const userLiquidityShare = computed(() =>
  (
    (Number(liquidityBalance.value) /
      Number(pool.value?.totalLiquiditySupply)) *
    100
  ).toFixed(2)
);

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

// Optional: unified refetch
function refetchAll() {
  refetchPool();
  refetchToken();
}
</script>

<template>
  <div class="mt-8 max-w-[1380px] w-full mx-auto">
    <div v-if="loading">Loading…</div>
    <div v-else-if="error">Something went wrong</div>

    <div v-else-if="loaded" class="flex items-start gap-10">
      <!-- Left card -->
      <div
        class="w-full max-w-xs bg-[#222328] rounded-lg p-5 flex flex-col items-start gap-4"
      >
        <div class="flex flex-col gap-2 items-start">
          <h1 class="text-2xl font-black">{{ token!.symbol }} Mine</h1>
          <div
            class="flex items-center gap-1 bg-[rgba(255,75,1,0.27)] text-[#FF4B01] py-0.75 px-2.75 rounded-3xl text-sm font-semibold font-raj"
          >
            <Fire />
            <span>Trending</span>
          </div>
        </div>

        <div class="w-full h-px bg-[rgba(62,63,71,0.58)]"></div>

        <div class="flex gap-3 items-center">
          <img
            class="size-12.5 rounded-full"
            :src="token?.image ?? ''"
            alt=""
          />

          <div class="flex flex-col items-start">
            <span class="font-bold text-lg">Token Address</span>
            <NuxtLink
              :to="`https://solscan.io/address/${pool!.tokenMint}`"
              target="_blank"
              class="font-bold py-1 px-3 rounded-md text-sm text-[#9497A4] bg-[rgba(111,112,119,0.36)] flex items-center gap-4"
            >
              {{ shorten(pool!.tokenMint) }}

              <External />
            </NuxtLink>
          </div>
        </div>

        <div class="flex gap-3 items-center">
          <Mine class="size-12.5! rounded-full" :filled="true" />

          <div class="flex flex-col items-start">
            <span class="font-bold text-lg">Mine Address</span>
            <NuxtLink
              :to="`https://solscan.io/address/${mineAddress}`"
              target="_blank"
              class="font-bold py-1 px-3 rounded-md text-sm text-[#9497A4] bg-[rgba(111,112,119,0.36)] flex items-center gap-4"
            >
              {{ shorten(mineAddress as string) }}

              <External />
            </NuxtLink>
          </div>
        </div>

        <div
          class="flex flex-col gap-4 bg-[#2E3239] px-2.5 py-5 w-full rounded-lg"
        >
          <div class="flex gap-1.5 items-center">
            <Arrow class="w-[21px]! h-[13px]!" :filled="true" />
            <span class="font-semibold text-xl font-raj">Liquidity</span>
          </div>

          <span class="font-bold text-2xl">{{ totalPoolSize }}</span>
        </div>
      </div>

      <!-- Right side -->
      <div class="flex flex-col w-full gap-4">
        <div class="flex bg-[#2E3239] rounded-lg justify-between p-5">
          <div class="flex flex-col gap-4">
            <div class="flex items-center gap-1.5">
              <Arrow class="w-[21px]! h-[13px]!" :filled="true" />
              <span class="text-xl font-raj font-semibold">House Edge</span>
            </div>
            <span class="text-3xl font-bold">{{ houseEdge }}%</span>
          </div>
          <div class="flex flex-col gap-4">
            <div class="flex items-center gap-1.5">
              <Arrow class="w-[21px]! h-[13px]!" :filled="true" />
              <span class="text-xl font-raj font-semibold">Max Win</span>
            </div>
            <div class="text-3xl font-bold flex gap-2.5 items-center">
              <span>{{ maxWinPercent }}%</span>
              <span>/ {{ maxWinTokens }}</span>
              <img
                class="size-6 rounded-full"
                :src="token?.image ?? ''"
                alt=""
              />
            </div>
          </div>
          <div class="flex flex-col gap-4">
            <div class="flex items-center gap-1.5">
              <Arrow class="w-[21px]! h-[13px]!" :filled="true" />
              <span class="text-xl font-raj font-semibold">Volume (24h)</span>
            </div>
            <span class="text-3xl font-bold">0</span>
          </div>
        </div>

        <MinesPlayForm :pool="pool!" :mineAddress="mineAddress" />

        <div class="flex flex-col gap-4.5">
          <h2 class="uppercase font-bold text-2xl font-raj">Liquidity</h2>
          <div class="w-full h-0.75 bg-[#1E1E1E]"></div>
        </div>
        <div class="flex gap-5">
          <div class="bg-[#2E3239] p-5 flex flex-col gap-4 rounded-lg w-full">
            <span class="font-raj text-xl font-semibold">Total Pool Size</span>
            <span class="font-bold text-3xl">{{ totalPoolSize }}</span>
            <span class="text-[#787B7C] text-xs font-semibold">{{
              token?.symbol
            }}</span>
          </div>
          <div class="bg-[#2E3239] p-5 flex flex-col gap-4 rounded-lg w-full">
            <span class="font-raj text-xl font-semibold">Locked Liquidity</span>
            <span class="font-bold text-3xl">{{ lockedLiquidity }}</span>
            <span class="text-[#787B7C] text-xs font-semibold">{{
              token?.symbol
            }}</span>
          </div>
          <div class="bg-[#2E3239] p-5 flex flex-col gap-4 rounded-lg w-full">
            <span class="font-raj text-xl font-semibold">Your Share</span>
            <span class="font-bold text-3xl">{{ userLiquidityShare }}%</span>
            <!-- <span class="text-[#787B7C] text-xs font-semibold">{{
              token?.symbol
            }}</span> -->
          </div>
        </div>

        <div class="flex gap-5">
          <div class="w-[50%]">
            <div class="flex flex-col gap-2 font-raj font-bold">
              <span class="text-2xl">Add Liquidity</span>
              <span>Earn fees from bets</span>
            </div>

            <div class="mt-11">
              <div class="font-raj font-bold">Benefits</div>

              <div class="mt-3 bg-[rgba(58,60,70,0.37)] rounded-md px-5 py-7">
                <ul>
                  <li>• Earn 2.5% of every bet</li>
                  <li>• Current APR: 43.2%</li>
                  <li>• Withdraw anytime</li>
                </ul>

                <button
                  @click="openModal('addLiquidity')"
                  class="cursor-pointer bg-[#E9E2DF] text-[#0C100F] w-full rounded-md mt-10 py-2 uppercase font-bold"
                >
                  Add Liquidity
                </button>
              </div>
            </div>
          </div>

          <div class="w-[50%]">
            <div class="flex flex-col gap-2 font-raj font-bold">
              <span class="text-2xl">Remove Liquidity</span>
              <span>Withdraw your funds</span>
            </div>

            <div class="mt-11">
              <div class="font-raj font-bold">Benefits</div>

              <div class="mt-3 bg-[rgba(58,60,70,0.37)] rounded-md px-5 py-7">
                <ul>
                  <li>• Earn 2.5% of every bet</li>
                  <li>• Current APR: 43.2%</li>
                  <li>• Withdraw anytime</li>
                </ul>

                <button
                  @click="openModal('removeLiquidity')"
                  class="cursor-pointer bg-[#33383D] text-[#85888B] w-full rounded-md mt-10 py-2 uppercase font-bold"
                >
                  Remove Liquidity
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-4.5">
          <h2 class="uppercase font-bold text-2xl font-raj">Statistics</h2>
          <div class="w-full h-0.75 bg-[#1E1E1E]"></div>
        </div>
      </div>
    </div>
  </div>
</template>
