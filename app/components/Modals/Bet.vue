<template>
  <BaseModal :open="open" max-width="660px" @close="closeModal" >
    <!-- Transaction Pending State -->
    <div v-if="!txConfirmed">
      <div class="flex items-center justify-between mb-5 mt-2">
        <div class="flex-1"></div>
        <div class="flex flex-col gap-0.5 items-center">
          <h3 class="font-raj font-bold text-[22px] text-[#E5E9EC]">
            Transaction Pending
          </h3>
          <p class="text-base text-[#E5E9EC] font-raj font-semibold leading-[0.6] mt-1">
            Waiting for confirmation on Solana..
          </p>
        </div>
        <div class="flex-1 flex justify-end">
          <button
            @click="closeModal"
            class="text-white hover:text-gray-300 transition-colors"
          >
            <CancelIcon class="w-[23px]! h-[23px]!" />
          </button>
        </div>
      </div>

      <div class="relative z-10 space-y-5">
        <div class="flex flex-col items-center">
          <Loader
            class="size-20! animate-spin mb-5 mt-5"
            :filled="true"
          />

          <div class="w-full space-y-4 pl-10 pr-3 mt-10">
            <div class="flex flex-col gap-1">
              <label class="font-raj font-bold text-xl text-[#E5E9EC]">
                Transaction Hash
              </label>
              <div class="flex gap-3">
                <a
                  :href="getTransactionUrl(signature as string)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="bg-[rgba(58,60,70,0.37)] rounded-xl px-4 py-3 flex-1 font-chakra font-bold text-base text-[#E5E9EC] hover:opacity-80 transition-opacity cursor-pointer"
                >
                  {{ shorten(signature as string) }}
                </a>
                <button
                  type="button"
                  @click="refetchStatus"
                  class="bg-[rgba(58,60,70,0.37)] rounded-xl px-3 py-3 flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                  <svg class="w-5 h-5 text-[#E5E9EC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <button
                  type="button"
                  @click="copyToClipboard(signature as string)"
                  class="bg-[rgba(58,60,70,0.37)] rounded-xl px-3 py-3 flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                  <svg class="w-5 h-5 text-[#E5E9EC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <p class="text-center text-[15px] font-raj font-semibold text-[#5B5D6A] mt-12">
            Do not close this window until the transaction is confirmed.
          </p>
        </div>
      </div>
    </div>

    <!-- VRF Pending / Bet Confirmed State -->
    <div v-else-if="!vrfExists">
      <div class="flex items-center justify-between mb-5 mt-2">
        <div class="flex-1"></div>
        <div class="flex flex-col gap-0.5 items-center">
          <h3 class="font-raj font-bold text-[22px] text-[#E5E9EC]">
            Bet Confirmed
          </h3>
          <p class="text-base text-[#E5E9EC] font-raj font-semibold leading-[0.6] mt-1">
            Processing your result... this may take up to 30 seconds.
          </p>
        </div>
        <div class="flex-1 flex justify-end">
          <button
            @click="closeModal"
            class="text-white hover:text-gray-300 transition-colors"
          >
            <CancelIcon class="w-[23px]! h-[23px]!" />
          </button>
        </div>
      </div>

      <div class="relative z-10 space-y-5">
        <div class="flex flex-col items-center">
          <Loader
            class="size-20! animate-spin mb-5 mt-5"
            :filled="true"
          />

          <div class="w-full space-y-4 pl-10 pr-3 mt-10">
            <div class="flex flex-col gap-1">
              <label class="font-raj font-bold text-xl text-[#E5E9EC]">
                Transaction Hash
              </label>
              <div class="flex gap-3">
                <a
                  :href="getTransactionUrl(signature as string)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="bg-[rgba(58,60,70,0.37)] rounded-xl px-4 py-3 flex-1 font-chakra font-bold text-base text-[#E5E9EC] hover:opacity-80 transition-opacity cursor-pointer"
                >
                  {{ shorten(signature as string) }}
                </a>
                <button
                  type="button"
                  @click="refetchStatus"
                  class="bg-[rgba(58,60,70,0.37)] rounded-xl px-3 py-3 flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                  <svg class="w-5 h-5 text-[#E5E9EC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </button>
                <button
                  type="button"
                  @click="copyToClipboard(signature as string)"
                  class="bg-[rgba(58,60,70,0.37)] rounded-xl px-3 py-3 flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                  <svg class="w-5 h-5 text-[#E5E9EC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <p class="text-center text-[15px] font-raj font-semibold text-[#5B5D6A] mt-12">
            We will show if you won or lost as soon as the result is ready.
          </p>
        </div>
      </div>
    </div>

    <!-- Result State -->
    <div v-else class="min-h-[400px]">
      <div class="flex items-start justify-between mb-3">
        <div class="flex items-center gap-3 pt-8 relative">
          <!-- Glow effect -->
          <div
            v-show="showContent"
            class="absolute left-[-100px] -top-0 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-30 blur-3xl pointer-events-none transition-opacity duration-500"
            :style="{
              background: isWin ? 
              'radial-gradient(circle, #991DFF 0%, transparent 70%)' :
              'radial-gradient(circle, #FF4B01 0%, transparent 70%)'  
            }"
          ></div>
          <BetStatusIcon :status="isWin ? 'success' : 'failure'" />
          <div 
            class="flex flex-col gap-0.5 transition-all duration-500 ease-out"
            :class="showContent ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4 pointer-events-none'"
          >
            <h3 class="font-raj font-bold text-[22px] uppercase text-[#E5E9EC]">
              {{ isWin ? "You have won!" : "You have lost!" }}
            </h3>
          <p class="text-base text-[#E5E9EC] font-raj font-semibold leading-[0.6]">
            {{ isWin ? "Congratulations on your win!" : "Better luck next time!" }}
          </p>
          </div>
        </div>
        <button
          @click="closeModal"
          class="mt-3 text-white hover:text-gray-300 transition-colors"
        >
          <CancelIcon class="w-[23px]! h-[23px]!" />
        </button>
      </div>
  

      <div 
        class="relative z-10 space-y-5 py-5 mt-2 transition-all duration-500 ease-out delay-150"
        :class="showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'"
      >
        <div class="bg-[rgba(58,60,70,0.37)] rounded-xl px-5 py-2 space-y-5">
          <div class="flex items-center justify-between">
            <span class="text-xl font-raj font-semibold text-[#E5E9EC]">Bet Amount</span>
            <div class="flex items-center gap-2">
              <span class="text-2xl font-raj font-bold text-[#E5E9EC]">{{ formatNumber(betAmount) }}</span>
              <img
                v-if="token?.image"
                class="w-6 h-6 rounded-full"
                :src="token.image"
                :alt="token.symbol || 'Token'"
              />
            </div>
          </div>
          <div v-if="isWin" class="flex items-center justify-between">
            <span class="text-xl font-raj font-semibold text-[#E5E9EC]">Multiplier</span>
            <span class="text-2xl font-raj font-bold text-[#88FF00]">{{ winMultiplier.toFixed(2) }}x</span>
          </div>
          <div v-if="isWin" class="flex items-center justify-between">
            <span class="text-xl font-raj font-semibold text-[#E5E9EC]">Win Amount</span>
            <div class="flex items-center gap-2">
              <span class="text-2xl font-raj font-bold text-[#88FF00]">{{ formatNumber(betAmount * winMultiplier) }}</span>
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

      <div 
        class="mt-10 space-y-5 transition-all duration-500 ease-out delay-200"
        :class="showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'"
      >
        <button
          type="button"
          @click="closeModal"
          class="relative w-full h-[42px] text-[#0C100F] font-chakra font-bold text-base uppercase cursor-pointer hover:opacity-90 transition-opacity overflow-hidden"
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
            PLAY AGAIN
          </span>
        </button>
      </div>
    </div>
  </BaseModal>
</template>

<script setup lang="ts">
import Loader from "~/assets/svg/loader.svg";
import CancelIcon from "~/assets/svg/cancel.svg";
import { PublicKey } from "@solana/web3.js";
import { getSolanaConnection } from "~/lib/solana/rpc";
import { decodeVrf } from "~/lib/solana/vrf-schema";
import BaseModal from "~/components/Modals/BaseModal.vue";
import ClippedCornerSvg from "~/components/ClippedCornerSvg.vue";
import BetStatusIcon from "~/components/BetStatusIcon.vue";
import { shorten } from "~/lib/pools";
import { usePoolQuery } from "~/composables/usePoolQuery";
import { useTokenInfoQuery } from "~/composables/useTokenInfoQuery";

const router = useRouter();
const route = useRoute();

const { signature, vrf, mineAddress } = route.query;

const open = computed(() => !!signature && !!vrf);
const connection = getSolanaConnection();

// Get token info if mineAddress is available
const mineAddressRef = computed(() => (mineAddress as string) || null);
const {
  pool,
} = usePoolQuery(mineAddressRef);

const tokenMint = computed(() =>
  pool.value?.tokenMint ? pool.value.tokenMint.toString() : null
);

const {
  token,
} = useTokenInfoQuery(tokenMint);

// Reactive refs
const txConfirmedRef = ref(false);
const vrfExistsRef = ref(false);
const isWinRef = ref(false);
const betAmountRef = ref(0);
const winMultiplierRef = ref(0);
const showContent = ref(false);
const pendingCheckCount = ref(0);

// Computed values
const txConfirmed = computed(() => txConfirmedRef.value);
const vrfExists = computed(() => vrfExistsRef.value);
const isWin = computed(() => isWinRef.value);
const betAmount = computed(() => betAmountRef.value);
const winMultiplier = computed(() => winMultiplierRef.value);

let pollingInterval: ReturnType<typeof setInterval> | null = null;
let contentTimer: ReturnType<typeof setTimeout> | null = null;

// Reset state when signature or vrf changes
watch([() => signature, () => vrf], () => {
  if (!process.client) return;
  
  // Clear existing timers
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
  if (contentTimer) {
    clearTimeout(contentTimer);
    contentTimer = null;
  }
  
  // Reset state
  txConfirmedRef.value = false;
  vrfExistsRef.value = false;
  isWinRef.value = false;
  betAmountRef.value = 0;
  winMultiplierRef.value = 0;
  showContent.value = false;
  pendingCheckCount.value = 0;
  
  // Start polling if modal is open
  if (open.value) {
    startPolling();
  }
}, { immediate: true });

// Start/stop polling based on modal open state
watch(open, (isOpen) => {
  if (!process.client) return;
  
  if (isOpen) {
    startPolling();
  } else {
    stopPolling();
  }
});

// Show content after icon animation completes (1500ms delay for status to show in icon)
watch(vrfExists, () => {
  if (!process.client) return;
  
  if (vrfExists.value && !showContent.value && !contentTimer) {
    // Wait for icon animation to complete (1500ms = 100ms delay + 600ms appear + 800ms pause)
    contentTimer = setTimeout(() => {
      showContent.value = true;
      contentTimer = null;
    }, 1500);
  }
}, { immediate: true });

function startPolling() {
  if (!process.client) return;
  
  // Clear any existing interval
  if (pollingInterval) {
    clearInterval(pollingInterval);
  }
  
  // Initial check
  updateBetStatus();
  
  // Poll every 3 seconds
  pollingInterval = setInterval(() => {
    if (open.value && !vrfExistsRef.value) {
      updateBetStatus();
    } else {
      stopPolling();
    }
  }, 3000);
}

function stopPolling() {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
}

async function updateBetStatus() {
  // Don't poll if modal is closed or result already exists
  if (!open.value || vrfExistsRef.value) {
    stopPolling();
    return;
  }

  if (!process.client) return;

  try {
    // Step 1: Check if transaction is confirmed
    if (!txConfirmedRef.value) {
      const tx = await connection.getSignatureStatus(signature as string);
      if (tx?.value?.slot) {
        txConfirmedRef.value = true;
      } else {
        // Transaction not confirmed yet, continue polling
        return;
      }
    }

    // Step 2: Check VRF account status (only if tx is confirmed)
    if (txConfirmedRef.value && !vrfExistsRef.value) {
      const vrfAccount = await connection.getAccountInfo(new PublicKey(vrf as string));

      if (!vrfAccount) {
        // VRF account doesn't exist yet, continue polling
        return;
      }

      if (vrfAccount.data) {
        try {
          const decoded = decodeVrf(vrfAccount.data);
          
          // Check status by looking at which key exists in the status object
          const statusKeys = Object.keys(decoded.status);
          const isPending = statusKeys.includes('Pending');
          const isWin = statusKeys.includes('Win');
          const isLoose = statusKeys.includes('Loose');
          
          // Log full status object for debugging (only first time and every 20th check)
          if (pendingCheckCount.value === 0 || pendingCheckCount.value % 20 === 0) {
            console.log("[Bet] VRF decoded status:", {
              statusKeys,
              isPending,
              isWin,
              isLoose,
              betAmount: decoded.bet_amount?.toString(),
              winMultiplier: decoded.win_multiplier || decoded.winMultiplier,
              fullDecoded: decoded,
            });
          }
          
          // Check if status is still Pending
          if (isPending) {
            // Still pending, continue polling
            pendingCheckCount.value++;
            // Log only every 10th check to avoid spam
            if (pendingCheckCount.value % 10 === 0) {
              console.log(`[Bet] VRF still Pending (checked ${pendingCheckCount.value} times)`);
            }
            return;
          }

          // Status is no longer Pending, we have a result!
          console.log("[Bet] VRF result received:", {
            statusKeys,
            isWin,
            isLoose,
            betAmount: decoded.bet_amount?.toString(),
            winMultiplier: decoded.win_multiplier || decoded.winMultiplier,
          });
          vrfExistsRef.value = true;
          isWinRef.value = isWin;
          betAmountRef.value = Number(decoded.bet_amount.toString());
          // Try both possible field names for winMultiplier
          const multiplier = decoded.win_multiplier || decoded.winMultiplier;
          if (multiplier !== undefined) {
            winMultiplierRef.value = Number(multiplier) / 10000;
          } else {
            console.warn("[Bet] winMultiplier not found in decoded data");
            winMultiplierRef.value = 0;
          }
          stopPolling(); // Stop polling once we have the result
          return;
        } catch (decodeError) {
          console.error("[Bet] Error decoding VRF data:", decodeError);
          // Continue polling even if decode fails
          return;
        }
      }
    }
  } catch (error) {
    console.error("[Bet] Error updating bet status:", error);
    // Continue polling even on error
  }
}

onMounted(() => {
  if (open.value) {
    startPolling();
  }
});

onUnmounted(() => {
  stopPolling();
  if (contentTimer) {
    clearTimeout(contentTimer);
  }
});

function refetchStatus() {
  updateBetStatus();
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    // Можно добавить toast уведомление
  } catch (err) {
    console.error("Failed to copy:", err);
  }
}

const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

function formatNumber(value: number): string {
  if (value === 0) return "0";
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 9,
  });
}

function getTransactionUrl(signature: string): string {
  // Use solscan.io like in other parts of the app
  return `https://solscan.io/tx/${signature}`;
}

function closeModal() {
  const newQuery = { ...route.query };
  delete newQuery["modal"];
  delete newQuery["signature"];
  delete newQuery["vrf"];
  router.push({ query: newQuery });
}
</script>
