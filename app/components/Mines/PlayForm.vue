<template>
  <div class="flex flex-col">
    <!-- Header -->
    <div class="flex items-center justify-between mb-1">
      <h2 class="text-[#E5E9EC] font-raj font-bold text-[22px] uppercase">PLAY</h2>
    </div>
    <div class="h-[3px] w-full bg-[#1E1E1E] mb-4"></div>

    <!-- MAIN FORM -->
    <form class="flex flex-col" @submit.prevent="onMineSubmit">
      <!-- BET AMOUNT -->
      <div class="flex flex-col gap-1">
        <div class="flex justify-between items-center">
          <span class="text-[#E5E9EC] font-raj font-bold text-base">Bet Amount</span>
          <span v-if="!balanceLoading && !tokenLoading" class="text-[#E5E9EC] font-raj font-bold text-base">
            Your Balance {{ Math.round(balanceTokens) }} {{ token?.symbol }}
          </span>
        </div>

        <div class="relative">
          <input
            class="w-full rounded-[10px] border-2 border-[rgba(83,86,103,0.57)] h-[42px] px-[14px] text-[#9497A4] font-bold text-base outline-none placeholder:text-[#6B6D7A] placeholder:text-sm"
            type="number"
            inputmode="decimal"
            step="0.00000001"
            min="0"
            :max="balanceTokens || undefined"
            placeholder="8000"
            v-model="betInput"
          />

          <div class="absolute inset-y-0 right-0 flex items-center gap-[10px] pr-[14px]">
            <button
              type="button"
              @click="setHalfBet"
              class="w-[80px] h-6 rounded-[6px] bg-[rgba(83,86,103,0.48)] text-[#9497A4] font-chakra font-bold text-base flex items-center justify-center hover:opacity-90"
            >
              Half
            </button>
            <button
              type="button"
              @click="setMaxBet"
              class="w-[80px] h-6 rounded-[6px] bg-[#FF4B01] text-[#F9F9FB] font-chakra font-bold text-base flex items-center justify-center hover:opacity-90"
            >
              Max
            </button>
            <img
              v-if="token?.image"
              class="w-6 h-6 rounded-full"
              :src="token.image"
              :alt="token.symbol || 'Token'"
            />
          </div>
        </div>
      </div>

      <!-- DESIRED PAYOUT -->
      <div class="flex flex-col gap-1 mt-10">
        <div class="flex justify-between items-center">
          <span class="text-[#E5E9EC] font-raj font-bold text-base">Desired Payout</span>
          <span class="text-[#E5E9EC] font-raj font-bold text-base">MAX {{ formatMaxWinTokens }} {{ token?.symbol }}</span>
        </div>

        <div class="relative">
          <input
            :class="[
              'w-full rounded-[10px] border-2 h-[42px] px-[14px] font-chakra font-bold text-base outline-none placeholder:text-sm',
              desiredPayoutInputClass
            ]"
            type="number"
            inputmode="decimal"
            step="0.00000001"
            min="0"
            :max="maxWinTokensNumber || undefined"
            placeholder="200,000"
            v-model="desiredWinInput"
          />
          <div class="absolute inset-y-0 right-0 flex items-center pr-[14px]">
            <img
              v-if="token?.image"
              class="w-6 h-6 rounded-full"
              :src="token.image"
              :alt="token.symbol || 'Token'"
            />
          </div>
        </div>
      </div>

      <!-- PAYOUT MULTIPLIER -->
      <div class="flex flex-col mt-3">
        <div class="flex justify-between items-center">
          <span class="text-[#E5E9EC] font-raj font-bold text-base">Payout Multiplier</span>
          <span class="text-[#E5E9EC] font-raj font-bold text-base">
            {{ sliderMultiplier.toFixed(2) }}x
          </span>
        </div>
        <!-- Slider -->
        <div class="relative w-full h-[10px] ">
          <!-- Background track -->
          <div class="absolute top-1/2 left-0 right-0 h-[6px] -translate-y-1/2 bg-[#3A3C46] rounded-[2px]"></div>
          <!-- Filled track -->
          <div
            class="absolute top-1/2 left-0 h-[6px] -translate-y-1/2 bg-[#FF4B01] rounded-[2px]"
            :style="{ width: `${((sliderMultiplier - minMultiplier) / (maxMultiplier - minMultiplier)) * 100}%` }"
          ></div>
          <!-- Slider input -->
          <input
            type="range"
            :min="minMultiplier"
            :max="maxMultiplier"
            :step="0.01"
            v-model.number="sliderMultiplier"
            class="absolute inset-0 w-full h-[10px] appearance-none cursor-pointer slider z-10 bg-transparent"
            @input="updateMultiplierFromSlider"
          />
        </div>
      </div>

      <!-- INFO BOXES -->
      <div class="flex gap-5 mt-12 mb-5">
        <!-- Risk Level -->
        <div class="bg-[#2E3239] rounded-[8px] px-5 py-4 flex items-center gap-[17px] flex-1">
          <div class="flex gap-[17px]">
            <div class="flex items-center gap-[6px]">
              <span class="text-[#E5E9EC] font-raj font-semibold text-xl">Risk Level</span>
              <div class="w-2 h-2 rounded-full bg-[#FFDD00]"></div>
            </div>
            <span class="text-[#FCF5F0] font-bold text-[28px] leading-[0.9] tracking-[-1.9px]">Medium</span>
          </div>
        </div>

        <!-- Win Probability -->
        <div class="bg-[#2E3239] rounded-[8px] px-5 py-4 flex items-center gap-[17px] flex-1">
          <div class="flex  gap-[17px]">
            <div class="flex items-center gap-[6px]">
              <span class="text-[#E5E9EC] font-raj font-semibold text-xl">Win Probability</span>
            </div>
            <span class="text-[#FCF5F0] font-bold text-[28px] leading-[0.9] tracking-[-7%]">{{ winProbability }}</span>
          </div>
        </div>

        <!-- Potential Profit -->
        <div class="bg-[#2E3239] rounded-[8px] px-5 py-4 flex items-center gap-[17px] flex-1">
          <div class="flex  gap-[17px]">
            <div class="flex items-center gap-[6px]">
              <span class="text-[#E5E9EC] font-raj font-semibold text-xl">Potential Profit</span>
              <div class="w-2 h-2 rounded-full bg-[#88FF00]"></div>
            </div>
            <div class="flex items-center gap-[10px]">
              <span class="text-[#FCF5F0]  font-bold text-[28px] leading-[0.9] tracking-[-7%]">{{ potentialProfit }}</span>
              <img
                v-if="token?.image"
                class="w-6 h-6 rounded-full"
                :src="token.image"
                :alt="token.symbol || 'Token'"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        class="w-full relative h-[42px] rounded-md overflow-hidden disabled:opacity-50 cursor-pointer"
        :disabled="submitting"
      >
        <ClippedCornerSvg
          :width="1010"
          :height="42"
          fill-color="#E9E2DF"
          :full-width="true"
          :full-height="true"
          border-radius="0"
          class="absolute inset-0"
        />
        <span class="relative z-10 text-[#0C100F] font-chakra font-bold text-base uppercase">
          {{ submitting ? "Sending Bet…" : "CONFIRM BET" }}
        </span>
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { Connection, PublicKey } from "@solana/web3.js";
import { useWallet } from "solana-wallets-vue";
import type { Pool } from "~/lib/solana/pools-schema";
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

