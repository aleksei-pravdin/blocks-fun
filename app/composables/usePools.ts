import { ref, onMounted, watch, type Ref, isRef } from "vue";
import type { Pool } from "~/lib/pools";
import { fetchAllPools, fetchPoolsByTokenMint } from "~/lib/pools";

export function usePools(tokenMint?: string | Ref<string | null | undefined>) {
  const pools = ref<{ pubkey: string; pool: Pool }[]>([]);
  const loading = ref(true);
  const error = ref<Error | null>(null);

  const tokenMintRef = isRef(tokenMint) ? tokenMint : ref(tokenMint);

  const load = async () => {
    loading.value = true;
    error.value = null;

    try {
      const mint = tokenMintRef.value;
      pools.value = mint
        ? await fetchPoolsByTokenMint(mint)
        : await fetchAllPools();
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  };

  onMounted(load);

  // Watch for changes in tokenMint if it's a ref
  watch(tokenMintRef, () => {
    load();
  });

  return { pools, loading, error, reload: load };
}
