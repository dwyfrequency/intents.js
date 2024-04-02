interface CurrencyFrom {
	type: 'TOKEN'
	address: string
	amount: number
	chainId: number | string // Allow both number and string
}

interface CurrencyTo {
	type: 'TOKEN'
	address: string
	amount: number
	chainId: number | string // Allow both number and string
}

interface LiquidityProvidingTo {
	type: 'LiquidityProviding',
	asset_0: string, //ERC20 address
	amount_0: number,
	asset_1: string, //ERC20 address
	amount_1: number,
	address?: string //Explicit mention of a DeFi project. If empty - Solver will provide the best yield for this asset 
}

interface LiquidityWithdrawFrom {
	type: 'LiquidityWithdraw',
	tokenId: number | string // Allow both number and string,
	liquidity: number,
	amount0Min: number,
	amount1Min: number,
	deadline: Date
	address: string 
}

interface LoanTo {
	type: 'Loan',
	asset: string, //ERC20 address
	amount: number,
	address?: string //Explicit mention of a DeFi project. If empty - Solver will provide the best yield for this asset 
}

interface LoanFrom {
	type: 'Loan',
	asset: string, //ERC20 address
	amount: number,
	address: string 
}

interface StakeTo {
	type: 'STAKE'
	address?: string,
	amount: number,
	chainId?: number | string // Allow both number and string
}

interface ExtraData {
	expirationDate?: Date
	partiallyFillable?: boolean
	kind: 'buy' | 'sell' | 'stake' | 'restake' | 'LP' | 'loan'   
}

export interface Intent {
	sender: string
	from: CurrencyFrom | LoanFrom | LiquidityWithdrawFrom 
	to: CurrencyTo | StakeTo | LoanTo | LiquidityProvidingTo
	extraData?: ExtraData
}
