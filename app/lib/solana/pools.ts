import {
  PublicKey,
  SystemProgram,
  TransactionInstruction,
  TransactionMessage,
  VersionedTransaction,
  Keypair,
} from "@solana/web3.js";

import { decodePool, type Pool } from "./pools-schema";
import { fetchAccountData, getLatestBlockhash } from "./rpc";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";

export async function fetchPool(
  poolAddress: string | PublicKey
): Promise<Pool | null> {
  const data = await fetchAccountData(poolAddress);

  return data ? decodePool(data) : null;
}

const PROGRAM_ID = new PublicKey(
  "BLoCKJ2rUVeGznE1pdvEGHUjQxAgq4nxhm2j4oWh4aL3"
);
const ORAO_VRF_PROGRAM_ID = new PublicKey(
  "VRFzZoJdhFWL8rkvu87LpKM3RbcVezpMEc6X5GVDr7y"
);
const ORAO_TREASURY = new PublicKey(
  "9ZTHWWZDpB36UFe1vszf2KEpt83vwi27jDqtHQ7NSXyR"
);
const VRF_REQUEST_SEED = Buffer.from("vrf_request");
const RANDOMNESS_ACCOUNT_SEED = Buffer.from("orao-vrf-randomness-request");
const CONFIG_ACCOUNT_SEED = Buffer.from("orao-vrf-network-configuration");
const POOL_SEED = Buffer.from("pool");

// todo in future make all bigint calculations without Number
// todo check in future if pool has been created already with same params
export async function buildCreatePoolTransaction(
  userAddress: PublicKey,
  tokenMint: PublicKey,
  initPoolAmount: bigint,
  houseEdgeBps: number, // e.g. 2 => 2%
  maxWinBps: number // e.g. 50 => 50% of liquidity
): Promise<[VersionedTransaction, PublicKey]> {
  // const houseEdgeBps = Math.round(houseEdgePercent * 100);
  //   const maxWinBps = Math.round(maxWinPercent * 100);

  // if (houseEdgeBps < 0 || houseEdgeBps > 10_000) {
  //     throw new Error("House edge must be between 0% and 100%");
  //   }
  //   if (maxWinBps < 0 || maxWinBps > 10_000) {
  //     throw new Error("Max win must be between 0% and 100%");
  //   }

  const houseEdgeSeed = Buffer.alloc(2);
  houseEdgeSeed.writeUInt16LE(houseEdgeBps, 0);
  const maxWinSeed = Buffer.alloc(2);
  maxWinSeed.writeUInt16LE(maxWinBps, 0);

  // check if poolPda already exists in future
  const [poolPda] = PublicKey.findProgramAddressSync(
    [POOL_SEED, tokenMint.toBuffer(), houseEdgeSeed, maxWinSeed],
    PROGRAM_ID
  );

  const lpMint = new Keypair();
  const userTokenAta = getAssociatedTokenAddressSync(
    tokenMint,
    userAddress,
    false,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  const poolTokenAta = getAssociatedTokenAddressSync(
    tokenMint,
    poolPda,
    true, // owner is a PDA
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  const userLpAta = getAssociatedTokenAddressSync(
    lpMint.publicKey,
    userAddress,
    false,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  const data = encodeInitPoolData({
    initialAmount: initPoolAmount,
    houseEdgeBps,
    maxWinLiqThresholdBps: maxWinBps,
  });

  const createPoolInstruction = new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      // 0. `[signer]` Pool creator/authority
      { pubkey: userAddress, isSigner: true, isWritable: true },
      // 1. `[writable]` Pool account (PDA)
      { pubkey: poolPda, isSigner: false, isWritable: true },
      // 2. `[writable]` Pool token account (to hold deposited tokens)
      { pubkey: poolTokenAta, isSigner: false, isWritable: true },
      // 3. `[writable]` Creator's token account (source of initial tokens)
      { pubkey: userTokenAta, isSigner: false, isWritable: true },
      // 4. `[writable]` Creator's liquidity token account (receives LP tokens)
      { pubkey: userLpAta, isSigner: false, isWritable: true },
      // 5. `[]` Token mint (SPL token for the pool)
      { pubkey: tokenMint, isSigner: false, isWritable: false },
      // 6. `[signer,writable]` Liquidity mint (created by this instruction)
      { pubkey: lpMint.publicKey, isSigner: true, isWritable: true },
      // 7. `[]` Token program
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      // 8. `[]` System program
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
      // 9. `[]` ATA program
      {
        pubkey: ASSOCIATED_TOKEN_PROGRAM_ID,
        isSigner: false,
        isWritable: false,
      },
    ],
    data,
  });

  const latestBlockhash = await getLatestBlockhash();
  const messageV0 = new TransactionMessage({
    payerKey: userAddress,
    recentBlockhash: latestBlockhash,
    instructions: [createPoolInstruction],
  }).compileToV0Message();
  const versionedTransaction = new VersionedTransaction(messageV0);

  return [versionedTransaction, poolPda];
}

