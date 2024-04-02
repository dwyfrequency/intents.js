import { BigNumber } from 'ethers';
interface CurrencyFrom {
    type: 'TOKEN';
    address: string;
    amount: BigNumber;
    chainId: number | string;
}
interface CurrencyTo {
    type: 'TOKEN';
    address: string;
    amount: BigNumber;
    chainId: number | string;
}
interface LiquidityProvidingTo {
    type: 'LiquidityProviding';
    asset_0: string;
    amount_0: bigint;
    asset_1: string;
    amount_1: bigint;
    address?: string;
}
interface LiquidityWithdrawFrom {
    type: 'LiquidityWithdraw';
    tokenId: number | string;
    liquidity: bigint;
    amount0Min: bigint;
    amount1Min: bigint;
    deadline: Date;
    address: string;
}
interface LoanTo {
    type: 'Loan';
    asset: string;
    amount: bigint;
    address?: string;
}
interface LoanFrom {
    type: 'Loan';
    asset: string;
    amount: bigint;
    address: string;
}
interface StakeTo {
    type: 'STAKE';
    address?: string;
    amount: bigint;
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
