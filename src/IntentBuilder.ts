import { ethers, BytesLike, BigNumber } from 'ethers';
import { Intent } from './InterfaceIntent';
import { rpcBundlerUrl, chainID, entryPointAddr, factoryAddr } from './Constants';
import { Presets, Client, UserOperationBuilder, IUserOperation } from "userop";


export class IntentBuilder {

  // public async getSender(signer: ethers.Signer, salt: BytesLike = "0"): Promise<string> {

  //     const simpleAccount = await Presets.Builder.SimpleAccount.init(
  //       signer, rpcBundlerUrl, { factory: factoryAddr, salt: salt }
  //     );
  //     const sender = simpleAccount.getSender();

  //     return sender;
  // }

  async execute(intents: Intent[], signingKey: string, nodeUrl: string, salt: BytesLike = "0"): Promise<void> {

    const signer = new ethers.Wallet(signingKey);
    let simpleAccount = await Presets.Builder.SimpleAccount.init(
      signer, rpcBundlerUrl, { factory: factoryAddr, salt: salt }
    );
    const sender = simpleAccount.getSender();

    const client = await Client.init(rpcBundlerUrl);
    const intent = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(JSON.stringify({ Intents: intents })));

    const builder = new UserOperationBuilder().useDefaults({ sender })
      .setCallData(intent)
      .setPreVerificationGas("0x493e0")
      .setMaxFeePerGas("0x493e0")

    const nonce = await this.getNonce(sender, nodeUrl)

    builder.setNonce(nonce);

    
    const signature = await this.getSignature(chainID, signer, entryPointAddr, builder.getOp())
      console.log("signature")
      console.log(signature)
    builder.setSignature(signature);

    const res = await client.sendUserOperation(builder);

    console.log(`UserOpHash: ${res.userOpHash}`);
    console.log('Waiting for transaction...');
    let ev = await res.wait();
    console.log(`Transaction hash: ${JSON.stringify(ev)}`);
    console.log(`View here: https://jiffyscan.xyz/userOpHash/${res.userOpHash}?network=mumbai`);


  }

  private async getNonce(address: string, nodeUrl: string): Promise<BigNumber> {
    const provider = new ethers.providers.JsonRpcProvider(nodeUrl);

    try {
      // Get the transaction count (nonce) for the given address
      const nonce = await provider.getTransactionCount(address);
      console.log(`Nonce for address ${address} is: ${nonce}`);
      return BigNumber.from(nonce);
    } catch (error) {
      console.error(`Error getting nonce: ${error}`);
      return BigNumber.from(0);

    }
  };

  private packForSignature(userOp: any): string {
    // Define the types for the ABI encoding
    const types = [
      'address',
      'uint256',
      'bytes32',
      'bytes32',
      'uint256',
      'uint256',
      'uint256',
      'uint256',
      'uint256',
      'bytes32',
    ];


    const values = [
      userOp.sender,
      userOp.nonce,
      ethers.utils.keccak256(userOp.initCode),
      ethers.utils.keccak256(userOp.callData),
      userOp.callGasLimit._hex,
      userOp.verificationGasLimit._hex,
      userOp.preVerificationGas._hex,
      userOp.maxFeePerGas._hex,
      userOp.maxPriorityFeePerGas._hex,
      ethers.utils.keccak256(userOp.paymasterAndData),
    ];

    // Use ethers.js to encode the data
    return ethers.utils.defaultAbiCoder.encode(types, values);
  }


  private getUserOpHash(entryPointAddr: string, chainID: BigNumber, userOp: IUserOperation): string {
    const packedForSignature = ethers.utils.keccak256(this.packForSignature(userOp));


    const encodedData = ethers.utils.defaultAbiCoder.encode(
      ["bytes32", "address", "uint256"],
      [packedForSignature, entryPointAddr, chainID]
  );

    return ethers.utils.keccak256(encodedData);
  }

  async getSignature(
    chainID: BigNumber,
    signer: ethers.Signer,
    entryPointAddr: string,
    userOp: IUserOperation
  ): Promise<string> {

    const userOpHashObj = this.getUserOpHash(entryPointAddr, chainID, userOp);
    console.log("userOpHash:", JSON.stringify(userOpHashObj));
    console.log("userOp")
    console.log(JSON.stringify(userOp))
    // Convert BigNumber to bytes array
    const userOpHash = ethers.utils.arrayify(userOpHashObj);

    // Prefix the hash as per Ethereum signed message format
    const prefixedHash = ethers.utils.keccak256(
      ethers.utils.solidityPack(
        ["string", "bytes"],
        [`\x19Ethereum Signed Message:\n${userOpHash.length}`, userOpHash]
      )
    );

    // Sign the prefixed hash
    const signature = await signer.signMessage(ethers.utils.arrayify(prefixedHash));

    // In ethers.js, the v value is already adjusted in the signature, and the s value is normalized as per Ethereum's requirements

    // console.log(signature)
    return signature;
  }

}
