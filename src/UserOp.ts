export interface UserOp {
    sender: string; // address
    nonce: bigint; // uint256
    initCode: Uint8Array; // bytes
    callData: Uint8Array; // bytes
    callGasLimit: bigint; // uint256
    verificationGasLimit: bigint; // uint256
    preVerificationGas: bigint; // uint256
    maxFeePerGas: bigint; // uint256
    maxPriorityFeePerGas: bigint; // uint256
    paymasterAndData: Uint8Array; // bytes
    signature: Uint8Array; // bytes
  }
  