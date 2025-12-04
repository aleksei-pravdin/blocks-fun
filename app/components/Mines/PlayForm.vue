<template>
  <div class="flex flex-col gap-4.5">
    <h2 class="uppercase font-bold text-2xl font-raj">Play</h2>
    <div class="w-full h-0.75 bg-[#1E1E1E]"></div>
  </div>

  <!-- MAIN FORM -->
  <form class="flex flex-col gap-11" @submit.prevent="onMineSubmit">
    <!-- BET AMOUNT -->
    <div class="flex flex-col gap-2.5">
      <div class="flex justify-between font-raj font-bold">
        <span>Bet Amount</span>
        <span v-if="!balanceLoading && !tokenLoading">
          Your Balance
          {{ balanceTokens.toFixed(2) }}
          {{ token?.symbol }}
        </span>
      </div>

      <div class="relative">
        <input
          class="w-full rounded-lg border-2 border-[rgba(83,86,103,0.57)] h-10.5 px-3.5 bg-transparent outline-none"
          type="number"
          inputmode="decimal"
          step="0.00000001"
          min="0"
          :max="balanceTokens || undefined"
          placeholder="0"
          v-model="betInput"
        />

        <div class="absolute inset-y-0 right-0 flex items-center pr-2">
          <button
            type="button"
            class="bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            @click="setHalfBet"
          >
            Half
          </button>
          <button
            type="button"
            class="bg-blue-500 text-white p-1 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 ml-1"
            @click="setMaxBet"
          >
            Max
          </button>
        </div>
      </div>
    </div>

    <!-- DESIRED WIN (PROFIT) -->
    <div class="flex flex-col gap-2.5">
      <div class="flex justify-between font-raj font-bold">
        <span>Desired Win</span>
        <span>Max {{ maxWinTokens }} BONK</span>
      </div>

      <input
        class="w-full rounded-lg border-2 border-[rgba(83,86,103,0.57)] h-10.5 px-3.5 bg-transparent outline-none"
        type="number"
        inputmode="decimal"
        step="0.00000001"
        min="0"
        :max="maxWinTokensNumber || undefined"
        placeholder="0"
        v-model="desiredWinInput"
      />
    </div>

    <!-- INFO BOXES -->
    <div class="flex gap-5">
      <div class="bg-[#2E3239] p-5 flex gap-4 items-center rounded-lg w-full">
        <span class="font-raj font-semibold text-xl">Multiplier</span>
        <span class="text-3xl font-bold">
          {{ payoutMultiplier > 0 ? payoutMultiplier.toFixed(2) + "x" : "-" }}
        </span>
      </div>

      <div class="bg-[#2E3239] p-5 flex justify-between rounded-lg w-full">
        <span class="font-raj font-semibold text-xl">Win Probability</span>
        <span class="text-3xl font-bold">{{ winProbability }}</span>
      </div>

      <div class="bg-[#2E3239] p-5 flex justify-between rounded-lg w-full">
        <span class="font-raj font-semibold text-xl">Potential Profit</span>
        <span class="text-3xl font-bold">{{ potentialProfit }}</span>
      </div>
    </div>

    <button
      type="submit"
      class="w-full relative text-[#0C100F] py-2 font-medium disabled:opacity-50 uppercase cursor-pointer overflow-hidden"
      :disabled="submitting"
    >
      <ClippedCornerSvg
        :width="300"
        :height="40"
        fill-color="#E9E2DF"
        :full-width="true"
        :full-height="true"
        border-radius="8px"
        class="absolute inset-0"
      />
      <span class="relative z-10">{{ submitting ? "Sending Bet…" : "Confirm Bet" }}</span>
    </button>
  </form>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { Connection, PublicKey } from "@solana/web3.js";
import { useWallet } from "solana-wallets-vue";
import type { Pool } from "~/lib/pools";
import { buildTryMineTransaction } from "~/lib/solana/pools";
import { getSolanaConnection } from "~/lib/solana/rpc";
import { useErrorModal } from "~/composables/useErrorModal";

const props = defineProps<{
  pool: Pool;
  mineAddress: string;
}>();

const router = useRouter();

const {
  pool,
  isLoading: poolLoading,
  isError: poolError,
  refetch: refetchPool,
} = usePoolQuery(props.mineAddress);

const tokenMint = computed(() =>
  pool.value?.tokenMint ? pool.value.tokenMint.toString() : null
);

const {
  balance,
  isLoading: balanceLoading,
  isError: balanceError,
  refetch: refetchBalance,
} = getUseTokenBalanceQuery(tokenMint);

const {
  token,
  isLoading: tokenLoading,
  isError: tokenError,
  refetch: refetchToken,
} = useTokenInfoQuery(tokenMint);

const { publicKey, sendTransaction } = useWallet();
const toast = useToast();

const connection = new Connection(
  "https://mainnet.helius-rpc.com/?api-key=c58a71ef-fe93-49e1-b969-dcf66b0d3cd2",
  "confirmed"
);

/**
 * MAX WIN TOKENS (STRING FOR DISPLAY)
 * Used as cap on desired win (profit), NOT on bet.
 */
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

