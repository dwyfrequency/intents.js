interface AssetIntent {
    locationAddress: string;
    chainId: string;
    asset: {
      address: string;
      amount: number;
    };
  }
  
export type From = AssetIntent[];

export type To = AssetIntent[];

  