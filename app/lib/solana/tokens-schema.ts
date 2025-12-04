export interface FullTokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  pricePerToken: number | null;
  image: string | null;
}

export interface HeliusGetAssetResponse {
  result?: {
    content?: {
      metadata?: {
        name?: string;
        symbol?: string;
      };
      files?: Array<{ cdn_uri?: string }>;
    };
    token_info?: {
      decimals?: number;
      price_info?: {
        price_per_token?: number;
      } | null;
    };
  };
}
