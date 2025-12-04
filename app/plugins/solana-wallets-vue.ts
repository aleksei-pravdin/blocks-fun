import "solana-wallets-vue/styles.css";
import SolanaWallets from "solana-wallets-vue";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";

const walletOptions = {
  wallets: [
    new PhantomWalletAdapter({ network: WalletAdapterNetwork.Mainnet }),
    new SolflareWalletAdapter({ network: WalletAdapterNetwork.Mainnet }),
  ],
  autoConnect: true, 
  onError: (error: Error) => {
    // This will be called for wallet adapter errors
    console.error("Wallet adapter error:", error);
    
    // We can't directly show modal here as we're in plugin context
    // The error will be handled by components using useWallet
  },
};

export default defineNuxtPlugin((nuxtApp) => {
  console.log("loaded");
  nuxtApp.vueApp.use(SolanaWallets, walletOptions);
  
  // Set up global error handler for wallet connection
  if (process.client) {
    // Listen for wallet errors that might not be caught by adapter
    window.addEventListener("unhandledrejection", (event) => {
      const error = event.reason;
      if (error && typeof error === "object") {
        const errorMessage = error.message || String(error);
        // Check if it's a wallet-related error
        if (
          errorMessage.includes("wallet") ||
          errorMessage.includes("connect") ||
          errorMessage.includes("User rejected") ||
          errorMessage.includes("User cancelled")
        ) {
          // Don't prevent default, just log
          console.error("Unhandled wallet error:", error);
        }
      }
    });
  }
});
