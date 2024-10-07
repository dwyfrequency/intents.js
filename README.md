# Intents.js SDK

![NPM Version](https://img.shields.io/npm/v/intents.js)
![codecov](https://codecov.io/gh/blndgs/intents.js/graph/badge.svg?token=TAVORU8E7D)

## Getting Started

See intents.js documentation at [docs.balloondogs.network](https://docs.balloondogs.network/solution/sdk)

### 1. Installation

Using npm:

```bash
npm install intents.js
```

### 2. Setup

Import `intents.js` and setup `Account` and `IntentBuilder`:

```typescript
import { Account, IntentBuilder, PROJECTS, CHAINS, toBigInt, amountToBigInt, Asset, Stake } from 'intents.js';
import { ethers } from 'ethers';

const chainConfigs = {
  1: {
    rpcUrl: 'YOUR_ETH_RPC_URL',
    bundlerUrl: 'https://eth.bundler.balloondogs.network',
  },
  56: {
    rpcUrl: 'YOUR_BNB_RPC_URL',
    bundlerUrl: 'https://bsc.bundler.balloondogs.network',
  },
};

const intentBuilder = await IntentBuilder.createInstance(chainConfigs);

const signer = new ethers.Wallet('your private key');

const account = await Account.createInstance(signer, chainConfigs);
```

### 3. Creating an Intent
An Intent structure consists of two symmetric source and destination states.

Here’s a simple example of Staking on Lido intent:
```typescript
const amount = 0.1;
const ethAddress = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
const ethDecimals = 18;

const source = new Asset({
  address: ethAddress,
  amount: amountToBigInt(amount, ethDecimals),
  chainId: toBigInt(CHAINS.Ethereum),
});

const destination = new Stake({
  amount: amountToBigInt(amount, ethDecimals),
  address: PROJECTS.Lido,
  chainId: toBigInt(CHAINS.Ethereum),
});
```

### 4. Execute the intent
Simply provide the source and destination states along with the associated account.

The `execute` function will then wrap the intent as an [ERC-4337](https://eips.ethereum.org/EIPS/eip-4337) userOp and submit it to the BalloonDogs network.
 

```typescript
  const solvedHash = await intentBuilder.execute(source, destination, account);
```

### 5. Fetch onchain receipt of executed transaction

```typescript

const receipt = await intentBuilder.getReceipt(1, solvedHash)

const txHash = receipt.result.receipt.transactionHash

console.log(`
View your tx onchain using any explorer: \n

Hash: ${txHash}
tx link: https://etherscan.io/tx/${txHash}`)
```

## Utility Functions

The SDK provides several utility functions for easy manage conversions:

- `toBigInt(value: bigint | number): ProtoBigInt`
- `floatToWei(amount: number): bigint`
- `weiToFloat(wei: bigint): number`
- `tokenToFloat(amount: bigint, decimals: number): number`
- `floatToToken(amount: number, decimals: number): bigint`
- `amountToBigInt(amount: number, decimal: number): ProtoBigInt`

## Sending a conventional userOpa
The BalloonDogs network is fully compatible with the ERC-4337 standard and can operate as a bundler for standard useOps.
```typescript
await intentBuilder.executeStandardUserOps(account, ChainID, {
  calldata: '0x', // optional
  callGasLimit: CALL_GAS_LIMIT,
  maxFeePerGas: MAX_FEE_PER_GAS,
  maxPriorityFeePerGas: MAX_PRIORITY_FEE_PER_GAS,
  verificationGasLimit: VERIFICATION_GAS_LIMIT,
});
```


## Contributing

Contributions to `intents.js` are welcome! Please refer to our contributing guidelines for more information.

## License

This project is licensed under the [MIT License](LICENSE).
