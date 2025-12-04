// composables/useWalletErrorHandler.ts
import { useWallet } from "solana-wallets-vue";
import { useErrorModal } from "./useErrorModal";
import { watch, onMounted } from "vue";

/**
 * Composable to handle wallet connection errors
 * Should be used in components that need to track wallet connection state
 */
export function useWalletErrorHandler() {
  const { connected, connecting, wallet, disconnect } = useWallet();
  const { showWalletError } = useErrorModal();

  // Track previous connection state to detect errors
  let wasConnecting = false;
  let wasConnected = false;

  onMounted(() => {
    wasConnecting = connecting.value;
    wasConnected = connected.value;
  });

  // Watch for connection state changes
  watch(
    [() => connecting.value, () => connected.value],
    ([isConnecting, isConnected], [prevConnecting, prevConnected]) => {
      // If we were connecting and now we're not, but wallet is not connected
      // This indicates a connection error
      if (prevConnecting && !isConnecting && !isConnected && wallet.value) {
        // Connection attempt failed
        // Note: This is a heuristic - user might have cancelled
        // We'll show error only if there's an actual error state
        console.warn("Wallet connection may have failed");
      }

      // If wallet was connected and suddenly disconnected (without user action)
      if (prevConnected && !isConnected && wallet.value && !wasConnecting) {
        // This might indicate a disconnection error
        // But we don't show error here as it might be intentional
        console.warn("Wallet disconnected");
      }

      wasConnecting = isConnecting;
      wasConnected = isConnected;
    }
  );

  /**
   * Manually handle wallet connection error
   * Call this when you catch an error during wallet operations
   */
  function handleWalletError(error: unknown) {
    showWalletError(error);
  }

  return {
    handleWalletError,
  };
}