// Format max win tokens with commas
const formatMaxWinTokens = computed(() => {
  const num = Number(maxWinTokens.value) || 0;
  return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
 * SLIDER STATE
 */
const minMultiplier = 1.01;
const maxMultiplier = 10;
const sliderMultiplier = ref(2.86);

function updateMultiplierFromSlider() {
  const bet = parseNum(betInput.value);
  if (bet > 0 && sliderMultiplier.value > 1) {
    // desiredWin = bet * (multiplier - 1)
    const desiredWin = bet * (sliderMultiplier.value - 1);
    desiredWinInput.value = desiredWin.toFixed(2);
  }
}

/**
 * DESIRED PAYOUT INPUT COLOR STATE
 */
const desiredPayoutInputClass = computed(() => {
  const win = parseNum(desiredWinInput.value);
  const bet = parseNum(betInput.value);
  
  // Серый - неактивный (пустой или нет ставки)
  if (!win || !bet || bet <= 0) {
    return 'border-[rgba(83,86,103,0.57)] text-[#9497A4] placeholder:text-[#6B6D7A]';
  }
  
  // Красный - ошибка (превышен максимум)
  if (maxWinTokensNumber.value > 0 && win > maxWinTokensNumber.value) {
    return 'border-[#FF0101] text-[#FF0101] placeholder:text-[#6B6D7A]';
  }
  
  // Зеленый - валидное значение
  return 'border-[#88FF00] text-[#88FF00] placeholder:text-[#6B8A5A]';
});

// Watch for bet/desiredWin changes to update slider
watch([() => betInput.value, () => desiredWinInput.value], () => {
  const bet = parseNum(betInput.value);
  const win = parseNum(desiredWinInput.value);
  if (bet > 0 && win > 0) {
    const multiplier = (bet + win) / bet;
    if (multiplier >= minMultiplier && multiplier <= maxMultiplier) {
      sliderMultiplier.value = multiplier;
    }
  } else if (bet > 0 && win === 0) {
    // Reset slider to default when win is cleared
    sliderMultiplier.value = 2.86;
  }
});

/**
 * STATS BOXES
 */
const potentialProfit = computed(() => {
  const win = parseNum(desiredWinInput.value);
  if (win > 0) {
    return formatNumber(Math.round(win).toString());
  }
  return "0";
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

    const tokenMint = props.pool.tokenMint.toString();
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

<style scoped>
.slider::-webkit-slider-thumb {
  appearance: none;
  width: 13px;
  height: 10px;
  background: #FF4B01;
  border-radius: 2px;
  cursor: pointer;
  margin-top: -2px;
}

.slider::-moz-range-thumb {
  width: 13px;
  height: 10px;
  background: #FF4B01;
  border-radius: 2px;
  border: none;
  cursor: pointer;
  position: relative;
  z-index: 1;
}

.slider::-webkit-slider-runnable-track {
  height: 6px;
  background: transparent;
  border-radius: 2px;
  margin-top: 2px;
  margin-bottom: 2px;
}

.slider::-moz-range-track {
  height: 6px;
  background: #3A3C46;
  border-radius: 2px;
}

.slider::-moz-range-progress {
  height: 6px;
  background: #FF4B01;
  border-radius: 2px;
}
</style>
