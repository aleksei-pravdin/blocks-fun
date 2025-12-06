<template>
  <div class="max-w-[1380px] w-full mx-auto pt-15">
    <!-- Loading state for token -->
    <Transition name="fade" mode="out-in">
      <div v-if="tokenLoading" key="loading">
        <TokenHeaderSkeleton />
        <div class="h-[3px] w-full bg-[#1E1E1E] mt-5 mb-7"></div>
        <div class="grid grid-cols-4 space-x-5 space-y-5">
          <MineCardSkeleton v-for="i in 4" :key="`token-skeleton-${i}`" />
        </div>
      </div>

      <!-- Error state for token -->
      <div v-else-if="tokenError" key="error" class="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <p class="text-red-400 font-raj font-semibold text-lg">Failed to load token information</p>
        <button
          @click="() => refetchToken()"
          class="bg-[#535667] text-white px-6 py-2 rounded-lg font-bold uppercase hover:opacity-90 transition-opacity"
        >
          Retry
        </button>
      </div>

      <!-- Main content -->
      <div v-else-if="token" key="content">
      <div class="flex justify-between items-center">
        <div class="flex gap-7">
          <img class="size-24 rounded-full" :src="token?.image" />

          <div class="flex flex-col">
            <div class="flex gap-1.5 uppercase font-raj text-xl font-semibold">
              <Arrow :filled="true" />
              Mines
            </div>

            <span class="font-black text-5xl">{{ token.symbol }}</span>
          </div>
        </div>

        <CreateMineButton variant="clipped" />
      </div>

      <div class="h-[3px] w-full bg-[#1E1E1E] mt-5 mb-7"></div>

      <!-- Search and Sort -->
      <SearchSortSkeleton v-if="loading" />
      <div v-else class="flex items-center gap-4 mb-7">
        <!-- Search Input -->
        <div class="w-[50%] relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by token name, symbol or address"
            class="w-full rounded-lg border-2 border-[rgba(83,86,103,0.57)] h-10.5 px-3.5 pr-10 bg-transparent outline-none text-white placeholder:text-[#9497A4] placeholder:font-bold font-raj"
          />
          <div class="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none">
            <SearchIcon class="icon-no-fill w-6! h-6! text-[#9497A4]" />
          </div>
        </div>

        <!-- Sort Buttons -->
        <div class="flex gap-2 flex-1 justify-end">
          <button
            v-for="sortOption in sortOptions"
            :key="sortOption.key"
            @click="setSortBy(sortOption.key)"
            :class="[
              'w-[140px] pl-3 pr-3 py-1.5 rounded-xl font-raj font-bold text-lg transition-colors flex items-center gap-2',
              sortBy === sortOption.key
                ? 'bg-[#FF4B01] text-white'
                : 'bg-[rgba(83,86,103,0.5)] text-[#9497A4] hover:bg-[rgba(83,86,103,0.4)]',
            ]"
          >
            <SortingIcon
              :class="[
                '!w-7 !h-7',
                sortBy === sortOption.key ? 'text-white' : 'text-[#535667]',
              ]"
            />
            <span>{{ sortOption.label }}</span>
          </button>
        </div>
      </div>

      <!-- Loading state for pools -->
      <Transition name="fade" mode="out-in">
        <div v-if="loading" key="pools-loading" class="grid grid-cols-4 space-x-5 space-y-5">
          <MineCardSkeleton v-for="i in 4" :key="`skeleton-${i}`" />
        </div>

        <!-- Pools grid -->
        <div v-else-if="filteredAndSortedPools && filteredAndSortedPools.length > 0" key="pools-content" class="grid grid-cols-4 space-x-5 space-y-5">
          <MineCard
            v-for="pool in filteredAndSortedPools"
            :key="pool.pubkey"
            :pool="pool"
            :token="token"
          />
        </div>

        <!-- No pools found -->
        <div v-else key="no-pools" class="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p class="text-white font-raj font-semibold text-lg">No mines found</p>
          <p class="text-[#787B7C] text-sm">Create your first mine to get started</p>
        </div>
      </Transition>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { Pool } from "~/lib/pools";
import { createSolanaRpc } from "@solana/rpc";
import { h, resolveComponent } from "vue";
import { address, assertIsAddress } from "@solana/addresses";

import Arrow from "~/assets/svg/arrow.svg";
import SearchIcon from "~/assets/svg/search.svg";
import SortingIcon from "~/assets/svg/sorting_icon.svg";
import MineCard from "~/components/Mines/MineCard.vue";
import MineCardSkeleton from "~/components/Mines/MineCardSkeleton.vue";
import TokenHeaderSkeleton from "~/components/Mines/TokenHeaderSkeleton.vue";
import SearchSortSkeleton from "~/components/Mines/SearchSortSkeleton.vue";
import CreateMineButton from "~/components/Mines/CreateMineButton.vue";

