export const solanaKeys = {
  all: ["sol"] as const,

  balance: (address: string) =>
    [...solanaKeys.all, "balance", address] as const,

  tokenBalance: (address: string) =>
    [...solanaKeys.all, "tokenBalance", address] as const,

  // account: (address: string) =>
  //   [...solanaKeys.all, "account", address] as const,

  // programAccounts: (programId: string, filters?: unknown) =>
  //   [...solanaKeys.all, "programAccounts", { programId, filters }] as const,

  // // Example domain-specific:
  // userProfile: (address: string) =>
  //   [...solanaKeys.all, "userProfile", address] as const,

  pool: (poolAddress: string) =>
    [...solanaKeys.all, "pool", poolAddress] as const,

  tokenInfo: (mint: string) => [...solanaKeys.all, "tokenInfo", mint] as const,
};
