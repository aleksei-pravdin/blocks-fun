import { useQuery } from "@tanstack/vue-query";
import { useWallet } from "solana-wallets-vue";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import { solanaKeys } from "~/lib/solana/queryKeys";
import { fetchTokenBalance } from "~/lib/solana/rpc";

export function getUseTokenBalanceQuery(
  tokenMint: Ref<string | null> | string | null
) {
  const mintRef = isRef(tokenMint) ? tokenMint : ref(tokenMint);
  const { publicKey, connected } = useWallet();

  const enabled = computed(
    () => !!mintRef.value && !!publicKey.value && connected.value
  );

  const queryKey = computed(() =>
    solanaKeys.tokenBalance(mintRef.value ?? "no-mint")
  );

  const ata = computed(() =>
    getAssociatedTokenAddressSync(
      new PublicKey(mintRef.value!),
      publicKey.value!
    )
  );

  const query = useQuery<bigint | null>({
    queryKey,
    enabled,
    queryFn: async () => {
      if (!mintRef.value) return 0n;
      if (!publicKey.value) return 0n;
      return await fetchTokenBalance(ata.value);
    },
    staleTime: 60_000, // token metadata doesn’t change often
  });

  return {
    ...query,
    balance: query.data, // alias
  };
}
