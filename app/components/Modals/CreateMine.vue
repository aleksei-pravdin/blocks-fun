<template>
  <BaseModal :open="open" max-width="660px" @close="closeModal">
    <ModalHeader
      title="Create Mine"
      subtitle="Set your mine parameters and launch your pool."
      @close="closeModal"
    />
    <div class="relative z-10 h-px w-full bg-[rgba(62,63,71,0.58)] mb-11"></div>


    <form @submit.prevent="onSubmit" class="relative z-10">
      <div class="space-y-5">
        <!-- Token Select -->
        <div class="flex flex-col gap-1">
          <label class="font-raj font-bold text-base text-[#E5E9EC]">
            Token
          </label>
          <Listbox v-model="state.tokenAddress" as="div" class="relative">
            <ListboxButton
              :class="[
                'w-full rounded-[10px] border-2 border-[rgba(83,86,103,0.57)] h-[42px] px-3.5 flex items-center gap-2.5 cursor-pointer',
                selectedToken ? 'bg-[#3A3C46] pr-3.5' : 'bg-[#535667] pr-3.5',
              ]"
            >
              <img
                v-if="selectedToken"
                :src="selectedToken.image"
                :alt="selectedToken.symbol"
                class="w-[30px] h-[30px] rounded-full flex-shrink-0"
              />
              <span
                v-if="selectedToken"
                class="text-[#9497A4] font-chakra font-bold text-base flex-1 text-left"
              >
                {{ selectedToken.symbol }}
              </span>
              <span v-else class="text-[#9497A4] font-chakra font-bold text-base flex-1 text-left">
                Search by token name, symbol or address
              </span>
              <button
                v-if="selectedToken"
                type="button"
                @click.stop="state.tokenAddress = ''"
                class="text-[#9497A4] hover:text-white transition-colors flex-shrink-0"
              >
                <svg
                  class="w-4 h-4"
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
              <svg
                v-else
                class="w-[10px] h-[10px] text-[#9497A4] flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </ListboxButton>
            <Transition
              enter-active-class="transition duration-100 ease-out"
              enter-from-class="transform scale-95 opacity-0"
              enter-to-class="transform scale-100 opacity-100"
              leave-active-class="transition duration-75 ease-in"
              leave-from-class="transform scale-100 opacity-100"
              leave-to-class="transform scale-95 opacity-0"
            >
              <ListboxOptions
                class="absolute z-10 mt-1 w-full max-h-60 overflow-auto rounded-lg border-2 border-[rgba(83,86,103,0.57)] bg-[#222328] py-1 shadow-lg"
              >
                <ListboxOption
                  v-for="token in availableTokens"
                  :key="token.address"
                  :value="token.address"
                  v-slot="{ active, selected }"
                  as="template"
                >
                  <li
                    :class="[
                      active ? 'bg-[rgba(83,86,103,0.4)]' : '',
                      'relative cursor-pointer select-none py-2 px-3.5 flex items-center gap-2.5',
                    ]"
                  >
                    <img
                      :src="token.image"
                      :alt="token.symbol"
                      class="w-[30px] h-[30px] rounded-full flex-shrink-0"
                    />
                    <span
                      :class="[
                        selected ? 'font-bold' : 'font-normal',
                        'text-white font-chakra font-bold text-base',
                      ]"
                    >
                      {{ token.symbol }}
                    </span>
                  </li>
                </ListboxOption>
              </ListboxOptions>
            </Transition>
          </Listbox>
        </div>

        <!-- Fee Tier -->
        <div class="flex flex-col gap-1">
          <label class="font-raj font-bold text-base text-[#E5E9EC]">
            FEE Tier
          </label>
          <div class="flex gap-2.5">
            <button
              v-for="tier in feeTiers"
              :key="tier"
              type="button"
              @click="state.houseEdge = tier.toString()"
              :class="[
                'flex-1 h-[42px] px-3.5 rounded-[10px] font-chakra font-bold text-base transition-colors',
                state.houseEdge === tier.toString()
                  ? 'bg-[#FF4B01] text-[#F7F8FF]'
                  : 'bg-[rgba(83,86,103,0.48)] text-[#9497A4] hover:bg-[rgba(83,86,103,0.6)]',
              ]"
            >
              {{ tier }}%
            </button>
          </div>
        </div>

        <!-- Max Win -->
        <div class="flex flex-col gap-1">
          <label class="font-raj font-bold text-base text-[#E5E9EC]">
            Max Win
          </label>
          <div class="flex items-center gap-2.5">
            <input
              v-model.number="state.maxWinPercent"
              type="number"
              step="1"
              min="0"
              max="100"
              class="w-full rounded-[10px] border-2 border-[rgba(83,86,103,0.57)] h-[42px] px-3.5 bg-[#535667] outline-none text-[#9497A4] font-chakra font-bold text-base"
              required
            />
            <span class="text-[#9497A4] font-chakra font-bold text-base">%</span>
          </div>
          <!-- Slider -->
          <input
            v-model.number="state.maxWinPercent"
            type="range"
            min="0"
            max="100"
            step="1"
            class="w-full mt-5 h-[6px] bg-[#3A3C46] rounded-[2px] appearance-none cursor-pointer slider"
            :style="{
              background: `linear-gradient(to right, #FF4B01 0%, #FF4B01 ${state.maxWinPercent}%, #3A3C46 ${state.maxWinPercent}%, #3A3C46 100%)`,
            }"
          />
          <!-- Info Text -->
          <div class="flex items-start gap-1 mt-4">
            <AlertSquareIcon class="w-[18px!] h-[18px!] text-[#4B5154] mt-0.5 flex-shrink-0 " />
            <p class="text-md text-[#4B5154] font-raj font-semibold leading-[1.33]">
              Percentage of total liquidity that players can win in a single bet.
            </p>
          </div>
        </div>

        <!-- Initial Liquidity -->
        <div class="flex flex-col gap-1">
          <div class="flex items-center justify-between">
            <label class="font-raj font-bold text-base text-[#E5E9EC]">
              Amount
            </label>
            <span v-if="selectedToken && !balanceLoading" class="text-[#E5E9EC] font-raj font-bold text-base">
              Your Balance {{ Math.round(balanceTokens) }} {{ selectedToken.symbol }}
            </span>
          </div>
          <div class="relative">
            <input
              v-model.number="state.initialLiquidity"
              type="number"
              inputmode="decimal"
              step="0.00000001"
              min="0"
              :max="balanceTokens || undefined"
              placeholder="0.00"
              class="w-full rounded-[10px] border-2 border-[rgba(83,86,103,0.57)] h-[42px] px-[14px] text-white font-bold text-base outline-none placeholder:text-[#6B6D7A] placeholder:text-sm bg-transparent"
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
                v-if="selectedToken?.image"
                class="w-6 h-6 rounded-full"
                :src="selectedToken.image"
                :alt="selectedToken.symbol || 'Token'"
              />
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div class="flex flex-col gap-2 pt-1 border-t border-[rgba(58,60,70,0.37)]">
          <label class="font-raj font-bold text-base text-[#E5E9EC]">
            Summery
          </label>
          <div class="bg-[rgba(58,60,70,0.37)] rounded-[6px] p-5 space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-xl font-raj font-semibold text-[#E5E9EC] w-[71px]">Token</span>
              <div v-if="selectedToken" class="flex items-center gap-2.5">
                <img
                  :src="selectedToken.image"
                  :alt="selectedToken.symbol"
                  class="w-[30px] h-[30px] rounded-full"
                />
                <span class="text-2xl font-raj font-bold text-[#E5E9EC]">{{ selectedToken.symbol }}</span>
              </div>
              <span v-else class="text-2xl font-raj font-bold text-[#E5E9EC]">—</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-xl font-raj font-semibold text-[#E5E9EC] w-[71px]">Fee Tier</span>
              <span class="text-2xl font-raj font-bold text-[#E5E9EC]">
                {{ state.houseEdge ? `${state.houseEdge}%` : "—" }}
              </span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-xl font-raj font-semibold text-[#E5E9EC] w-[71px]">Max Win</span>
              <span class="text-2xl font-raj font-bold text-[#E5E9EC]">
                {{ state.maxWinPercent ? `${state.maxWinPercent}%` : "—" }}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-7 space-y-5">
        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="submitting"
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
            {{ submitting ? "Creating..." : "CREATE YOUR MINE" }}
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
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/vue";
import { useWallet } from "solana-wallets-vue";
import { PublicKey } from "@solana/web3.js";
import { buildCreatePoolTransaction } from "~/lib/solana/pools";
import { getSolanaConnection } from "~/lib/solana/rpc";
import { useErrorModal } from "~/composables/useErrorModal";
import ClippedCornerSvg from "~/components/ClippedCornerSvg.vue";
import AlertSquareIcon from "~/assets/svg/alert-square.svg";
import BaseModal from "~/components/Modals/BaseModal.vue";
import ModalHeader from "~/components/Modals/ModalHeader.vue";
import { getUseTokenBalanceQuery } from "~/composables/useTokenBalanceQuery";
import { useTokenInfoQuery } from "~/composables/useTokenInfoQuery";

const router = useRouter();
const route = useRoute();

const open = computed(() => route.query.modal === "createMine");

const feeTiers = [0.5, 1, 2, 3];

// Available tokens list (same as on /mines page)
const availableTokens = [
  {
    symbol: "SOL",
    players: 1800,
    mines: 680,
    image:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png",
    address: "So11111111111111111111111111111111111111112",
  },
  {
    symbol: "USDC",
    players: 960,
    mines: 420,
    image:
      "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png",
    address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
  },
];

// Get token address from URL if on /mines/token/[tokenAddress] page
const getTokenAddressFromUrl = () => {
  const path = route.path;
  const tokenMatch = path.match(/\/mines\/token\/([^/]+)/);
  if (tokenMatch && tokenMatch[1]) {
    return tokenMatch[1];
  }
  return "";
};

const state = reactive({
  tokenAddress: getTokenAddressFromUrl(),
  houseEdge: "2", // Default to 2%
  maxWinPercent: 36,
  initialLiquidity: 0,
});

// Watch for route changes to update token address
watch(
  () => route.path,
  () => {
    const urlTokenAddress = getTokenAddressFromUrl();
    if (urlTokenAddress && availableTokens.some((t) => t.address === urlTokenAddress)) {
      state.tokenAddress = urlTokenAddress;
    }
  }
);

// Computed property to get selected token
const selectedToken = computed(() => {
  return availableTokens.find((t) => t.address === state.tokenAddress);
});

// Get token info and balance
const tokenMint = computed(() => state.tokenAddress || null);

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

const balanceTokens = computed(() => {
  if (!balance.value || !token.value) return 0;
  return Number(balance.value) / 10 ** token.value.decimals;
});

function setHalfAmount() {
  if (balanceTokens.value > 0) {
    state.initialLiquidity = balanceTokens.value / 2;
  }
}

function setMaxAmount() {
  if (balanceTokens.value > 0) {
    state.initialLiquidity = balanceTokens.value;
  }
}

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

    if (!token.value) {
      toast.add({
        title: "Validation Error",
        description: "Token information not loaded.",
        color: "error",
      });
      return;
    }

    const initialAmount = state.initialLiquidity || 0;
    const initialAmountBigInt = BigInt(Math.floor(initialAmount * 10 ** token.value.decimals));

    const [transaction, poolPda] = await buildCreatePoolTransaction(
      publicKey.value,
      new PublicKey(state.tokenAddress),
      initialAmountBigInt,
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
    state.initialLiquidity = 0;
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
