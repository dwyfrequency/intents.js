import { IntentBuilder, From, To, Projects } from './src/index';
import { ethers } from 'ethers';
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const PRIVATE_KEY = "";
const signer = new ethers.Wallet(PRIVATE_KEY, provider);


const intentBuilder = new IntentBuilder();

const fromIntent: From = [{
    locationAddress: '0xUserWalletAddress',
    chainId: '1', // Example Ethereum mainnet
    asset: {
        address: '0xAssetContractAddress',
        amount: 1.0,
    },
}];

const toIntent: To = [{
    locationAddress: Projects.Staking.Lido, // Assuming Projects.Lido is the contract address
    chainId: '1',
    asset: {
        address: '0xTargetAssetAddress',
        amount: 1.0,
    },
}];


// Add the fromIntent
intentBuilder.addFrom(fromIntent);

// Add the toIntent
intentBuilder.addTo(toIntent);

intentBuilder.execute(signer)
    .then(() => console.log('Intent executed successfully.'))
    .catch((error) => console.error('Error executing intent:', error));





