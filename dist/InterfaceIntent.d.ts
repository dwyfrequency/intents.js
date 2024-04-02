interface CurrencyFrom {
    type: 'TOKEN';
    address: string;
    amount: string;
    chainId: number | string;
}
interface CurrencyTo {
    type: 'TOKEN';
    address: string;
    amount: string;
    chainId: number | string;
}
interface StakeTo {
    type: 'STAKE';
    address?: string;
    chainId?: number | string;
}
interface ExtraData {
    expirationDate?: Date;
    partiallyFillable?: boolean;
    kind: 'buy' | 'sell' | 'stake';
}
export interface Intent {
    sender: string;
    from: CurrencyFrom;
    to: CurrencyTo | StakeTo;
    extraData?: ExtraData;
}
export {};
