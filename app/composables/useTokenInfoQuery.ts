// composables/solana/useTokenInfoQuery.ts
import { useQuery } from "@tanstack/vue-query";
import { solanaKeys } from "~/lib/solana/queryKeys";
import { fetchToken } from "~/lib/solana/tokens";
import type { FullTokenInfo } from "~/lib/solana/tokens-schema";

export function useTokenInfoQuery(
  tokenMint: Ref<string | null> | string | null
) {
  const mintRef = isRef(tokenMint) ? tokenMint : ref(tokenMint);

  const enabled = computed(() => !!mintRef.value);

  const queryKey = computed(() =>
    solanaKeys.tokenInfo(mintRef.value ?? "no-mint")
  );

  const query = useQuery<FullTokenInfo | null>({
    queryKey,
    enabled,
    queryFn: async () => {
      if (!mintRef.value) throw new Error("No token mint");
      return await fetchToken(mintRef.value);
    },
    staleTime: Infinity, // token metadata doesn’t change often
  });

  return {
    ...query,
    token: query.data, // alias
  };
}
