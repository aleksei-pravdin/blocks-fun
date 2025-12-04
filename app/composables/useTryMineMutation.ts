// composables/solana/useSendTransactionMutation.ts
import { useMutation, useQueryClient } from "@tanstack/vue-query";
import { useWallet } from "solana-wallets-vue";
import { solanaKeys } from "~/lib/solana/queryKeys";
import type { Transaction } from "@solana/web3.js";

import { sendTransaction } from "~/lib/solana/rpc";

export function useSendTransactionMutation() {
  const { publicKey, sendTransaction, connected } = useWallet();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tx: Transaction) => {
      if (!connected.value || !publicKey.value) {
        throw new Error("Wallet not connected");
      }

      const signature = await sendTransaction(tx, connection);
      // Optionally wait for confirmation
      await connection.confirmTransaction(signature, "confirmed");
      return signature;
    },
    onSuccess: async (_sig, _tx, _ctx) => {
      const addr = publicKey.value?.toString();
      if (!addr) return;

      // Example: invalidate everything related to this user
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: solanaKeys.balance(addr) }),
        // queryClient.invalidateQueries({
        //   queryKey: solanaKeys.userProfile(addr),
        // }),
        // maybe some program-specific keys too
      ]);
    },
  });
}
