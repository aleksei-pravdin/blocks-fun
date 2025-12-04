<template>
  <div v-if="token" class="max-w-[1380px] w-full mx-auto pt-15">
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

      <button
        @click="openCreateMineModal"
        class="bg-[#535667] text-lg font-bold py-4.5 max-w-[290px] w-full rounded-xl uppercase hover:opacity-90 transition-opacity"
      >
        Create Mine
      </button>
    </div>

    <div class="h-[3px] w-full bg-[#1E1E1E] mt-5 mb-7"></div>

    <div class="grid grid-cols-4 space-x-5 space-y-5">
      <div v-for="pool in decodedPools" class="bg-[#535667] p-5 rounded-lg">
        <div class="flex gap-3">
          <img class="size-10! rounded-full" :src="token?.image" />

          <div class="flex flex-col font-raj gap-2 font-bold">
            <span class="text-2xl">{{ token.symbol }} Mine</span>
            <span
              class="bg-[rgba(153,29,255,0.32)] px-2 py-1 text-sm rounded-[3px]"
              >House Edge {{ (pool.pool.houseEdge / 100).toFixed(2) }}%</span
            >
          </div>
        </div>

        <div class="my-4 bg-[rgba(62,63,71,0.58)] w-full h-px"></div>

        <div class="flex">
          <div class="w-[50%] flex flex-col font-raj">
            <span class="font-semibold text-xl">Liquidity</span>
            <span class="font-bold text-3xl">{{
              (
                Number(pool.pool.totalPoolTokens) /
                10 ** token.decimals
              ).toFixed(2)
            }}</span>
          </div>

          <div class="w-[50%] flex flex-col font-raj">
            <span class="font-semibold text-xl">Max Win</span>
            <span class="font-bold text-3xl"
              >{{ (pool.pool.maxWinLiqThreshold / 100).toFixed(2) }}%</span
            >
          </div>
        </div>

        <div class="my-4 bg-[rgba(62,63,71,0.58)] w-full h-px"></div>

        <NuxtLink
          class="bg-[#E9E2DF] text-[#0C100F] font-bold uppercase font-raj flex gap-2.5 items-center justify-center rounded-lg py-2"
          :to="`/mines/${pool.pubkey}`"
        >
          Enter Mine
          <Pickaxe class="w-[26px]! h-[21px]!" :filled="true" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { Pool } from "~/lib/pools";
import { createSolanaRpc } from "@solana/rpc";
import { h, resolveComponent } from "vue";
import { address, assertIsAddress } from "@solana/addresses";

import Arrow from "~/assets/svg/arrow.svg";
import Pickaxe from "~/assets/svg/pickaxe.svg";

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

const router = useRouter();

function openCreateMineModal() {
  router.push({ query: { ...route.query, modal: "createMine" } });
}
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
