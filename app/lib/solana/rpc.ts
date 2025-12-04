// lib/solana/rpc.ts
import {
  Connection,
  PublicKey,
  type Commitment,
  type GetProgramAccountsFilter,
} from "@solana/web3.js";
import convertPubkey from "~/utils/convertPubkey";
import type { HeliusGetAssetResponse } from "./tokens-schema";

let _connection: Connection | null = null;

export function getSolanaConnection() {
  if (_connection) return _connection;

  const config = useRuntimeConfig();
  // Use environment variable or fallback to default Helius RPC
  const url =
    config.public.rpcUrl ||
    "https://mainnet.helius-rpc.com/?api-key=c58a71ef-fe93-49e1-b969-dcf66b0d3cd2";
  
  if (!url || (!url.startsWith("http://") && !url.startsWith("https://"))) {
    throw new Error(
      `Invalid RPC URL: ${url}. URL must start with http:// or https://`
    );
  }

  _connection = new Connection(url, {
    commitment: (config.public.commitment as Commitment) || "confirmed",
  });

  return _connection;
}

export async function getLatestBlockhash() {
  const connection = getSolanaConnection();

  const { blockhash } = await connection.getLatestBlockhash();

  return blockhash;
}

export async function sendTransaction(): Promise<string> {
  const connection = getSolanaConnection();

  // const signature = await connection.sendTransaction();

  return "signature";
}

export async function fetchTokenBalance(
  pubkey: string | PublicKey
): Promise<bigint | null> {
  const connection = getSolanaConnection();

  const balance = await connection.getTokenAccountBalance(
    convertPubkey(pubkey)
  );

  return BigInt(balance.value.amount);
}

export async function fetchTokenInfo(
  pubkey: string | PublicKey
): Promise<HeliusGetAssetResponse | null> {
  const connection = getSolanaConnection();

  const data = await $fetch<HeliusGetAssetResponse>(connection.rpcEndpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: {
      jsonrpc: "2.0",
      id: "1",
      method: "getAsset",
      params: { id: pubkey.toString() },
    },
  });

  return data?.result ? data : null;
}

// Helper functions (thin wrappers around RPC)
export async function fetchBalance(
  pubkey: string | PublicKey
): Promise<number> {
  try {
    const connection = getSolanaConnection();
    const balance = await connection.getBalance(convertPubkey(pubkey));
    return balance;
  } catch (error) {
    // Re-throw with more context
    if (error instanceof Error) {
      throw new Error(`Failed to fetch balance: ${error.message}`);
    }
    throw new Error(`Failed to fetch balance: ${String(error)}`);
  }
}

export async function fetchAccountData(
  pubkey: string | PublicKey
): Promise<Buffer | undefined> {
  const connection = getSolanaConnection();

  const accountInfo = await connection.getAccountInfo(convertPubkey(pubkey));

  return accountInfo?.data;
}

export async function fetchProgramAccounts(
  programId: string | PublicKey,
  filters?: GetProgramAccountsFilter[]
) {
  const connection = getSolanaConnection();

  const programAccounts = await connection.getProgramAccounts(
    convertPubkey(programId),
    {
      filters,
      encoding: "base64",
    }
  );

  return programAccounts;
}
