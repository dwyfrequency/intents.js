import { IntentBuilder, Intent, Projects } from './src/index';
import { BigNumber } from 'ethers';

const signingKey = "";


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


intentBuilder.execute(signingKey, intents)
    .then(() => console.log('Intent executed successfully.'))
    .catch((error) => console.error('Error executing intent:', error));