const route = useRoute();
const { tokenAddress } = route.params;

const {
  token,
  isLoading: tokenLoading,
  isError: tokenError,
  refetch: refetchToken,
} = useTokenInfoQuery(tokenAddress);

// const ULink = resolveComponent("ULink");

// const rpc = createSolanaRpc(
//   "https://mainnet.helius-rpc.com/?api-key=c58a71ef-fe93-49e1-b969-dcf66b0d3cd2"
// );

// const decimals = ref(0);
// onMounted(async () => {
//   try {
//     if (!tokenAddress || typeof tokenAddress !== "string") {
//       throw new Error("address is invalid");
//     }
//     assertIsAddress(tokenAddress);

//     const response = await rpc
//       .getAccountInfo(address(tokenAddress), {
//         encoding: "jsonParsed",
//       })
//       .send();

//     if (!response?.value?.data?.parsed?.info?.decimals) {
//       throw new Error("rpc error");
//     }
//     if (response.value.data.program !== "spl-token") {
//       throw new Error("not an spl token");
//     }

//     decimals.value = response.value.data.parsed.info.decimals;
//   } catch (error) {
//     console.log(error);
//   }
// });

// const { data } = await useAsyncData("item", () =>
//   $fetch(
//     "https://mainnet.helius-rpc.com/?api-key=c58a71ef-fe93-49e1-b969-dcf66b0d3cd2",
//     {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         jsonrpc: "2.0",
//         id: "1",
//         method: "getAsset",
//         params: { id: tokenAddress },
//       }),
//     }
//   )
// );
const { pools: decodedPools, loading } = usePools(tokenAddress as string);

// Search and Sort
const searchQuery = ref("");
const sortBy = ref<"liquidity" | "volume" | "apr" | null>(null);
const sortOrder = ref<"asc" | "desc">("desc");

const sortOptions = [
  { key: "liquidity" as const, label: "Liquidity" },
  { key: "volume" as const, label: "Volume" },
  { key: "apr" as const, label: "APR" },
];

function setSortBy(key: "liquidity" | "volume" | "apr") {
  if (sortBy.value === key) {
    // Если кнопка уже активна, отключаем её
    sortBy.value = null;
    sortOrder.value = "desc";
  } else {
    sortBy.value = key;
    sortOrder.value = "desc";
  }
}

const filteredAndSortedPools = computed(() => {
  if (!decodedPools.value) return [];

  let filtered = decodedPools.value;

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim();
    filtered = filtered.filter((pool) => {
      const poolAddress = pool.pubkey.toLowerCase();
      return poolAddress.includes(query);
    });
  }

  // Sort
  let sorted = [...filtered];
  
  if (sortBy.value) {
    sorted = sorted.sort((a, b) => {
      let aValue = 0;
      let bValue = 0;

      if (sortBy.value === "liquidity") {
        aValue = Number(a.pool.totalPoolTokens) / 10 ** token.value!.decimals;
        bValue = Number(b.pool.totalPoolTokens) / 10 ** token.value!.decimals;
      } else if (sortBy.value === "volume") {
        // Mock volume data - replace with actual volume when available
        aValue = 36200;
        bValue = 36200;
      } else if (sortBy.value === "apr") {
        // Mock APR data - replace with actual APR when available
        aValue = 80.2;
        bValue = 80.2;
      }

      return sortOrder.value === "asc" ? aValue - bValue : bValue - aValue;
    });
  }

  return sorted;
});

// interface TablePool extends Pool {
//   pubkey: string;
// }
// const tablePools = computed(() =>
//   decodedPools.value.map((pool) => {
//     console.log(pool);
//     return {
//       pubkey: pool.pubkey,
//       ...pool.pool,
//     };
//   })
// );

// const columns: TableColumn<TablePool>[] = [
//   {
//     accessorKey: "pubkey",
//     header: "Pool",
//     cell: ({ row }) => {
//       return h(ULink, { to: `/mines/${row.getValue("pubkey")}` }, () =>
//         shorten(row.getValue("pubkey"))
//       );
//     },
//   },
//   {
//     accessorKey: "totalPoolTokens",
//     header: "Tokens",
//     cell: ({ row }) => row.getValue("totalPoolTokens"),
//   },
//   {
//     accessorKey: "houseEdge",
//     header: "House Edge",
//     cell: ({ row }) =>
//       (Number(row.getValue("houseEdge")) / 100).toFixed(2) + "%",
//   },
//   {
//     accessorKey: "maxWinLiqThreshold",
//     header: "Max Win",
//     cell: ({ row }) =>
//       (Number(row.getValue("maxWinLiqThreshold")) / 100).toFixed(2) + "%",
//   },
// ];
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
