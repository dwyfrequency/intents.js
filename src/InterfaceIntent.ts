interface CurrencyFrom {
	type: 'TOKEN'
	address: string
	amount: number
	chainId: number | string // Allow both number and string
  }
  interface Loan {
	type: 'LOAN',
	asset?: string, //ERC20 address
	amount?: number, 
	address: string,
	chainId: number | string // Allow both number and string
  }
  
  interface CurrencyTo {
	type: 'TOKEN'
	address: string
	amount: string
	chainId: number | string // Allow both number and string
  }
  
  interface StakeTo {
	type: 'STAKE'
	address?: string
	chainId?: number | string // Allow both number and string
  }
  
  interface ExtraData {
	expirationDate?: Date
	partiallyFillable?: boolean
	kind: 'buy' | 'sell' | 'stake'
  }
  
  export interface Intent {
	sender: string
	from: CurrencyFrom | Loan
	to: CurrencyTo | StakeTo | Loan
	extraData?: ExtraData
  }
  