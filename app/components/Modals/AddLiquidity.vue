<template>
  <BaseModal :open="open" max-width="660px" @close="closeModal">
    <ModalHeader
      title="Add Liquidity"
      subtitle="Provide liquidity to earn fees from bets."
      @close="closeModal"
    />
    <div class="relative z-10 h-px w-full bg-[rgba(62,63,71,0.58)] mb-5"></div>

    <!-- Warning Banner -->
    <div class="relative z-10 bg-[#FF4B01] rounded-[8px] px-4 py-3 mb-5 flex items-center gap-3">
      <AlertSquareIcon class="w-5 h-5 text-white flex-shrink-0" />
      <span class="text-white font-raj font-semibold text-sm">Adding liquidity involves financial risk.</span>
    </div>

    <form @submit.prevent="addLiquidity" class="relative z-10">
      <div class="space-y-5">
        <!-- Amount Input -->
        <div class="flex flex-col gap-1">
          <div class="flex items-center justify-between">
            <label class="font-raj font-bold text-base text-[#E5E9EC]">
              Amount
            </label>
            <span v-if="!balanceLoading && !tokenLoading" class="text-[#E5E9EC] font-raj font-bold text-base">
              Your Balance {{ Math.round(balanceTokens) }} {{ token?.symbol }}
            </span>
          </div>
          <div class="relative">
            <input
              v-model.number="amount"
              type="number"
              inputmode="decimal"
              step="0.00000001"
              min="0"
              :max="balanceTokens || undefined"
              placeholder="0.00"
              class="w-full rounded-[10px] border-2 border-[rgba(83,86,103,0.57)] h-[42px] px-[14px] text-white font-bold text-base outline-none placeholder:text-[#6B6D7A] placeholder:text-sm bg-[#535667]"
            />
            <div class="absolute inset-y-0 right-0 flex items-center gap-[10px] pr-[14px]">
              <button
                type="button"
                @click="setHalfAmount"
                class="w-[80px] h-6 rounded-[6px] bg-[rgba(83,86,103,0.48)] text-[#9497A4] font-chakra font-bold text-base flex items-center justify-center hover:opacity-90"
              >
                Half
              </button>
              <button
                type="button"
                @click="setMaxAmount"
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

        <!-- Info Section -->
        <div class="bg-[rgba(58,60,70,0.37)] rounded-[6px] p-5 space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-xl font-raj font-semibold text-[#E5E9EC]">Your Share</span>
            <span class="text-2xl font-raj font-bold text-[#E5E9EC]">{{ userShare }}%</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-xl font-raj font-semibold text-[#E5E9EC]">Expected APR</span>
            <span class="text-2xl font-raj font-bold text-[#88FF00]">{{ expectedAPR }}%</span>
          </div>
        </div>
      </div>

      <div class="mt-7 space-y-5">
        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="submitting || !amount || amount <= 0"
          class="relative w-full h-[42px] text-[#0C100F] font-chakra font-bold text-base uppercase disabled:opacity-50 cursor-pointer hover:opacity-90 transition-opacity overflow-hidden"
        >
          <ClippedCornerSvg
            :width="620"
            :height="42"
            fill-color="#E9E2DF"
            :full-width="true"
            :full-height="true"
            border-radius="8px 0 8px 8px"
            class="absolute inset-0"
          />
          <span class="relative z-10 flex items-center justify-center h-full">
            {{ submitting ? "Adding..." : "ADD LIQUIDITY" }}
          </span>
        </button>

        <!-- Cancel Link -->
        <button
          type="button"
          @click="closeModal"
          class="w-full text-center text-base text-[#5B5D6A] font-chakra font-bold uppercase hover:text-[#E5E9EC] transition-colors leading-[1.3]"
        >
          CANCEL THIS PROCESS
        </button>
      </div>
    </form>
  </BaseModal>
</template>

<script setup lang="ts">
import { getSolanaConnection } from "~/lib/solana/rpc";
import { buildAddLiquidityTransaction } from "~/lib/solana/pools";
import { useWallet } from "solana-wallets-vue";
import { PublicKey } from "@solana/web3.js";
import { useErrorModal } from "~/composables/useErrorModal";
import ClippedCornerSvg from "~/components/ClippedCornerSvg.vue";
import AlertSquareIcon from "~/assets/svg/alert-square.svg";
import BaseModal from "~/components/Modals/BaseModal.vue";
import ModalHeader from "~/components/Modals/ModalHeader.vue";
import { usePoolQuery } from "~/composables/usePoolQuery";
import { useTokenInfoQuery } from "~/composables/useTokenInfoQuery";
import { getUseTokenBalanceQuery } from "~/composables/useTokenBalanceQuery";

const router = useRouter();
const route = useRoute();

const { mineAddress } = route.query;

const open = computed(() => !!mineAddress);
const connection = getSolanaConnection();

const {
  pool,
  isLoading: poolLoading,
  isError: poolError,
  refetch: refetchPool,
} = usePoolQuery(mineAddress as string);

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

const amount = ref<number>(0);
const submitting = ref(false);

const { showTransactionError, showWalletError } = useErrorModal();

const balanceTokens = computed(() => {
  if (!balance.value || !token.value) return 0;
  return Number(balance.value) / 10 ** token.value.decimals;
});

// Calculate user share after adding liquidity
const userShare = computed(() => {
  if (!pool.value || !amount.value || amount.value <= 0) return "0.00";
  const currentTotal = Number(pool.value.totalPoolTokens) / 10 ** (token.value?.decimals || 9);
  const newTotal = currentTotal + amount.value;
  const userAmount = amount.value;
  return ((userAmount / newTotal) * 100).toFixed(3);
});

// Mock expected APR (should be calculated based on pool data)
const expectedAPR = computed(() => {
  return "36";
});

function setHalfAmount() {
  if (balanceTokens.value > 0) {
    amount.value = balanceTokens.value / 2;
  }
}

function setMaxAmount() {
  if (balanceTokens.value > 0) {
    amount.value = balanceTokens.value;
  }
}

async function addLiquidity() {
  try {
    if (!publicKey.value) {
      showWalletError(new Error("Wallet not connected"));
      return;
    }

    if (!amount.value || amount.value <= 0) {
      return;
    }

    if (!pool.value || !token.value) {
      return;
    }

    submitting.value = true;

    const transaction = await buildAddLiquidityTransaction(
      publicKey.value,
      new PublicKey(mineAddress as string),
      new PublicKey(tokenMint.value!),
      pool.value.liquidityMint,
      BigInt(Math.floor(amount.value * 10 ** token.value.decimals))
    );

    const signature = await sendTransaction(transaction, getSolanaConnection());

    console.log(signature);
    closeModal();
  } catch (error) {
    console.error(error);
    showTransactionError(error);
  } finally {
    submitting.value = false;
  }
}

function closeModal() {
  const newQuery = { ...route.query };
  delete newQuery["modal"];
  delete newQuery["mineAddress"];
  router.push({ query: newQuery });
}
</script>
