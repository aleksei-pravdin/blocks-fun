import * as borsh from "@coral-xyz/borsh";
import type { PublicKey } from "@solana/web3.js";

// export interface Pool {
//   tokenMint: PublicKey;
//   liquidityMint: PublicKey;
//   totalLiquiditySupply: bigint;
//   totalPoolTokens: bigint;
//   lockedLiquidity: bigint;
//   platformFee: bigint;
//   houseEdge: number;
//   maxWinLiqThreshold: number;
//   bump: number;
// }

const GameStatusLayout = borsh.rustEnum([
  borsh.struct([], "Pending"),
  borsh.struct([], "Win"),
  borsh.struct([], "Loose"),
]);

const VrfRequestSchema = borsh.struct([
  borsh.publicKey("user"), // Pubkey
  borsh.publicKey("pool"), // Pubkey
  borsh.u64("bet_amount"), // u64
  borsh.u32("win_multiplier"), // u32
  borsh.array(borsh.u8(), 32, "seed"), // [u8; 32]
  GameStatusLayout.replicate("status"),
  borsh.u8("bump"), // u8
]);

export function decodeVrf(data: Buffer) {
  return VrfRequestSchema.decode(data);
}
