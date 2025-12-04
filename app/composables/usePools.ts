import { ref, onMounted } from "vue";
import type { Pool } from "~/lib/pools";
import { fetchAllPools, fetchPoolsByTokenMint } from "~/lib/pools";

export function usePools(tokenMint?: string) {
  const pools = ref<{ pubkey: string; pool: Pool }[]>([]);
  const loading = ref(true);
  const error = ref<Error | null>(null);

  const load = async () => {
    loading.value = true;
    error.value = null;

    try {
      pools.value = tokenMint
        ? await fetchPoolsByTokenMint(tokenMint)
        : await fetchAllPools();
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  };

  onMounted(load);

  return { pools, loading, error, reload: load };
}