// numeric version for logic
const maxWinTokensNumber = computed(() => Number(maxWinTokens.value) || 0);

/**
 * USER BALANCE IN TOKENS
 */
const balanceTokens = computed(() => {
  if (!balance.value || !token.value) return 0;
  return Number(balance.value) / 10 ** token.value.decimals;
});

/**
 * FORM STATE
 */
const betInput = ref<string>(""); // bet in tokens
const desiredWinInput = ref<string>(""); // desired win (profit) in tokens

/**
 * HELPERS
 */
const parseNum = (value: string): number => {
  if (!value) return 0;
  const n = Number(String(value).replace(",", "."));
  return Number.isFinite(n) ? n : 0;
};

/**
 * MULTIPLIER = (bet + desiredWin) / bet
 * Example: bet = 0.05, desiredWin = 0.05 -> (0.05 + 0.05) / 0.05 = 2x
 */
const payoutMultiplier = computed(() => {
  const bet = parseNum(betInput.value);
  const win = parseNum(desiredWinInput.value);

  if (bet > 0 && win > 0) {
    return (bet + win) / bet;
  }

  return 0;
});

/**
 * STATS BOXES
 */
const potentialProfit = computed(() => {
  const win = parseNum(desiredWinInput.value);
  return win > 0 ? win.toFixed(2) : "0.00";
});

const winProbability = computed(() => {
  const m = payoutMultiplier.value;
  if (!m || m <= 0) return "0%";
  // simple inverse mapping: higher multiplier -> lower probability
  const pct = Math.max(1, Math.min(99, Math.round(100 / m)));
  return `${pct}%`;
});

/**
 * QUICK BUTTONS
 */
const setHalfBet = () => {
  const half = balanceTokens.value / 2;
  betInput.value = half > 0 ? half.toFixed(2) : "";
};

const setMaxBet = () => {
  const max = balanceTokens.value;
  betInput.value = max > 0 ? max.toFixed(2) : "";
};

/**
 * SUBMIT
 */
const submitting = ref(false);

async function onMineSubmit() {
  try {
    if (!publicKey.value) {
      toast.add({
        title: "Wallet not connected",
        description: "Please connect your wallet first.",
        color: "warning",
      });
      return;
    }

    if (!props.pool) {
      toast.add({
        title: "Pool not loaded",
        description: "Please wait for pool data.",
        color: "warning",
      });
      return;
    }

    if (!token.value) {
      toast.add({
        title: "Token not loaded",
        description: "Please wait for token data.",
        color: "warning",
      });
      return;
    }

    const bet = parseNum(betInput.value);
    const desiredWin = parseNum(desiredWinInput.value);

    if (!bet || bet <= 0) {
      toast.add({
        title: "Invalid bet",
        description: "Bet amount must be a positive number.",
        color: "warning",
      });
      return;
    }

    // bet can be any size, but cannot exceed balance
    if (bet > balanceTokens.value) {
      toast.add({
        title: "Insufficient balance",
        description: "You cannot bet more than your balance.",
        color: "warning",
      });
      return;
    }

    if (!desiredWin || desiredWin <= 0) {
      toast.add({
        title: "Invalid win",
        description: "Desired win must be a positive number.",
        color: "warning",
      });
      return;
    }

    // desired win cannot exceed max allowed win
    if (maxWinTokensNumber.value > 0 && desiredWin > maxWinTokensNumber.value) {
      toast.add({
        title: "Win too high",
        description: "Desired win exceeds the maximum allowed win.",
        color: "warning",
      });
      return;
    }

    // multiplier derived from inputs
    const m = payoutMultiplier.value;

    if (!m || m <= 1.0) {
      toast.add({
        title: "Invalid multiplier",
        description:
          "Desired win must be greater than 0 relative to your bet (multiplier > 1x).",
        color: "warning",
      });
      return;
    }

    const tokenMint = props.pool.tokenMint;
    if (!tokenMint) {
      throw new Error("Pool token mint not found");
    }

    submitting.value = true;

    // bet in smallest units (decimals)
    const betInSmallestUnits = BigInt(
      Math.floor(bet * 10 ** token.value.decimals)
    );

    /**
     * payout param: multiplier * 10_000
     * Example: bet = 0.05, desiredWin = 0.05
     *   m = (0.05 + 0.05) / 0.05 = 2
     *   payoutParam = 2 * 10_000 = 20_000 ✅
     */
    const payoutParam = Math.floor(m * 10_000);

    const [transaction, vrfPda] = await buildTryMineTransaction(
      publicKey.value,
      new PublicKey(props.mineAddress),
      new PublicKey(tokenMint),
      betInSmallestUnits,
      payoutParam
    );

    const signature = await sendTransaction(transaction, getSolanaConnection());

    router.push({ query: { modal: "bet", signature, vrf: vrfPda.toString() } });

    toast.add({
      title: "Bet sent 🎲",
      description: `Tx: ${signature.slice(0, 8)}...`,
      color: "success",
    });
  } catch (e: any) {
    console.error(e);
    const { showTransactionError } = useErrorModal();
    showTransactionError(e);
  } finally {
    submitting.value = false;
  }
}
</script>
