// composables/useErrorModal.ts
import { useRouter } from "vue-router";

export interface ErrorModalOptions {
  title?: string;
  message: string;
  details?: string;
}

export function useErrorModal() {
  const router = useRouter();

  function showError(options: ErrorModalOptions) {
    const query: Record<string, string> = {
      modal: "error",
      errorMessage: encodeURIComponent(options.message),
    };

    if (options.title) {
      query.errorTitle = encodeURIComponent(options.title);
    }

    if (options.details) {
      query.errorDetails = encodeURIComponent(options.details);
    }

    router.push({ query });
  }

  function showWalletError(error: unknown) {
    let title = "Wallet Connection Error";
    let message = "Failed to connect wallet. Please try again.";
    let details: string | undefined;

    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();

      if (errorMessage.includes("user rejected") || errorMessage.includes("user cancelled")) {
        title = "Connection Cancelled";
        message = "Wallet connection was cancelled. Please try again if you want to connect.";
      } else if (errorMessage.includes("not found") || errorMessage.includes("no provider")) {
        title = "Wallet Not Found";
        message = "Please install a Solana wallet extension (Phantom or Solflare) to continue.";
      } else if (errorMessage.includes("network") || errorMessage.includes("rpc")) {
        title = "Network Error";
        message = "Unable to connect to Solana network. Please check your internet connection.";
        details = error.message;
      } else {
        message = error.message;
        details = error.stack;
      }
    } else if (typeof error === "string") {
      message = error;
    }

    showError({ title, message, details });
  }

  function showTransactionError(error: unknown) {
    let title = "Transaction Failed";
    let message = "Your transaction could not be completed. Please try again.";
    let details: string | undefined;

    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();

      if (errorMessage.includes("user rejected") || errorMessage.includes("user cancelled")) {
        title = "Transaction Cancelled";
        message = "Transaction was cancelled. No funds were deducted.";
      } else if (errorMessage.includes("insufficient funds") || errorMessage.includes("insufficient balance")) {
        title = "Insufficient Funds";
        message = "You don't have enough SOL to complete this transaction.";
      } else if (errorMessage.includes("network") || errorMessage.includes("timeout")) {
        title = "Network Error";
        message = "Transaction timed out. Please check your connection and try again.";
        details = error.message;
      } else {
        message = error.message;
        details = error.stack;
      }
    } else if (typeof error === "string") {
      message = error;
    }

    showError({ title, message, details });
  }

  return {
    showError,
    showWalletError,
    showTransactionError,
  };
}

