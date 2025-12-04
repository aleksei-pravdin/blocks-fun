import type { PublicKey } from "@solana/web3.js";

import { fetchTokenInfo } from "./rpc";
import type { FullTokenInfo } from "./tokens-schema";

export async function fetchToken(
  tokenAddress: string | PublicKey
): Promise<FullTokenInfo | null> {
  const tokenInfo = await fetchTokenInfo(tokenAddress);

  return tokenInfo
    ? {
        name: tokenInfo.result.content?.metadata?.name ?? "",
        symbol: tokenInfo.result.content?.metadata?.symbol ?? "",
        decimals: tokenInfo.result.token_info?.decimals ?? 0,
        pricePerToken:
          tokenInfo.result.token_info?.price_info?.price_per_token ?? null,
        image: tokenInfo.result.content?.files?.[0]?.cdn_uri ?? null,
      }
    : null;
}
