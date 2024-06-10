# Intents.js SDK

## Getting Started

See intents.js documentation at [docs.balloondogs.network](https://docs.balloondogs.network/solution/sdk)

### 1. Installation

To include `intents.js` in your project, ensure you have Node.js and npm installed in your environment and run the following command:

```bash
npm install intents.js
```

### 2. Setup

Import `intents.js` into your project to begin defining intents:

```tsx
import { IntentBuilder, Projects } from 'intents.js';
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
const nodeUrl = '<Your_Node_URL_Here>';
```

### 3. Create the Intent



```tsx
const sender = '0x';
const fromMode = 'currency';
const fromSelectedToken = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
const inputValue = '0.1';
const toMode = 'staking';
const toSelectedToken = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
const toAmount = '0.1';
const fromSelectedProject = '';
const toSelectedProject = Projects.Lido;


const intent = intentBuilder.createIntent(sender, fromMode, fromSelectedToken, inputValue, toMode, toSelectedToken, toAmount, fromSelectedProject, toSelectedProject)
```



### 3. Execute the Intent

After setting up your intents array, the next step is to execute these intents using the `IntentBuilder`. This process involves calling the `execute` method on your `intentBuilder` instance, passing in the necessary parameters such as the intents array, your signing key, and the node URL. The execution is handled asynchronously.

```tsx
intentBuilder
  .execute(intent, signer, nodeUrl)
  .then(() => console.log('Intent executed successfully.'))
  .catch(error => console.error('Error executing intent:', error));
```

### 4. Utilizing the Projects Class for Staking Providers

The `intents.js` SDK simplifies interactions with staking operations through the `Projects` class. This utility class provides quick access to the addresses of well-known staking providers, making it easier to reference them when building staking-related intents.

#### Available Staking Providers:

- `Lido`
- `RocketPool`
- `Mantle`
- `Aave`
- `Compound`
- `Spark`
- `SushiSwap`

