import * as borsh from "@coral-xyz/borsh";
import type { PublicKey } from "@solana/web3.js";

const LIQUIDITY_DECIMALS = 9;
export interface Pool {
  tokenMint: PublicKey;
  liquidityMint: PublicKey;
  totalLiquiditySupply: bigint;
  totalPoolTokens: bigint;
  lockedLiquidity: bigint;
  platformFee: bigint;
  houseEdge: number;
  maxWinLiqThreshold: number;
  bump: number;
}

export const PoolSchema = borsh.struct([
  borsh.publicKey("tokenMint"),
  borsh.publicKey("liquidityMint"),
  borsh.u64("totalLiquiditySupply"),
  borsh.u64("totalPoolTokens"),
  borsh.u64("lockedLiquidity"),
  borsh.u64("platformFee"),
  borsh.u16("houseEdge"),
  borsh.u16("maxWinLiqThreshold"),
  borsh.u8("bump"),
]);

export function decodePool(data: Buffer): Pool {
  return PoolSchema.decode(data);
}
