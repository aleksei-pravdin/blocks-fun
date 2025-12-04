// ~/lib/solanaPools.ts
import { createSolanaRpc } from "@solana/rpc";
import { type Address, address, getAddressDecoder } from "@solana/addresses";

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

  for (const { pubkey, account } of accounts) {
    const pool = decodePool(account.data);
    if (!pool) continue;

    decoded.push({ pubkey, pool });
  }

  return decoded;
}

function decodePool(accountData: [string, string]): Pool | null {
  const [data, encoding] = accountData;
  if (encoding !== "base64") {
    return null;
  }
  const bytes = base64Encoder.encode(data);
  const pool = poolDecoder.decode(bytes);

  return pool;
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
  const accounts = await rpc
    .getProgramAccounts(PROGRAM_ID, {
      encoding: "base64",
      filters: [
        { dataSize: POOL_ACCOUNT_SIZE },
        {
          memcmp: {
            offset: 0n, // tokenMint field
            bytes: tokenMint,
          },
        },
      ],
    })
    .send();

  return decodeAccounts(accounts);
}
