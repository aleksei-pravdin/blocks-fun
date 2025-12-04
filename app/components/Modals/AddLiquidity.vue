<template>
  <div>
    <TransitionRoot as="template" :show="open">
      <Dialog class="relative z-10" @close="closeModal">
        <TransitionChild
          as="template"
          enter="ease-out duration-300"
          enter-from="opacity-0"
          enter-to=""
          leave="ease-in duration-200"
          leave-from=""
          leave-to="opacity-0"
        >
          <div
            class="fixed inset-0 bg-[rgba(12,16,15,0.83)] transition-opacity"
          ></div>
        </TransitionChild>

        <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div
            class="flex min-h-full items-end justify-center p-4 sm:items-center sm:p-0"
          >
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to=" translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from=" translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel
                class="relative transform overflow-hidden rounded-lg text-white shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
              >
                <div class="bg-[#222328] px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div class="flex flex-col">
                    <h3 class="font-raj font-bold text-2xl">Add Liquidity</h3>
                    <span v-if="!balanceLoading && !tokenLoading">
                      Your Balance
                      {{ balanceTokens.toFixed(2) }}
                      {{ token?.symbol }}
                    </span>
                    <input
                      class="w-full rounded-lg border-2 border-[rgba(83,86,103,0.57)] h-10.5 px-3.5 bg-transparent outline-none"
                      type="number"
                      inputmode="decimal"
                      step="0.00000001"
                      min="0"
                      :max="balanceTokens || undefined"
                      placeholder="0"
                      v-model="amount"
                    />

                    <button
                      @click="addLiquidity"
                      type="submit"
                      class="w-full bg-[#E9E2DF] text-[#0C100F] py-2 rounded-lg font-medium disabled:opacity-50 uppercase cursor-pointer"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { getSolanaConnection } from "~/lib/solana/rpc";
import { buildAddLiquidityTransaction } from "~/lib/solana/pools";
import { useWallet } from "solana-wallets-vue";
import { PublicKey } from "@solana/web3.js";
import { useErrorModal } from "~/composables/useErrorModal";

const router = useRouter();
const route = useRoute();

const { mineAddress } = route.query;

const open = computed(() => !!mineAddress);
const connection = getSolanaConnection();

const balanceTokens = computed(() => {
  if (!balance.value || !token.value) return 0;
  return Number(balance.value) / 10 ** token.value.decimals;
});

const {
  pool,
  isLoading: poolLoading,
  isError: poolError,
  refetch: refetchPool,
} = usePoolQuery(mineAddress);

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

const amount = ref(0);

const { showTransactionError } = useErrorModal();

async function addLiquidity() {
  try {
    if (!publicKey.value) {
      const { showWalletError } = useErrorModal();
      showWalletError(new Error("Wallet not connected"));
      return;
    }

    const transaction = await buildAddLiquidityTransaction(
      publicKey.value,
      new PublicKey(mineAddress),
      new PublicKey(tokenMint.value),
      pool.value.liquidityMint,
      BigInt(amount.value * 10 ** token.value.decimals)
    );

    const signature = await sendTransaction(transaction, getSolanaConnection());

    console.log(signature);
    closeModal();
  } catch (error) {
    console.error(error);
    showTransactionError(error);
  }
}

function closeModal() {
  const newQuery = { ...route.query };
  delete newQuery["modal"];
  delete newQuery["mineAddress"];
  router.push({ query: newQuery });
}
</script>
