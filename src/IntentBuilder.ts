import { ethers } from 'ethers';
import { From, To } from './FromAndTo';
import { UserOp } from './UserOp';

const bundlerAddress = ""

export class IntentBuilder {
    private fromIntent: From;
    private toIntent: To;

    constructor() { }

    public addFrom(from: From): void {
        this.fromIntent = [...this.fromIntent, ...from];
    }

    public addTo(to: To): void {
        this.toIntent = [...this.toIntent, ...to];
    }

    async execute(signer: ethers.Signer): Promise<void> {
        const userOp: UserOp = {
          sender: ethers.constants.AddressZero, // Use ethers to provide a zero address
          nonce: BigInt(0),
          initCode: new Uint8Array(),
          callData: new Uint8Array(),
          callGasLimit: BigInt(0),
          verificationGasLimit: BigInt(0),
          preVerificationGas: BigInt(0),
          maxFeePerGas: BigInt(0),
          maxPriorityFeePerGas: BigInt(0),
          paymasterAndData: new Uint8Array(),
          signature: new Uint8Array(),
        };
      
        // Encode the UserOp object for the Ethereum transaction
        const callData = ethers.utils.defaultAbiCoder.encode(
          [
            "address",
            "uint256",
            "bytes",
            "bytes",
            "uint256",
            "uint256",
            "uint256",
            "uint256",
            "uint256",
            "bytes",
            "bytes"
          ],
          [
            userOp.sender,
            userOp.nonce,
            userOp.initCode,
            userOp.callData,
            userOp.callGasLimit,
            userOp.verificationGasLimit,
            userOp.preVerificationGas,
            userOp.maxFeePerGas,
            userOp.maxPriorityFeePerGas,
            userOp.paymasterAndData,
            userOp.signature,
          ]
        );
      
        // Create the transaction object
        const tx = {
        //   to: contractAddress,
          data: callData,
          // Value, gas limit, and other fields as required
        };
      
        // Sign and send the transaction
        const transactionResponse = await signer.sendTransaction(tx);
        console.log(`Transaction hash: ${transactionResponse.hash}`);
      }
      

    private clearIntents(): void {
        this.fromIntent = [];
        this.toIntent = [];
    }
}
