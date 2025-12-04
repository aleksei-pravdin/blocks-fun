<template>
  <div>
    <TransitionRoot as="template" :show="open">
      <Dialog class="relative z-50" @close="closeModal">
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

        <div class="fixed inset-0 z-50 w-screen overflow-y-auto">
          <div
            class="flex min-h-full items-end justify-center p-4 sm:items-center sm:p-0"
          >
            <TransitionChild
              as="template"
              enter="ease-out duration-300"
              enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enter-to="translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leave-from="translate-y-0 sm:scale-100"
              leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <DialogPanel
                class="relative transform overflow-hidden rounded-lg text-white shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
              >
                <div class="relative bg-[#222328] pt-3 pb-6 sm:px-5 sm:pt-3 sm:pb-8">
                  <!-- Background image -->
                  <ModalHeaderBg
                    class="absolute top-0 left-0 pointer-events-none"
                  />
                  
                  <!-- Header with Close Button -->
                  <div class="relative flex items-start justify-between mb-6">
                    <div class="flex flex-col">
                      <h3 class="font-raj font-bold text-2xl ">
                        Create Mine
                      </h3>
                      <p class="text-sm text-[#E5E9EC] font-raj text-bold leading-[0.5]">
                        Set your mine parameters and launch your pool.
                      </p>
                    </div>
                    <button
                      @click="closeModal"
                      class="text-white hover:text-gray-300 transition-colors"
                    >
                      <svg
                        class="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <form @submit.prevent="onSubmit" class="space-y-6">
                    <!-- Token Search -->
                    <div class="flex flex-col gap-2.5">
                      <label class="font-raj font-bold text-sm text-[#E5E9EC]">
                        Token
                      </label>
                      <div class="relative">
                        <input
                          v-model="state.tokenAddress"
                          type="text"
                          placeholder="Search by token name, symbol or address"
                          class="w-full rounded-lg border-2 border-[rgba(83,86,103,0.57)] h-10.5 px-3.5 pr-10 bg-transparent outline-none text-white placeholder:text-[#535667] font-raj"
                          required
                        />
                        <div class="absolute inset-y-0 right-0 flex items-center pr-3.5">
                          <SearchIcon class="w-5 h-5 text-[#535667]" />
                        </div>
                      </div>
                    </div>

                    <!-- Fee Tier -->
                    <div class="flex flex-col gap-2.5">
                      <label class="font-raj font-bold text-sm text-[#E5E9EC]">
                        FEE Tier
                      </label>
                      <div class="flex gap-2">
                        <button
                          v-for="tier in feeTiers"
                          :key="tier"
                          type="button"
                          @click="state.houseEdge = tier.toString()"
                          :class="[
                            'px-4 py-2 rounded-lg font-raj font-bold text-sm transition-colors',
                            state.houseEdge === tier.toString()
                              ? 'bg-[#FF4B01] text-white'
                              : 'bg-[rgba(83,86,103,0.25)] text-white hover:bg-[rgba(83,86,103,0.4)]',
                          ]"
                        >
                          {{ tier }}%
                        </button>
                      </div>
                    </div>

                    <!-- Max Win -->
                    <div class="flex flex-col gap-2.5">
                      <label class="font-raj font-bold text-sm text-[#E5E9EC]">
                        Max Win
                      </label>
                      <div class="flex items-center gap-2">
                        <input
                          v-model.number="state.maxWinPercent"
                          type="number"
                          step="1"
                          min="0"
                          max="100"
                          class="w-full rounded-lg border-2 border-[rgba(83,86,103,0.57)] h-10.5 px-3.5 bg-transparent outline-none text-white font-raj"
                          required
                        />
                        <span class="text-white font-raj font-bold">%</span>
                      </div>
                      <!-- Slider -->
                      <input
                        v-model.number="state.maxWinPercent"
                        type="range"
                        min="0"
                        max="100"
                        step="1"
                        class="w-full h-2 bg-[#1E1E1E] rounded-lg appearance-none cursor-pointer slider"
                        :style="{
                          background: `linear-gradient(to right, #FF4B01 0%, #FF4B01 ${state.maxWinPercent}%, #1E1E1E ${state.maxWinPercent}%, #1E1E1E 100%)`,
                        }"
                      />
                      <!-- Info Text -->
                      <div class="flex items-start gap-2 mt-1">
                        <svg
                          class="w-4 h-4 text-[#535667] mt-0.5 flex-shrink-0"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                            clip-rule="evenodd"
                          />
                        </svg>
                        <p class="text-xs text-[#535667] font-raj">
                          Percentage of total liquidity that players can win in a single bet.
                        </p>
                      </div>
                    </div>

                    <!-- Summary -->
                    <div class="flex flex-col gap-3 pt-4 border-t border-[rgba(83,86,103,0.3)]">
                      <label class="font-raj font-bold text-sm text-[#E5E9EC]">
                        Summary
                      </label>
                      <div class="space-y-2">
                        <div class="flex items-center justify-between">
                          <span class="text-sm text-[#535667] font-raj">Token</span>
                          <span class="text-sm text-white font-raj">
                            {{ state.tokenAddress || "—" }}
                          </span>
                        </div>
                        <div class="flex items-center justify-between">
                          <span class="text-sm text-[#535667] font-raj">Fee Tier</span>
                          <span class="text-sm text-white font-raj">
                            {{ state.houseEdge ? `${state.houseEdge}%` : "—" }}
                          </span>
                        </div>
                        <div class="flex items-center justify-between">
                          <span class="text-sm text-[#535667] font-raj">Max Win</span>
                          <span class="text-sm text-white font-raj">
                            {{ state.maxWinPercent ? `${state.maxWinPercent}%` : "—" }}
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- Submit Button -->
                    <button
                      type="submit"
                      :disabled="submitting"
                      class="w-full bg-[#2E3239] text-white py-3 font-bold text-base uppercase disabled:opacity-50 cursor-pointer hover:bg-[#3A3F47] transition-colors rounded-lg font-raj"
                    >
                      {{ submitting ? "Creating..." : "CREATE YOUR MINE" }}
                    </button>

                    <!-- Cancel Link -->
                    <button
                      type="button"
                      @click="closeModal"
                      class="w-full text-center text-sm text-[#535667] font-raj hover:text-[#E5E9EC] transition-colors"
                    >
                      CANCEL THIS PROCESS
                    </button>
                  </form>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup lang="ts">
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import { useWallet } from "solana-wallets-vue";
import { PublicKey } from "@solana/web3.js";
import { buildCreatePoolTransaction } from "~/lib/solana/pools";
import { getSolanaConnection } from "~/lib/solana/rpc";
import { useErrorModal } from "~/composables/useErrorModal";
import SearchIcon from "~/assets/svg/search.svg";
import ModalHeaderBg from "~/assets/svg/modal_header_bg.svg";

