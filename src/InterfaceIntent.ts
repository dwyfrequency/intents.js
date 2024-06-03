export type stateType = 'TOKEN' | 'LOAN' | 'STAKE';

export interface state {
  type: stateType;
  address: string;
  amount: number;
  chainId: number;
}

export interface toState extends state {
  type: 'TOKEN' | 'LOAN';
}

export interface fromState extends state {}

export interface ExtraData {
  expirationDate?: Date;
  partiallyFillable?: boolean;
  kind: 'buy' | 'sell' | 'stake';
}

export interface Intent {
  sender: string;
  from: fromState;
  to: toState;
  extraData?: ExtraData;
}
