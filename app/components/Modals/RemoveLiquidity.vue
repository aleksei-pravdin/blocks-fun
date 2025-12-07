<template>
  <BaseModal :open="open" max-width="660px" @close="closeModal">
    <ModalHeader
      title="Remove Liquidity"
      subtitle="Select how much liquidity to withdraw"
      @close="closeModal"
    />
    <div class="relative z-10 h-px w-full bg-[rgba(62,63,71,0.58)] mb-5"></div>

    <form @submit.prevent="removeLiquidity" class="relative z-10">
      <div class="space-y-5">
        <!-- Percentage to Remove -->
        <div class="flex flex-col gap-1">
          <div class="flex items-center justify-between mb-2">
            <label class="font-raj font-bold text-base text-[#E5E9EC]">
              Percentage to Remove
            </label>
            <span class="text-[#E5E9EC] font-raj font-bold text-base">{{ percentageToRemove }}%</span>
          </div>
          <!-- Slider -->
          <div class="relative w-full">
            <input
              v-model.number="percentageToRemove"
              type="range"
              min="0"
              max="100"
              step="1"
              class="w-full h-[6px] bg-[#3A3C46] rounded-[2px] appearance-none cursor-pointer slider"
              :style="{
                background: `linear-gradient(to right, #FF4B01 0%, #FF4B01 ${percentageToRemove}%, #3A3C46 ${percentageToRemove}%, #3A3C46 100%)`,
              }"
            />
            <!-- Percentage markers -->
            <div class="flex justify-between mt-2">
              <span class="text-[#9497A4] font-chakra font-bold text-xs">0%</span>
              <span class="text-[#9497A4] font-chakra font-bold text-xs">25%</span>
              <span class="text-[#9497A4] font-chakra font-bold text-xs">50%</span>
              <span class="text-[#9497A4] font-chakra font-bold text-xs">75%</span>
              <span class="text-[#9497A4] font-chakra font-bold text-xs">100%</span>
            </div>
          </div>
        </div>

        <!-- Info Section -->
        <div class="bg-[rgba(58,60,70,0.37)] rounded-[6px] p-5 space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-xl font-raj font-semibold text-[#E5E9EC]">Amount to Remove</span>
            <div class="flex items-center gap-2">
              <span class="text-2xl font-raj font-bold text-[#E5E9EC]">{{ amountToRemove }}</span>
              <img
                v-if="token?.image"
                class="w-6 h-6 rounded-full"
                :src="token.image"
                :alt="token.symbol || 'Token'"
              />
            </div>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-xl font-raj font-semibold text-[#E5E9EC]">Remaining Liquidity</span>
            <div class="flex items-center gap-2">
              <span class="text-2xl font-raj font-bold text-[#E5E9EC]">{{ remainingLiquidity }}</span>
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

      <div class="mt-7 space-y-5">
        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="submitting || percentageToRemove <= 0"
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
            {{ submitting ? "Removing..." : "REMOVE LIQUIDITY" }}
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
import { buildRemoveLiquidityTransaction } from "~/lib/solana/pools";
import { useWallet } from "solana-wallets-vue";
import { PublicKey } from "@solana/web3.js";
import { useErrorModal } from "~/composables/useErrorModal";
import ClippedCornerSvg from "~/components/ClippedCornerSvg.vue";
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

const liquidityMint = computed(() =>
  pool.value?.liquidityMint ? pool.value.liquidityMint.toString() : null
);

// Get liquidity token balance (LP tokens)
const {
  balance: liquidityBalance,
  isLoading: liquidityBalanceLoading,
  isError: liquidityBalanceError,
  refetch: refetchLiquidityBalance,
} = getUseTokenBalanceQuery(liquidityMint);

const {
  token,
  isLoading: tokenLoading,
  isError: tokenError,
  refetch: refetchToken,
} = useTokenInfoQuery(tokenMint);

const { publicKey, sendTransaction } = useWallet();

const percentageToRemove = ref<number>(50);
const submitting = ref(false);

const { showTransactionError, showWalletError } = useErrorModal();

// LP tokens typically have 9 decimals
const liquidityBalanceTokens = computed(() => {
  if (!liquidityBalance.value) return 0;
  return Number(liquidityBalance.value) / 10 ** 9;
});

// Calculate amount to remove based on percentage
const amountToRemove = computed(() => {
  if (!liquidityBalanceTokens.value) return "0";
  const amount = (liquidityBalanceTokens.value * percentageToRemove.value) / 100;
  return Math.round(amount).toString();
});

// Calculate remaining liquidity
const remainingLiquidity = computed(() => {
  if (!liquidityBalanceTokens.value) return "0";
  const remaining = liquidityBalanceTokens.value - (liquidityBalanceTokens.value * percentageToRemove.value) / 100;
  return Math.round(remaining).toString();
});

// Get actual amount in LP tokens for transaction
const amountInLPTokens = computed(() => {
  if (!liquidityBalance.value) return 0;
  return (Number(liquidityBalance.value) * percentageToRemove.value) / 100;
});

async function removeLiquidity() {
  try {
    if (!publicKey.value) {
      showWalletError(new Error("Wallet not connected"));
      return;
    }

    if (!percentageToRemove.value || percentageToRemove.value <= 0) {
      return;
    }

    if (!pool.value || !token.value || !liquidityBalance.value) {
      return;
    }

    submitting.value = true;

    // Amount is in LP tokens (liquidity tokens), typically 9 decimals
    const transaction = await buildRemoveLiquidityTransaction(
      publicKey.value,
      new PublicKey(mineAddress as string),
      new PublicKey(tokenMint.value!),
      pool.value.liquidityMint,
      BigInt(Math.floor(amountInLPTokens.value))
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

<style scoped>
.slider::-webkit-slider-thumb {
  appearance: none;
  width: 13px;
  height: 10px;
  border-radius: 2px;
  background: #FF4B01;
  cursor: pointer;
  border: none;
}

.slider::-moz-range-thumb {
  width: 13px;
  height: 10px;
  border-radius: 2px;
  background: #FF4B01;
  cursor: pointer;
  border: none;
}
</style>

