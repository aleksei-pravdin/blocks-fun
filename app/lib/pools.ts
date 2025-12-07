// ~/lib/solanaPools.ts
import { createSolanaRpc } from "@solana/rpc";
import { type Address, address, getAddressDecoder, getAddressEncoder } from "@solana/addresses";
import { PublicKey } from "@solana/web3.js";

import { getStructDecoder } from "@solana/codecs-data-structures";
import { type FixedSizeDecoder } from "@solana/codecs-core";

import {
  getU8Decoder,
  getU16Decoder,
  getU64Decoder,
} from "@solana/codecs-numbers";

import { getBase64Encoder } from "@solana/codecs-strings";

// ---- constants --------------------------------------------------------------

export const POOL_ACCOUNT_SIZE = 101n;

// Prefer env var in Nuxt: NUXT_PUBLIC_RPC_URL
const RPC_URL =
  process.env.NUXT_PUBLIC_RPC_URL ??
  "https://mainnet.helius-rpc.com/?api-key=c58a71ef-fe93-49e1-b969-dcf66b0d3cd2";

export const PROGRAM_ID = address(
  "BLoCKJ2rUVeGznE1pdvEGHUjQxAgq4nxhm2j4oWh4aL3"
);

// Create a single RPC client reused everywhere
export const rpc = createSolanaRpc(RPC_URL);

// ---- types & decoder --------------------------------------------------------

export interface Pool {
  tokenMint: Address;
  liquidityMint: Address;
  totalLiquiditySupply: bigint;
  totalPoolTokens: bigint;
  lockedLiquidity: bigint;
  platformFee: bigint;
  houseEdge: number; // u16
  maxWinLiqThreshold: number; // u16
  bump: number; // u8
}

export const poolDecoder: FixedSizeDecoder<Pool> = getStructDecoder([
  ["tokenMint", getAddressDecoder()],
  ["liquidityMint", getAddressDecoder()],
  ["totalLiquiditySupply", getU64Decoder()],
  ["totalPoolTokens", getU64Decoder()],
  ["lockedLiquidity", getU64Decoder()],
  ["platformFee", getU64Decoder()],
  ["houseEdge", getU16Decoder()],
  ["maxWinLiqThreshold", getU16Decoder()],
  ["bump", getU8Decoder()],
]);

// ---- UI helpers -------------------------------------------------------------

export const shorten = (val: string | Address) => {
  const s = String(val);
  if (s.length <= 10) return s;
  return `${s.slice(0, 4)}…${s.slice(-4)}`;
};

export const formatBigint = (v: bigint) => v.toString();

// ---- low-level fetch helpers -----------------------------------------------

const base64Encoder = getBase64Encoder();

async function decodeAccounts(accounts: any[]) {
  const decoded: { pubkey: string; pool: Pool }[] = [];

  for (const accountItem of accounts) {
    try {
      // Handle different possible structures
      const pubkey = accountItem.pubkey || accountItem.accountId || accountItem[0];
      const account = accountItem.account || accountItem[1] || accountItem;
      
      if (!account || !account.data) {
        continue;
      }

      const pool = decodePool(account.data);
      if (!pool) {
        continue;
      }

      decoded.push({ pubkey: String(pubkey), pool });
    } catch (e) {
      console.error("Error decoding account:", e);
    }
  }

  return decoded;
}

function decodePool(accountData: [string, string] | any): Pool | null {
  try {
    // Handle different possible structures
    let data: string;
    let encoding: string;
    
    if (Array.isArray(accountData)) {
      [data, encoding] = accountData;
    } else if (accountData && typeof accountData === 'object') {
      // Handle object structure like { data: [...], encoding: "base64" }
      if (Array.isArray(accountData.data)) {
        [data, encoding] = accountData.data;
      } else {
        data = accountData.data;
        encoding = accountData.encoding || "base64";
      }
    } else {
      return null;
    }
    
    if (encoding !== "base64" || !data) {
      return null;
    }
    
    const bytes = base64Encoder.encode(data);
    const pool = poolDecoder.decode(bytes);
    
    return pool;
  } catch (e) {
    console.error("decodePool: error decoding pool:", e);
    return null;
  }
}

export async function fetchPool(poolAddress: string) {
  const account = await rpc
    .getAccountInfo(address(poolAddress), {
      encoding: "base64",
    })
    .send();

  return decodePool(account.value.data);
}

// Fetch all pools (no token filter)
export async function fetchAllPools() {
  const accounts = await rpc
    .getProgramAccounts(PROGRAM_ID, {
      encoding: "base64",
      filters: [{ dataSize: POOL_ACCOUNT_SIZE }],
    })
    .send();

  return decodeAccounts(accounts);
}

// Fetch pools for a specific token mint (filter on tokenMint at offset 0)
export async function fetchPoolsByTokenMint(tokenMint: string) {
  // Always fetch all pools and filter in code, as memcmp filter may not work correctly
  // for all token addresses (especially native SOL)
  const allAccounts = await rpc
    .getProgramAccounts(PROGRAM_ID, {
      encoding: "base64",
      filters: [{ dataSize: POOL_ACCOUNT_SIZE }],
    })
    .send();
  
  const allPools = await decodeAccounts(allAccounts);
  
  // Filter pools by tokenMint
  const filtered = allPools.filter(p => p.pool.tokenMint === tokenMint);
  
  return filtered;
}
