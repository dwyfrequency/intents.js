interface CurrencyFrom {
    type: 'TOKEN';
    address: string;
    amount: number;
    chainId: number | string;
}
interface CurrencyTo {
    type: 'TOKEN';
    address: string;
    amount: number;
    chainId: number | string;
}
interface LiquidityProvidingTo {
    type: 'LiquidityProviding';
    asset_0: string;
    amount_0: number;
    asset_1: string;
    amount_1: number;
    address?: string;
}
interface LiquidityWithdrawFrom {
    type: 'LiquidityWithdraw';
    tokenId: number | string;
    liquidity: number;
    amount0Min: number;
    amount1Min: number;
    deadline: Date;
    address: string;
}
interface LoanTo {
    type: 'Loan';
    asset: string;
    amount: number;
    address?: string;
}
interface LoanFrom {
    type: 'Loan';
    asset: string;
    amount: number;
    address: string;
}
interface StakeTo {
    type: 'STAKE';
    address?: string;
    amount: number;
    chainId?: number | string;
}
interface ExtraData {
    expirationDate?: Date;
    partiallyFillable?: boolean;
    kind: 'buy' | 'sell' | 'stake' | 'restake' | 'LP' | 'loan';
}
export interface Intent {
    sender: string;
    from: CurrencyFrom | LoanFrom | LiquidityWithdrawFrom;
    to: CurrencyTo | StakeTo | LoanTo | LiquidityProvidingTo;
    extraData?: ExtraData;
}
export {};
