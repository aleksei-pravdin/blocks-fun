// composables/solana/useSolBalanceQuery.ts
import { useQuery } from "@tanstack/vue-query";
import { useWallet } from "solana-wallets-vue";
import { fetchBalance } from "~/lib/solana/rpc";
import { solanaKeys } from "~/lib/solana/queryKeys";
import { useErrorModal } from "./useErrorModal";
import { watch, ref } from "vue";

// Track if we've already shown error modal to avoid spam
const errorModalShown = ref<Set<string>>(new Set());

export function useSolBalanceQuery() {
  const { publicKey, connected } = useWallet();
  const { showError } = useErrorModal();

  const enabled = computed(() => !!publicKey.value && connected.value);

  const queryKey = computed(() =>
    solanaKeys.balance(publicKey.value?.toString() ?? "no-wallet")
  );

  const query = useQuery({
    queryKey,
    enabled,
    queryFn: async () => {
      if (!publicKey.value) return 0;
      try {
        const lamports = await fetchBalance(publicKey.value.toString());
        // Clear error state on success
        const key = publicKey.value.toString();
        errorModalShown.value.delete(key);
        return lamports;
      } catch (error) {
        // Re-throw to let Vue Query handle it
        throw error;
      }
    },
    staleTime: 30_000,
    retry: 2, // Retry 2 times on error
    retryDelay: 1000, // Wait 1 second between retries
  });

  // Watch for errors and show modal (with debounce to avoid spam)
  watch(
    () => query.isError.value,
    (isError) => {
      if (isError && query.error.value && connected.value && publicKey.value) {
        const key = publicKey.value.toString();
        const errorKey = `${key}-${query.error.value instanceof Error ? query.error.value.message : String(query.error.value)}`;
        
        // Only show modal if we haven't shown it for this specific error
        if (!errorModalShown.value.has(errorKey)) {
          errorModalShown.value.add(errorKey);
          
          // Show modal after a short delay to avoid showing during retries
          setTimeout(() => {
            if (query.isError.value && query.error.value) {
              showError({
                title: "Balance Load Error",
                message: "Failed to load wallet balance. Please check your connection and try again.",
                details: query.error.value instanceof Error ? query.error.value.message : String(query.error.value),
              });
            }
          }, 2000); // Wait 2 seconds to see if retry succeeds
        }
      }
    },
    { immediate: false } // Don't show on initial mount
  );

  return {
    ...query,
    balance: query.data,
  };
}
