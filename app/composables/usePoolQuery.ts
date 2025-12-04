// composables/solana/usePoolQuery.ts
import { useQuery } from "@tanstack/vue-query";
import { solanaKeys } from "~/lib/solana/queryKeys";
import { fetchPool } from "~/lib/solana/pools";
import type { Pool } from "~/lib/solana/pools-schema";

export function usePoolQuery(poolAddress: string | Ref<string | null>) {
  const addressRef = isRef(poolAddress) ? poolAddress : ref(poolAddress);

  const enabled = computed(() => !!addressRef.value);

  const queryKey = computed(() =>
    solanaKeys.pool(addressRef.value ?? "no-address")
  );

  const query = useQuery<Pool | null>({
    queryKey,
    enabled,
    queryFn: async () => {
      if (!addressRef.value) {
        throw new Error("No pool address");
      }
      const pool = await fetchPool(addressRef.value);
      return pool;
    },
    staleTime: 15_000,
  });

  return {
    ...query,
    pool: query.data, // alias for convenience
  };
}
