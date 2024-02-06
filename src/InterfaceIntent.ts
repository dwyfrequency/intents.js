import {BigNumber} from 'ethers';



interface CurrencyFrom {
	type: "TOKEN"
	address:  string
	amount: number
	chainId: BigNumber
}

interface CurrencyTo {
	type: "TOKEN"
	address:  string
	amount: number
	chainId: BigNumber
}

interface StakeTo {
	type: "STAKE"
	address?: string  	//Staking pool address, optional
	chainId?: BigNumber
}

interface ExtraData {
	expirationDate?: Date
	partiallyFillable?: boolean
	kind: "buy" | "sell" | "stake"
} 




export interface Intent {
  from : CurrencyFrom,
  to : CurrencyTo | StakeTo,
  extraData?: ExtraData
}
