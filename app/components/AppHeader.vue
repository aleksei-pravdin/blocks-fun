<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import { useWallet, WalletMultiButton } from "solana-wallets-vue";
import UserIcon from "~/assets/svg/user.svg";
import ArrowOpenIcon from "~/assets/svg/arrow_open_icon.svg";
import LogoIcon from "~/assets/svg/logo.svg";
import { useErrorModal } from "~/composables/useErrorModal";
import { useWalletErrorHandler } from "~/composables/useWalletErrorHandler";

const route = useRoute();

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: "Leaderboard",
    to: "/leaderboard",
    active: route.path.startsWith("/leaderboard"),
  },
  {
    label: "FAQ",
    to: "/faq",
    active: route.path.startsWith("/faq"),
  },
]);

const { connected, connecting, wallet, disconnect, publicKey } = useWallet();
const { showWalletError } = useErrorModal();
const { handleWalletError } = useWalletErrorHandler();

const { balance, isLoading, isError, error, refetch } = useSolBalanceQuery();

const formattedBalance = computed(() => {
  if (isLoading.value || !connected.value) return "";
  if (isError.value) return "";

  return (((balance.value ?? 0) / 10 ** 9).toFixed(2));
});

const shortAddress = computed(() => {
  if (!publicKey.value) return "";

  const base58 = publicKey.value.toBase58();
  return `${base58.slice(0, 4)}...${base58.slice(-4)}`;
});

const openInExplorer = (base58?: string | null) => {
  if (!base58) return;
  window.open(
    `https://solscan.io/account/${base58}`,
    "_blank",
    "noopener,noreferrer",
  );
};
</script>

