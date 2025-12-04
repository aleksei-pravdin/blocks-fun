<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "@nuxt/ui";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { useWallet } from "solana-wallets-vue";
// import { createPool } from "~/lib/createPool"; // adjust path as needed
import { buildCreatePoolTransaction } from "~/lib/solana/pools";
import { getSolanaConnection } from "~/lib/solana/rpc";
import { useErrorModal } from "~/composables/useErrorModal";

const state = reactive({
  tokenAddress: undefined as string | undefined,
  initialAmount: undefined as string | undefined,
  houseEdge: undefined as string | undefined, // percent, e.g. "2"
  maxWinPercent: undefined as string | undefined, // percent, e.g. "50"
});

type Schema = typeof state;

function validate(state: Partial<Schema>): FormError[] {
  const errors: FormError[] = [];
  if (!state.tokenAddress)
    errors.push({ name: "tokenAddress", message: "Required" });
  if (!state.houseEdge) errors.push({ name: "houseEdge", message: "Required" });
  if (!state.maxWinPercent)
    errors.push({ name: "maxWinPercent", message: "Required" });
  if (!state.initialAmount)
    errors.push({ name: "initialAmount", message: "Required" });
  return errors;
}

const toast = useToast();
const { publicKey, sendTransaction } = useWallet();
const { showTransactionError, showWalletError } = useErrorModal();

// Devnet to match your Rust client
const connection = new Connection(
  "https://mainnet.helius-rpc.com/?api-key=c58a71ef-fe93-49e1-b969-dcf66b0d3cd2",
  "processed"
);

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    if (!publicKey.value) {
      showWalletError(new Error("Wallet not connected"));
      return;
    }

    const houseEdgePercent = Number(event.data.houseEdge);
    const maxWinPercent = Number(event.data.maxWinPercent);
    const initialAmount = Number(event.data.initialAmount);

    if (Number.isNaN(houseEdgePercent) || Number.isNaN(maxWinPercent)) {
      toast.add({
        title: "Invalid input",
        description: "House edge and max win must be numbers.",
        color: "error",
      });
      return;
    }

    const [transaction, poolPda] = await buildCreatePoolTransaction(
      publicKey.value,
      new PublicKey(event.data.tokenAddress!),
      BigInt(initialAmount),
      Math.round(houseEdgePercent * 100),
      Math.round(maxWinPercent * 100)
    );

    const signature = await sendTransaction(transaction, getSolanaConnection());

    console.log(signature);

    toast.add({
      title: "Pool created 🎉",
      description: `Tx: ${signature.slice(
        0,
        8
      )}... · Pool: ${poolPda.toBase58()}`,
      color: "success",
    });
  } catch (e: any) {
    console.error(e);
    showTransactionError(e);
  }
}
</script>

<template>
  <UContainer>
    <h1 class="mt-10">Create new mine</h1>

    <UForm
      :validate="validate"
      :state="state"
      class="space-y-4 mt-10"
      @submit="onSubmit"
    >
      <UFormField label="Token Address" name="tokenAddress">
        <UInput v-model="state.tokenAddress" class="w-full" />
      </UFormField>

      <UFormField label="House Edge (%)" name="houseEdge">
        <UInput v-model="state.houseEdge" class="w-full" />
      </UFormField>

      <UFormField label="Max Win (%)" name="maxWinPercent">
        <UInput v-model="state.maxWinPercent" class="w-full" />
      </UFormField>

      <UFormField label="Initial Amount" name="initialAmount">
        <UInput v-model="state.initialAmount" class="w-full" />
      </UFormField>

      <UButton type="submit">Create pool</UButton>
    </UForm>
  </UContainer>
</template>
