import { ethers, BytesLike } from 'ethers';
import { Intent } from './InterfaceIntent';
export declare class IntentBuilder {
    getSender(signer: ethers.Signer, salt?: BytesLike): Promise<string>;
    execute(intents: Intent, signer: ethers.Signer, nodeUrl: string, salt?: BytesLike): Promise<void>;
    private getInitCode;
    private getSignature;
    private getNonce;
}
