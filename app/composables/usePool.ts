import { ref, onMounted } from "vue";
import type { Pool } from "~/lib/pools";
import { fetchPool } from "~/lib/pools";

export function usePool(poolAddress: string) {
  const pool = ref<Pool | null>(null);
  const loading = ref(true);
  const error = ref<Error | null>(null);

  const load = async () => {
    loading.value = true;
    error.value = null;

    try {
      pool.value = await fetchPool(poolAddress);
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  };

  onMounted(load);

  return { pool, loading, error, reload: load };
}
