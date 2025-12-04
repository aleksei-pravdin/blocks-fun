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
                <div
                  class="bg-[#222328] px-4 pt-5 pb-4 sm:p-6 sm:pb-4"
                  v-if="!txConfirmed || !vrfExists"
                >
                  <div class="flex flex-col items-center">
                    <h3 class="font-raj font-bold text-2xl">
                      {{ txConfirmed ? "VRF Pending" : "Trasaction Pending" }}
                    </h3>
                    <p class="font-raj font-bold pt-4">
                      Waiting for confirmation on Solana..
                    </p>

                    <Loader
                      class="size-20! animate-spin mt-10"
                      :filled="true"
                    />

                    <div class="text-left w-full font-bold">
                      <span>
                        {{ txConfirmed ? "VRF Address" : "Tranasction Hash" }}
                      </span>

                      <div class="flex gap-1">
                        <div
                          class="bg-[rgba(111,112,119,0.25)] rounded-md px-3 py-2 mt-4 w-full"
                        >
                          {{ txConfirmed ? shorten(vrf) : shorten(signature) }}
                        </div>

                        <NuxtLink
                          :to="
                            txConfirmed
                              ? `https://solscan.io/account/${vrf}`
                              : `https://solscan.io/tx/${signature}`
                          "
                          target="_blank"
                          class="bg-[rgba(111,112,119,0.25)] rounded-md px-3 py-2 mt-4 flex items-center justify-center"
                        >
                          <External />
                        </NuxtLink>
                      </div>
                    </div>

                    <p
                      class="text-center text-sm font-raj font-bold text-[#5B5D6A] mt-12"
                    >
                      Do not close this window until the transaction is
                      confirmed.
                    </p>
                  </div>
                </div>

                <div v-else class="bg-[#222328] px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h1>{{ isWin ? "You have won!" : "You have lost!" }}</h1>
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
import Loader from "~/assets/svg/loader.svg";
import External from "~/assets/svg/external.svg";
import { PublicKey } from "@solana/web3.js";
import { getSolanaConnection } from "~/lib/solana/rpc";
import { decodeVrf } from "~/lib/solana/vrf-schema";

const router = useRouter();
const route = useRoute();

const { signature, vrf } = route.query;

const open = computed(() => !!signature && !!vrf);
const connection = getSolanaConnection();

const txConfirmed = ref(false);
const vrfExists = ref(false);
const isWin = ref(false);
const betAmount = ref(0);
const winMultiplier = ref(0);
onMounted(updateBetStatus);

async function updateBetStatus() {
  console.log("==== check");
  if (!txConfirmed.value) {
    const tx = await connection.getSignatureStatus(signature);
    if (tx?.value?.slot) {
      console.log("tx confirmed");
      txConfirmed.value = true;
    } else {
      console.log("tx is not confirmed");
    }
  }

  if (txConfirmed.value) {
    const vrfAccount = await connection.getAccountInfo(new PublicKey(vrf));

    if (vrfAccount.data) {
      const decoded = decodeVrf(vrfAccount.data);
      console.log(decoded);

      if (!decoded.status.Pending) {
        vrfExists.value = true;
        isWin.value = !!decoded.status.Win;
        betAmount.value = Number(decoded.bet_amount.toString());
        winMultiplier.value = decoded.winMultiplier / 10000;
        return;
      }
    }
  }

  await sleep(3000);
  updateBetStatus();
}

const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

function closeModal() {
  const newQuery = { ...route.query };
  delete newQuery["modal"];
  delete newQuery["signature"];
  delete newQuery["vrf"];
  router.push({ query: newQuery });
}
</script>
