import { PublicKey } from "@solana/web3.js";

export default function (pubkey: string | PublicKey) {
  return typeof pubkey === "string" ? new PublicKey(pubkey) : pubkey;
}