/// Add liquidity to the pool
///
/// Accounts expected:
/// 0. `[signer]` User
/// 1. `[writable]` Pool account
/// 2. `[writable]` Pool's token account (destination)
/// 3. `[writable]` User's token account (source)
/// 4. `[writable]` User's liquidity token account
/// 5. `[writable]` Liquidity mint
/// 6. `[]` Token program
export async function buildAddLiquidityTransaction(
  userAddress: PublicKey,
  poolAddress: PublicKey,
  poolTokenMint: PublicKey,
  liquidityTokenMint: PublicKey,
  amount: bigint
): Promise<VersionedTransaction> {
  const userTokenAta = getAssociatedTokenAddressSync(
    poolTokenMint,
    userAddress,
    false,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  const userLiquidityTokenAta = getAssociatedTokenAddressSync(
    liquidityTokenMint,
    userAddress,
    false,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  const poolTokenAta = getAssociatedTokenAddressSync(
    poolTokenMint,
    poolAddress,
    true,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  const data = encodeAddLiquidityData({
    amount,
  });

  const addLiquidityInstruction = new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      { pubkey: userAddress, isSigner: true, isWritable: true },
      { pubkey: poolAddress, isSigner: false, isWritable: true },
      { pubkey: poolTokenAta, isSigner: false, isWritable: true },
      { pubkey: userTokenAta, isSigner: false, isWritable: true },
      { pubkey: userLiquidityTokenAta, isSigner: false, isWritable: true },
      { pubkey: liquidityTokenMint, isSigner: false, isWritable: true },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    data,
  });

  const latestBlockhash = await getLatestBlockhash();
  const messageV0 = new TransactionMessage({
    payerKey: userAddress,
    recentBlockhash: latestBlockhash,
    instructions: [addLiquidityInstruction],
  }).compileToV0Message();
  const versionedTransaction = new VersionedTransaction(messageV0);

  return versionedTransaction;
}

export async function buildRemoveLiquidityTransaction(
  userAddress: PublicKey,
  poolAddress: PublicKey,
  poolTokenMint: PublicKey,
  liquidityTokenMint: PublicKey,
  // AMOUNT IN LIQUIDITY TOKENS
  amount: bigint
): Promise<VersionedTransaction> {
  const userTokenAta = getAssociatedTokenAddressSync(
    poolTokenMint,
    userAddress,
    false,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  const userLiquidityTokenAta = getAssociatedTokenAddressSync(
    liquidityTokenMint,
    userAddress,
    false,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  const poolTokenAta = getAssociatedTokenAddressSync(
    poolTokenMint,
    poolAddress,
    true,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  const data = encodeRemoveLiquidityData({
    amount,
  });

  const removeLiquidityInstruction = new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      { pubkey: userAddress, isSigner: true, isWritable: true },
      { pubkey: poolAddress, isSigner: false, isWritable: true },
      { pubkey: poolTokenAta, isSigner: false, isWritable: true },
      { pubkey: userTokenAta, isSigner: false, isWritable: true },
      { pubkey: userLiquidityTokenAta, isSigner: false, isWritable: true },
      { pubkey: liquidityTokenMint, isSigner: false, isWritable: true },
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
    ],
    data,
  });

  const latestBlockhash = await getLatestBlockhash();
  const messageV0 = new TransactionMessage({
    payerKey: userAddress,
    recentBlockhash: latestBlockhash,
    instructions: [removeLiquidityInstruction],
  }).compileToV0Message();
  const versionedTransaction = new VersionedTransaction(messageV0);

  return versionedTransaction;
}

export async function buildTryMineTransaction(
  userAddress: PublicKey,
  poolAddress: PublicKey,
  poolTokenMint: PublicKey,
  betAmount: bigint,
  winMultiplier: number
): Promise<[VersionedTransaction, PublicKey]> {
  console.log(betAmount, winMultiplier);
  const seedBytes = new Uint8Array(32);
  crypto.getRandomValues(seedBytes);
  const seedBuf = Buffer.from(seedBytes);
  const [vrfPda] = PublicKey.findProgramAddressSync(
    [VRF_REQUEST_SEED, userAddress.toBuffer(), seedBuf],
    PROGRAM_ID
  );
  const [randAcc] = PublicKey.findProgramAddressSync(
    [RANDOMNESS_ACCOUNT_SEED, seedBuf],
    ORAO_VRF_PROGRAM_ID
  );
  const [netState] = PublicKey.findProgramAddressSync(
    [CONFIG_ACCOUNT_SEED],
    ORAO_VRF_PROGRAM_ID
  );
  const userTokenAta = getAssociatedTokenAddressSync(
    poolTokenMint,
    userAddress,
    false,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  const poolTokenAta = getAssociatedTokenAddressSync(
    poolTokenMint,
    poolAddress,
    true,
    TOKEN_PROGRAM_ID,
    ASSOCIATED_TOKEN_PROGRAM_ID
  );

  const data = encodeTryMineData({
    seed: seedBuf,
    betAmount,
    winMultiplier,
  });

  const tryMineInstruction = new TransactionInstruction({
    programId: PROGRAM_ID,
    keys: [
      // 0. [signer] User
      { pubkey: userAddress, isSigner: true, isWritable: true },
      // 1. [writable] Pool account
      { pubkey: poolAddress, isSigner: false, isWritable: true },
      // 2. [writable] Pool's token account
      { pubkey: poolTokenAta, isSigner: false, isWritable: true },
      // 3. [writable] User's token account
      { pubkey: userTokenAta, isSigner: false, isWritable: true },
      // 4. [writable] VRF request account (PDA)
      { pubkey: vrfPda, isSigner: false, isWritable: true },
      // 5. [writable] ORAO VRF randomness account
      { pubkey: randAcc, isSigner: false, isWritable: true },
      // 6. [writable] ORAO VRF treasury
      { pubkey: ORAO_TREASURY, isSigner: false, isWritable: true },
      // 7. [writable] ORAO VRF network state
      { pubkey: netState, isSigner: false, isWritable: true },
      // 8. [] Token program
      { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      // 9. [] ORAO VRF program
      { pubkey: ORAO_VRF_PROGRAM_ID, isSigner: false, isWritable: false },
      // 10. [] System program
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
    ],
    data,
  });

  const latestBlockhash = await getLatestBlockhash();
  const messageV0 = new TransactionMessage({
    payerKey: userAddress,
    recentBlockhash: latestBlockhash,
    instructions: [tryMineInstruction],
  }).compileToV0Message();
  const versionedTransaction = new VersionedTransaction(messageV0);

  return [versionedTransaction, vrfPda];
}

// GamblingInstruction enum (Borsh):
// 0: InitPool
// 1: TryMine
// 2: FulfillMine
// 3: AddLiquidity
// 4: WithdrawLiquidity
// 5: WithdrawPlatformFee

// TryMine layout:
// u8     variant (1)
// [u8;32] seed
// u64   bet_amount
// u32   win_multiplier
function encodeTryMineData(params: {
  seed: Buffer;
  betAmount: bigint;
  winMultiplier: number;
}): Buffer {
  const { seed, betAmount, winMultiplier } = params;

  if (seed.length !== 32) {
    throw new Error("Seed must be 32 bytes");
  }

  const buf = Buffer.alloc(1 + 32 + 8 + 4);

  // variant index = 1
  buf.writeUInt8(1, 0);

  // seed [u8;32]
  seed.copy(buf, 1);

  // bet_amount u64 LE
  buf.writeBigUInt64LE(betAmount, 1 + 32);

  // win_multiplier u32 LE
  buf.writeUInt32LE(winMultiplier, 1 + 32 + 8);

  return buf;
}

function encodeAddLiquidityData(params: { amount: bigint }): Buffer {
  const { amount } = params;

  const buf = Buffer.alloc(1 + 8);

  // variant index = 1
  buf.writeUInt8(3, 0);

  // amount u64 LE
  buf.writeBigUInt64LE(amount, 1);

  return buf;
}

function encodeRemoveLiquidityData(params: { amount: bigint }): Buffer {
  const { amount } = params;

  const buf = Buffer.alloc(1 + 8);

  // variant index = 1
  buf.writeUInt8(4, 0);

  // amount u64 LE
  buf.writeBigUInt64LE(amount, 1);

  return buf;
}

function encodeInitPoolData(params: {
  initialAmount: bigint;
  houseEdgeBps: number;
  maxWinLiqThresholdBps: number;
}): Buffer {
  const { initialAmount, houseEdgeBps, maxWinLiqThresholdBps } = params;

  const buf = Buffer.alloc(1 + 8 + 2 + 2);

  // discriminant
  buf.writeUInt8(0, 0);

  // u64 little-endian
  buf.writeBigUInt64LE(initialAmount, 1);

  // u16 little-endian
  buf.writeUInt16LE(houseEdgeBps, 1 + 8);
  buf.writeUInt16LE(maxWinLiqThresholdBps, 1 + 8 + 2);

  return buf;
}
