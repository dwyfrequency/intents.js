import { ethers, BytesLike, BigNumber } from 'ethers';
import { Intent } from './InterfaceIntent';
import { rpcBundlerUrl, chainID, entryPointAddr, factoryAddr } from './Constants';
import { Presets, Client, UserOperationBuilder, IUserOperation } from "userop";


export class IntentBuilder {



  async execute(signingKey: string, intents: Intent[], salt: BytesLike = "0"): Promise<void> {

    const signer = new ethers.Wallet(signingKey);
    let simpleAccount = await Presets.Builder.SimpleAccount.init(
      signer, rpcBundlerUrl, { factory: factoryAddr }
    );
    const sender = simpleAccount.getSender();

    const client = await Client.init(rpcBundlerUrl);
    const intent = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(JSON.stringify({ Intents: intents })));

    const builder = new UserOperationBuilder().useDefaults({ sender })
      .setCallData(intent)
      .setPreVerificationGas("0x493e0")
      .setMaxFeePerGas("0x493e0")


    const signature = await this.getSignature(chainID, signingKey, entryPointAddr, builder.getOp())

    builder.setSignature(signature);

    await client.sendUserOperation(builder);


  }

  packForSignature(userOp: any): string {
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

    // Prepare the values, converting BigNumber properties
    const values = [
      userOp.sender,
      BigNumber.from(userOp.nonce.hex || "0"),
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes(userOp.initCode)),
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes(userOp.callData)),
      BigNumber.from(userOp.callGasLimit.hex || "0"),
      BigNumber.from(userOp.verificationGasLimit.hex || "0"),
      BigNumber.from(userOp.preVerificationGas.hex || "0"),
      BigNumber.from(userOp.maxFeePerGas.hex || "0"),
      BigNumber.from(userOp.maxPriorityFeePerGas.hex || "0"),
      ethers.utils.keccak256(ethers.utils.toUtf8Bytes(userOp.paymasterAndData)),
    ];

    // Use ethers.js to encode the data
    return ethers.utils.defaultAbiCoder.encode(types, values);
  }


  getUserOpHash(entryPointAddr: string, chainID: BigNumber, userOp: IUserOperation): string {
    const packedForSignature = this.packForSignature(userOp);
    const packedData = ethers.utils.solidityPack(
      ['bytes', 'bytes32', 'bytes32'],
      [packedForSignature, ethers.utils.zeroPad(entryPointAddr, 32), ethers.utils.zeroPad(chainID.toHexString(), 32)]
    );

    return ethers.utils.keccak256(packedData);
  }

  async getSignature(
    chainID: BigNumber,
    privateKey: string,
    entryPointAddr: string,
    userOp: IUserOperation
  ): Promise<string> {
    const provider = new ethers.providers.JsonRpcProvider(); // Use appropriate provider
    const wallet = new ethers.Wallet(privateKey, provider);


    const userOpHashObj = this.getUserOpHash(entryPointAddr, chainID, userOp);
    console.log("userOpHash:", JSON.stringify(userOpHashObj));
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
    const signature = await wallet.signMessage(ethers.utils.arrayify(prefixedHash));

    // In ethers.js, the v value is already adjusted in the signature, and the s value is normalized as per Ethereum's requirements
    return signature;
  }

}
