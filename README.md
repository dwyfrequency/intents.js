# Intents.js SDK

![NPM Version](https://img.shields.io/npm/v/blndgs-model)
![codecov](https://codecov.io/gh/blndgs/intents.js/graph/badge.svg?token=TAVORU8E7D)

## Getting Started

See intents.js documentation at [docs.balloondogs.network](https://docs.balloondogs.network/solution/sdk)

### 1. Installation

To include `intents.js` in your project, ensure you have Node.js and npm installed in your environment and run the following command:

```bash
npm install intents.js
```

### 2. Setup

Import `intents.js` into your project to begin defining intents:

```typescript
import { IntentBuilder, PROJECTS, CHAINS, toBigInt, Asset, Stake } from 'intents.js';
import { ethers } from 'ethers';
```

## Usage

### 1. Initializing the SDK

Create an instance of the `IntentBuilder`:

```typescript
const intentBuilder = await IntentBuilder.createInstance(BUNDLER_URL);
```

### 2. Creating and Executing an Intent

To create and execute an intent with the `intents.js` SDK, you need to specify the details of the transaction you want to perform. This involves defining the source (from) and destination (to) assets, including their types, addresses, and amounts.

Here's an example of creating and executing a swap intent:

```typescript
import { IntentBuilder, PROJECTS, CHAINS, toBigInt, Asset, Account, TOKENS } from 'intents.js';
import { ethers } from 'ethers';

const BUNDLER_URL = 'https://bundler.dev.balloondogs.network';
const NODE_URL = 'https://virtual.mainnet.rpc.tenderly.co/your-access-key';

async function executeSwap() {
  const signer = new ethers.Wallet('your-private-key');
  const account = await Account.createInstance(signer, BUNDLER_URL, NODE_URL);
  const intentBuilder = await IntentBuilder.createInstance(BUNDLER_URL);

  const from = new Asset({
    address: TOKENS.ETH.address,
    amount: toBigInt(0.1, TOKENS.ETH.decimal),
    chainId: toBigInt(CHAINS.Ethereum),
  });

  const to = new Asset({
    address: TOKENS.DAI.address,
    chainId: toBigInt(CHAINS.Ethereum),
    amount: toBigInt(0, TOKENS.DAI.decimal), // Amount will be determined by the swap
  });

  try {
    await intentBuilder.execute(from, to, account);
    console.log('Swap executed successfully.');
  } catch (error) {
    console.error('Error executing swap:', error);
  }
}

executeSwap();
```

### 3. Utility Functions

The SDK provides several utility functions for handling token amounts and conversions:

- `toBigInt(value: ethers.BigNumber | number): ProtoBigInt`
- `floatToWei(amount: number): ethers.BigNumber`
- `weiToFloat(wei: ethers.BigNumber): number`
- `tokenToFloat(amount: ethers.BigNumber, decimals: number): number`
- `floatToToken(amount: number, decimals: number): ethers.BigNumber`
- `amountToBigInt(amount: number, decimal: number): ProtoBigInt`

These functions help in converting between different representations of token amounts.

### 4. Supported Projects

The `PROJECTS` object provides addresses for various DeFi projects:

- Lido
- RocketPool
- Mantle
- Aave
- Compound
- Spark
- SushiSwap

You can use these addresses when interacting with specific protocols.

## Contributing

Contributions to `intents.js` are welcome! Please refer to our contributing guidelines for more information.

## License

This project is licensed under the [MIT License](LICENSE).
