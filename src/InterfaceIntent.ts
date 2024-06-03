interface Currency {
  type: 'TOKEN';
  address: string;
  amount: string;
  chainId: string;
}

interface Loan {
  type: 'LOAN';
  asset?: string; //ERC20 address
  amount?: string;
  address: string;
  chainId: string;
}

interface Stake {
  type: 'STAKE';
  address?: string;
  chainId?: string;
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
