# Intent.js SDK

## Getting Started

### 1. Installation

To include `intent.js` in your project, ensure you have Node.js and npm installed in your environment and run the following command:

```bash
npm install intent.js
```

### 2. Setup

Import `intent.js` into your project to begin defining intents:

```tsx
import { IntentBuilder, Intent, Projects } from 'intent.js';
```

## Usage

### 1. Initializing the SDK

Create an instance of the `IntentSDK`:

```tsx
const intentBuilder = new IntentBuilder();
```

### 2. Configuration

After initializing the SDK, you need to configure it with your signing key and node URL. Replace the placeholders with your actual signing key and node URL:

```tsx
const signingKey = "<Your_Signing_Key_Here>";
const nodeUrl = "<Your_Node_URL_Here>";
```


### 3. Building the Intents Array

To build an array of intents for our bundler to solve, you can directly utilize the predefined interfaces. Here's an example demonstrating how to construct the `intents` array with specific transaction intentions:

```tsx
const intents: Intent[] = [
    {
        from: {
            type: "TOKEN",
            address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
            amount: 2300,
            chainId: BigNumber.from("1")
        },
        to: {
            type: "TOKEN",
            address: "NATIVE", // ETH as native currency
            amount: 1,
            chainId: BigNumber.from("1")
        },
        extraData: {
            expirationDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // 24 hours from now
            partiallyFillable: false,
            kind: "sell"
        }
    },
    {
        from: {
            type: "TOKEN",
            address: "NATIVE", // ETH as native currency
            amount: 2300,
            chainId: BigNumber.from("1"),
        },
        to: {
            type: "STAKE",
            address: Projects.Staking.Lido // Staking in Lido project
        },
        extraData: {
            expirationDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), // 24 hours from now
            kind: "stake"
        }
    }
];
```


### 3. Execute the Intent

After setting up your intents array, the next step is to execute these intents using the `IntentBuilder`. This process involves calling the `execute` method on your `intentBuilder` instance, passing in the necessary parameters such as the intents array, your signing key, and the node URL. The execution is handled asynchronously.

```tsx

intentBuilder.execute(intents, signingKey, nodeUrl)
    .then(() => console.log('Intent executed successfully.'))
    .catch((error) => console.error('Error executing intent:', error));

```
### 4. Utilizing the Projects Class for Staking Providers

The `intent.js` SDK simplifies interactions with staking operations through the `Projects` class. This utility class provides quick access to the addresses of well-known staking providers, making it easier to reference them when building staking-related intents. 

#### Available Staking Providers:

- `BeaconChain`
- `Lido`
- `RocketPool`
- `Mantle`
- `StakeWise`
- `Ankr`
- `Swell`
- `Liquid`
- `Binance`
- `Stader`
- `Origin`
- `Frax`
- `Coinbase`

#### Example of Usage:

When defining an intent to stake with a specific provider, you can reference the provider's address directly through the `Projects` class. Here's how you can specify staking with Lido as an example:

```tsx
to: {
    type: "STAKE",
    address: Projects.Staking.Lido
},
```
