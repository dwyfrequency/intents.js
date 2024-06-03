interface Currency {
  type: 'TOKEN';
  address: string;
  amount: number;
  chainId: number;
}

interface Loan {
  type: 'LOAN';
  asset?: string; //ERC20 address
  amount?: number;
  address: string;
  chainId: number;
}

interface Stake {
  type: 'STAKE';
  address?: string;
  chainId?: number;
}

interface ExtraData {
  expirationDate?: Date;
  partiallyFillable?: boolean;
  kind: 'buy' | 'sell' | 'stake';
}

export interface Intent {
  sender: string;
  from: Currency | Loan;
  to: Currency | Stake | Loan;
  extraData?: ExtraData;
}