<template>
  <div
    class="max-w-[1728px] w-full mx-auto px-6 flex justify-between items-center h-[85px] border-b-[3px] border-[#1E1E1E] relative"
  >
    <!-- Elliptical blur backgrounds over logo -->
    <div class="absolute top-[-34px] left-[30px] pointer-events-none">
      <div class="absolute w-[120px] h-[60px] rounded-full bg-[#FF4B01] opacity-50 blur-[40px] -left-10"></div>
      <div class="absolute w-[80px] h-[40px] rounded-full bg-[#FF4B01] opacity-60 blur-[30px] left-5"></div>
    </div>

    <!-- Logo -->
    <NuxtLink to="/" class="flex items-center gap-[13px] relative z-10">
      <div class="w-[41.02px] h-[41.05px] flex-shrink-0">
        <svg width="100%" height="100%" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0.00713961 32.8928C0.00713961 31.8322 -0.0117142 30.7717 0.0118543 29.7111C0.0707756 27.135 2.06703 25.0893 4.64542 25.0021C6.21509 24.9502 7.7871 25.0021 9.35677 24.9832C12.4348 24.9432 14.4169 22.9587 14.4688 19.883C14.4782 19.2938 14.49 18.7022 14.4452 18.1177C14.2496 15.6642 12.3735 13.8141 9.92241 13.6751C9.0221 13.6232 8.11706 13.6704 7.21439 13.6397C4.44273 13.5407 2.42998 11.4973 2.38285 8.72568C2.35928 7.42941 2.34985 6.13314 2.38285 4.83687C2.45827 2.11235 4.47101 0.0948877 7.18375 0.026539C8.55779 -0.00881374 9.9342 -0.0111673 11.3059 0.0336129C13.8843 0.116103 15.89 2.11707 16.0031 4.70253C16.0455 5.64292 15.9842 6.58801 16.0361 7.5284C16.1728 10.0573 18.169 12.0088 20.7003 12.0936C21.7986 12.129 22.8992 12.0795 23.9975 12.1125C26.7928 12.195 28.789 14.2171 28.8385 16.9959C28.855 17.9763 28.8055 18.9615 28.8432 19.9396C28.9563 22.9752 30.9102 24.9007 33.9364 24.9832C34.6811 25.0021 35.4283 24.9691 36.1754 24.9927C38.841 25.0799 40.8443 27.0148 40.9739 29.6875C41.0399 31.0592 41.0352 32.438 40.9786 33.8096C40.8679 36.553 38.8881 38.5068 36.1447 38.5964C34.8508 38.6388 33.5522 38.6388 32.2583 38.5917C29.3028 38.4833 27.3749 36.4776 27.349 33.5362C27.3419 32.7891 27.3725 32.042 27.3443 31.2972C27.2429 28.6387 25.282 26.6189 22.6282 26.5058C21.6572 26.4657 20.6532 26.4845 19.7081 26.6849C17.6175 27.1303 16.1421 28.9145 16.0479 31.0427C15.9748 32.6901 16.0337 34.3399 16.0102 35.9897C15.9701 38.891 13.9479 40.9556 11.0419 41.0216C9.07866 41.0664 7.1154 41.0546 5.15215 41.0287C2.01989 40.9863 0.021282 38.9547 0.00478405 35.8342C7.03493e-05 34.8514 0.00478405 33.8709 0.00478405 32.8881L0.00713961 32.8928Z" fill="#FF4B01"/>
          <path d="M35.5833 10.9102C32.0338 10.9008 30.1531 8.95641 30.1649 5.31036C30.1743 2.0037 32.2365 0.0710823 35.7341 0.0828665C39.0054 0.0946508 41.0064 2.16161 40.9946 5.51776C40.9852 8.92813 38.9866 10.9197 35.5833 10.9102Z" fill="#FF4B01"/>
        </svg>
      </div>
      <span class="uppercase font-bold text-[35.06px] font-raj leading-[1.276] text-[#E5E9EC]" :style="{ letterSpacing: '-2px' }">BLOCKS.FUN</span>
    </NuxtLink>

    <!-- Navigation Menu -->
    <div class="absolute left-[297px] top-1/2 -translate-y-1/2 flex items-center gap-[50px]">
      <NuxtLink 
        to="/" 
        :class="[
          'uppercase font-semibold text-base leading-[1.3] tracking-[0.1em] transition-colors relative pb-1',
          route.path === '/' ? 'text-white' : 'text-[#535667]'
        ]"
        style="font-family: 'Chakra Petch', sans-serif;"
      >
        HOME
        <span 
          v-if="route.path === '/'"
          class="absolute h-[3px] bg-[#FF4B01]"
          style="bottom: -32px; left: -25%; width: 150%; box-shadow: 0 0 8px rgba(255, 75, 1, 0.6);"
        ></span>
      </NuxtLink>
      <NuxtLink 
        to="/mines" 
        :class="[
          'uppercase font-semibold text-base leading-[1.3] tracking-[0.1em] transition-colors relative pb-1',
          route.path.startsWith('/mines') ? 'text-white' : 'text-[#535667]'
        ]"
        style="font-family: 'Chakra Petch', sans-serif;"
      >
        GAME
        <span 
          v-if="route.path.startsWith('/mines')"
          class="absolute h-[3px] bg-[#FF4B01]"
          style="bottom: -32px; left: -25%; width: 150%; box-shadow: 0 0 8px rgba(255, 75, 1, 0.6);"
        ></span>
      </NuxtLink>
      <NuxtLink 
        to="/stats" 
        :class="[
          'uppercase font-semibold text-base leading-[1.3] tracking-[0.1em] transition-colors relative pb-1',
          route.path.startsWith('/stats') ? 'text-white' : 'text-[#535667]'
        ]"
        style="font-family: 'Chakra Petch', sans-serif;"
      >
        STATS
        <span 
          v-if="route.path.startsWith('/stats')"
          class="absolute h-[3px] bg-[#FF4B01]"
          style="bottom: -32px; left: -25%; width: 150%; box-shadow: 0 0 8px rgba(255, 75, 1, 0.6);"
        ></span>
      </NuxtLink>
      <NuxtLink 
        to="/leaderboard" 
        :class="[
          'uppercase font-semibold text-base leading-[1.3] tracking-[0.1em] transition-colors relative pb-1',
          route.path.startsWith('/leaderboard') ? 'text-white' : 'text-[#535667]'
        ]"
        style="font-family: 'Chakra Petch', sans-serif;"
      >
        LEADERBOARD
        <span 
          v-if="route.path.startsWith('/leaderboard')"
          class="absolute h-[3px] bg-[#FF4B01]"
          style="bottom: -32px; left: -25%; width: 150%; box-shadow: 0 0 8px rgba(255, 75, 1, 0.6);"
        ></span>
      </NuxtLink>
    </div>

    <!-- CTA Button -->
    <ClientOnly>
      <div class="flex items-center gap-3 relative z-10">
        <div v-if="connected" class="flex items-center gap-3">
          <UserIcon class="user-icon" />
          <div class="h-8 w-px bg-[#2D313D]"></div>
        </div>
        <div class="flex items-center gap-3">
          <div v-if="!connected" class="flex flex-col items-end">
            <p class="text-[#535667] text-sm font-bold leading-[1.022] text-right mb-1">
              Start playing the<br />game and
            </p>
          </div>

          <WalletMultiButton :dark="true">
            <!-- Disconnected state -->
            <template #select-wallet-content>
              <button
                class="group relative text-[#0C100F] px-6 py-2 font-bold text-sm leading-[1.3] uppercase cursor-pointer hover:opacity-90 transition-opacity overflow-hidden"
                style="font-family: 'Chakra Petch', sans-serif;"
              >
                <ClippedCornerSvg
                  :width="170"
                  :height="44"
                  fill-color="#D3DBE6"
                  :full-width="true"
                  :full-height="true"
                  border-radius="8px 0 8px 8px"
                  class="absolute inset-0"
                />

                <div class="absolute top-[-63px] left-[48px] pointer-events-none z-0">
                  <div class="absolute w-[120px] h-[60px] rounded-full bg-gray-400 opacity-50 blur-[40px] -left-10"></div>
                  <div class="absolute w-[80px] h-[40px] rounded-full bg-gray-400 opacity-60 blur-[30px] left-5"></div>
                </div>
                <span class="relative z-10">CONNECT WALLET</span>
              </button>
            </template>

            <!-- Connected: button content -->
            <template
              #dropdown-button="{
                wallet,
                publicKeyTrimmed,
                dropdownOpened,
                openDropdown,
              }"
            >
              <button
                type="button"
                @click.stop="openDropdown()"
                class="flex items-center bg-[#151820] rounded-full px-2 py-1 pr-4 gap-2 text-sm font-medium text-white transition-colors"
              >
                <div
                  class="w-9 h-9 rounded-full bg-gradient-to-tr from-[#9945FF] via-[#14F195] to-[#00FFA3] flex items-center justify-center flex-shrink-0 overflow-hidden"
                >
                  <img
                    v-if="wallet?.value?.adapter?.icon"
                    :src="wallet?.value?.adapter?.icon"
                   
                    class="w-9 h-9 object-contain"
                  />
                </div>

                <div class="flex flex-col leading-tight mr-0.5 text-left">
                  <span v-if="isLoading">Loading…</span>
                  <span
                    v-else-if="isError"
                    class="flex items-center gap-2 text-red-400"
                  >
                    Error
                    <button
                      @click.stop="() => refetch()"
                      class="text-[10px] px-2 py-0.5 bg-red-500/20 hover:bg-red-500/30 rounded transition-colors"
                      title="Retry"
                    >
                      Retry
                    </button>
                  </span>
                  <template v-else>
                    <span class="text-base text-white font-semibold">
                      {{ formattedBalance }}
                      <span class="text-[11px] text-[#9CA3AF] font-semibold ml-0.5">
                        SOL
                      </span>
                    </span>
                    <span
                      v-if="publicKeyTrimmed || shortAddress"
                      class="text-[12px] text-[#9CA3AF] font-mono font-semibold tracking-wide mt-0.5"
                    >
                      {{ publicKeyTrimmed || shortAddress }}
                    </span>
                  </template>
                </div>

                <ArrowOpenIcon
                  class="wallet-arrow-icon w-[10px] h-[14px] transition-transform duration-150"
                  :class="{ 'rotate-90': dropdownOpened }"
                />
              </button>
            </template>

            <!-- Connected: dropdown menu -->
            <template
              #dropdown-list="{
                featured,
                container,
                logo,
                dark,
                wallet,
                publicKey,
                publicKeyTrimmed,
                publicKeyBase58,
                canCopy,
                addressCopied,
                dropdownPanel,
                dropdownOpened,
                openDropdown,
                closeDropdown,
                copyAddress,
                disconnect,
                hasLogo,
                modalPanel,
                modalOpened,
                openModal,
                closeModal,
                expandedWallets,
                walletsToDisplay,
                featuredWallets,
                hiddenWallets,
                selectWallet
              }"
            >
              <div
                class="absolute right-0 top-[0%] w-56 bg-[#05070C] border border-[#252936] rounded-xl shadow-lg py-2 z-50 transform transition-all duration-150 origin-top"
                :class="{
                  'opacity-100 scale-y-100 translate-y-0 pointer-events-auto':
                    dropdownOpened,
                  'opacity-0 scale-y-95 -translate-y-1 pointer-events-none':
                    !dropdownOpened
                }"
                :ref="dropdownPanel"
              >
                <div class="px-4 py-2 border-b border-[#252936]">
                  <p class="text-[11px] text-[#9CA3AF] uppercase tracking-[0.12em]">
                    Connected wallet
                  </p>
                  <p v-if="publicKeyTrimmed" class="text-[10px] text-[#6B7280] mt-1 font-mono">
                    {{ publicKeyTrimmed }}
                  </p>
                </div>

                <button
                  v-if="canCopy"
                  type="button"
                  @click.stop="copyAddress()"
                  class="w-full text-left px-4 py-2 text-sm hover:bg-[#111827] transition-colors"
                >
                  <span v-if="!addressCopied">Copy address</span>
                  <span v-else class="text-[#22C55E] font-medium">Copied!</span>
                </button>
                <button
                  type="button"
                  @click.stop="openInExplorer(publicKeyBase58)"
                  class="w-full text-left px-4 py-2 text-sm hover:bg-[#111827] transition-colors"
                >
                  View on Solscan
                </button>
                <button
                  type="button"
                  @click.stop="
                    openModal();
                    closeDropdown();
                  "
                  class="w-full text-left px-4 py-2 text-sm hover:bg-[#111827] transition-colors"
                >
                  Change wallet
                </button>
                <button
                  type="button"
                  @click.stop="
                    disconnect();
                    closeDropdown();
                  "
                  class="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            </template>
          </WalletMultiButton>
        </div>
      </div>
    </ClientOnly>
  </div>
</template>

<style scoped>
.user-icon  {
  width: 32px;
  height: 32px;
}

.wallet-arrow-icon {
  color: #9497A4;
}

.wallet-arrow-icon.nuxt-icon--fill,
.wallet-arrow-icon.nuxt-icon--fill * {
  fill: transparent !important;
}
</style>
