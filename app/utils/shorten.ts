import type { Address } from "@solana/addresses";
import type { PublicKey } from "@solana/web3.js";

export default function (val: string | Address | PublicKey) {
  const s = String(val);
  if (s.length <= 10) return s;
  return `${s.slice(0, 4)}…${s.slice(-4)}`;
}
