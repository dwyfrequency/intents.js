# Intents.js SDK

Bundler supported model till [0.18.2](https://github.com/blndgs/model/releases/tag/v0.18.2)

## Getting Started

See intents.js documentation at [docs.balloondogs.network](https://docs.balloondogs.network/solution/sdk)

### 1. Installation

To include `intents.js` in your project, ensure you have `Node.js` and `yarn` installed in your environment and run the following command:

```sh
yarn add intents.js
```

### 2. Setup

Import `intents.js` into your project to begin defining intents:

```tsx
import { IntentBuilder, Projects, Intent } from 'intents.js';
import { ethers } from 'ethers';
```

## Usage

### 1. Initializing the SDK

Create an instance of the `IntentBuilder`:

```tsx
const BUNDLER_URL = 'https://your-bundler-url.com';
const intentBuilder = new IntentBuilder();
```

### 2. Creating an Intent

To create an intent with the `intents.js` SDK, you must specify the nature of the transaction you want to execute. This involves defining the source (from) and destination (to) assets, including their types, addresses, and the amounts involved. An intent encapsulates all the details required to execute a transaction between two parties or within the blockchain environment.

Here’s how you can structure the creation of an intent:

1. **Define Sender**: The blockchain address that initiates the intent. This should be the address of the user or contract initiating the transaction.
2. **Set Transaction Modes**: Define the `from` and `to` to specify the types of operations, such as 'currency', 'loan', or 'staking'. Each mode dictates how the SDK processes the intent.
3. **Select Tokens and Amounts**: Choose the tokens for the source and destination. For the `from` and `to`, use the actual token contract addresses. Specify the amount to set how much of each token should be involved in the transaction.
4. **Specify Projects (Optional)**: For operations involving specific projects or protocols, such as staking or loans, identify the project using the `Projects` class which provides standardized addresses for known entities.

Example of creating a staking intent:

```tsx
import { IntentBuilder, Projects, Intent } from 'intents.js';
import { ethers } from 'ethers';

const BUNDLER_URL = 'https://your-bundler-url.com';
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const intentBuilder = await IntentBuilder.createInstance(BUNDLER_URL);

const sender = '0xYourSenderAddress';
const amount = ethers.utils.parseUnits('0.1', 'ether').toString();

const from = {
  type: 'TOKEN',
  address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', // ETH address
  amount: amount,
  chainId: '1',
};

const to = {
  type: 'STAKE',
  address: Projects.Lido,
  chainId: '1',
};

const intent: Intent = {
  sender: sender,
  from: from,
  to: to,
};

await intentBuilder
  .execute(intent, signer)
  .then(() => console.log('Intent executed successfully.'))
  .catch(error => console.error('Error executing intent:', error));
```

### 3. Faucet and Check Balance Utilities

The SDK provides utility functions to faucet ETH to an account and check the balance of ETH or ERC-20 tokens.

#### Faucet ETH to an Account\*\*

```tsx
import { faucet } from 'intents.js';

const recipientAddress = '0xYourRecipientAddress';
await faucet(recipientAddress)
  .then(() => console.log('Faucet successful.'))
  .catch(error => console.error('Error using faucet:', error));
```

#### Check Balance of ETH or ERC-20 Token

```tsx
import { checkBalance } from 'intents.js';

const accountAddress = '0xYourAccountAddress';
const tokenAddress = '0xTokenContractAddress'; // Use '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee' for ETH

const balance = await checkBalance(accountAddress, tokenAddress);
console.log(`Balance: ${balance}`);
```

### 4. Execute the Intent

After setting up your intents, the next step is to execute these intents using the `IntentBuilder`. This process involves calling the `execute` method on your `intentBuilder` instance, passing in the necessary parameters such as the intents and your signing key. The execution is handled asynchronously.

```tsx
await intentBuilder
  .execute(intent, signer)
  .then(() => console.log('Intent executed successfully.'))
  .catch(error => console.error('Error executing intent:', error));
```

### 5. Utilizing the Projects Class for Staking Providers

The `intents.js` SDK simplifies interactions with staking operations through the `Projects` class. This utility class provides quick access to the addresses of well-known staking providers, making it easier to reference them when building staking-related intents.

#### Available Staking Providers

- `Lido`
- `RocketPool`
- `Mantle`
- `Aave`
- `Compound`
- `Spark`
- `SushiSwap`

## Example: Full Usage

```tsx
import { IntentBuilder, Projects, Intent, faucet, checkBalance } from 'intents.js';
import { ethers } from 'ethers';

const BUNDLER_URL = 'https://your-bundler-url.com';
const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();

const intentBuilder = await IntentBuilder.createInstance(BUNDLER_URL);

const sender = '0xYourSenderAddress';
const amount = ethers.utils.parseUnits('0.1', 'ether').toString();

const from = {
  type: 'TOKEN',
  address: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', // ETH address
  amount: amount,
  chainId: '1',
};

const to = {
  type: 'STAKE',
  address: Projects.Lido,
  chainId: '1',
};

const intent: Intent = {
  sender: sender,
  from: from,
  to: to,
};

await faucet(sender)
  .then(() => console.log('Faucet successful.'))
  .catch(error => console.error('Error using faucet:', error));

const balance = await checkBalance(sender, '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
console.log(`ETH Balance: ${balance}`);

await intentBuilder
  .execute(intent, signer)
  .then(() => console.log('Intent executed successfully.'))
  .catch(error => console.error('Error executing intent:', error));
```

This documentation covers the initialization, intent creation, execution, and utility functions provided by the `intents.js` SDK.