const router = useRouter();
const route = useRoute();

const open = computed(() => route.query.modal === "createMine");

const feeTiers = [0.5, 1, 2, 3];

const state = reactive({
  tokenAddress: "",
  houseEdge: "2", // Default to 2%
  maxWinPercent: 36,
});

const toast = useToast();
const { publicKey, sendTransaction } = useWallet();
const { showTransactionError, showWalletError } = useErrorModal();
const submitting = ref(false);

async function onSubmit() {
  try {
    if (!publicKey.value) {
      showWalletError(new Error("Wallet not connected"));
      return;
    }

    if (!state.tokenAddress || !state.houseEdge || !state.maxWinPercent) {
      toast.add({
        title: "Validation Error",
        description: "Please fill in all fields.",
        color: "error",
      });
      return;
    }

    const houseEdgePercent = Number(state.houseEdge);
    const maxWinPercent = Number(state.maxWinPercent);

    if (Number.isNaN(houseEdgePercent) || Number.isNaN(maxWinPercent)) {
      toast.add({
        title: "Invalid input",
        description: "All values must be valid numbers.",
        color: "error",
      });
      return;
    }

    submitting.value = true;

    // For now, we'll use 0 as initial amount since it's not in the design
    // This might need to be adjusted based on backend requirements
    const [transaction, poolPda] = await buildCreatePoolTransaction(
      publicKey.value,
      new PublicKey(state.tokenAddress),
      BigInt(0),
      Math.round(houseEdgePercent * 100),
      Math.round(maxWinPercent * 100)
    );

    const signature = await sendTransaction(transaction, getSolanaConnection());

    toast.add({
      title: "Pool created 🎉",
      description: `Tx: ${signature.slice(0, 8)}... · Pool: ${poolPda.toBase58().slice(0, 8)}...`,
      color: "success",
    });

    // Reset form and close modal
    state.tokenAddress = "";
    state.houseEdge = "2";
    state.maxWinPercent = 36;
    closeModal();
  } catch (e: any) {
    console.error(e);
    showTransactionError(e);
  } finally {
    submitting.value = false;
  }
}

function closeModal() {
  const newQuery = { ...route.query };
  delete newQuery["modal"];
  router.push({ query: newQuery });
}
</script>

<style scoped>
.slider::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #FF4B01;
  cursor: pointer;
  border: 2px solid #1E1E1E;
}

.slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #FF4B01;
  cursor: pointer;
  border: 2px solid #1E1E1E;
}
</style>
