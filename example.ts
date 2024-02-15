import { SigningKey } from 'ethers/lib/utils';
import { IntentBuilder, Intent, Projects } from './src/index';
import { ethers, BigNumber } from 'ethers';



// const provider = new ethers.providers.Web3Provider(window.ethereum as any);
// const signer = provider.getSigner();

const nodeUrl = "https://virtual.polygon.rpc.tenderly.co/6f40bb2c-e690-4c11-8f33-6f658695c12b"
const signingKey = "031ce39458d86fe55c19828d9ac9212277e1ddc0a0e5b168e494f42a299d5849"
const intentBuilder = new IntentBuilder();

let intents: Intent[] =
    [
        {
            from: {
                type: "TOKEN",
                address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
                amount: 2300,
                chainId: BigNumber.from("1")
            },
            to: {
                type: "TOKEN",
                address: "NATIVE", //ETH
                amount: 1,
                chainId: BigNumber.from("1")
            },
            extraData: {
                expirationDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), //24h
                partiallyFillable: false,
                kind: "sell"
            }
        },
        {
            from: {
                type: "TOKEN",
                address: "NATIVE", //ETH
                amount: 2300,
                chainId: BigNumber.from("1"),
            },
            to: {
                type: "STAKE",
                address: Projects.Staking.Lido
            },
            extraData: {
                expirationDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000), //24h
                kind: "stake"
            }
        }

    ]


intentBuilder.execute(intents, signingKey, nodeUrl)
    .then(() => console.log('Intent executed successfully.'))
    .catch((error) => console.error('Error executing intent:', error));




