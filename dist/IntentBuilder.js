"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IntentBuilder = void 0;
const ethers_1 = require("ethers");
const Constants_1 = require("./Constants");
const userop_1 = require("userop");
class IntentBuilder {
    getSender(signer, salt = '0') {
        return __awaiter(this, void 0, void 0, function* () {
            const simpleAccount = yield userop_1.Presets.Builder.SimpleAccount.init(signer, Constants_1.rpcBundlerUrl, {
                factory: Constants_1.factoryAddr,
                salt: salt,
            });
            const sender = simpleAccount.getSender();
            return sender;
        });
    }
    execute(intents, signer, nodeUrl, salt = '0') {
        return __awaiter(this, void 0, void 0, function* () {
            const simpleAccount = yield userop_1.Presets.Builder.SimpleAccount.init(signer, Constants_1.rpcBundlerUrl, {
                factory: Constants_1.factoryAddr,
                salt: salt,
            });
            let ownerAddress = yield signer.getAddress();
            ownerAddress = ownerAddress.substring(2, ownerAddress.length); //remove 0x value
            const sender = simpleAccount.getSender();
            const intent = ethers_1.ethers.utils.toUtf8Bytes(JSON.stringify(intents));
            const nonce = yield this.getNonce(sender, nodeUrl);
            const initCode = yield this.getInitCode(ownerAddress, sender, nodeUrl);
            const builder = new userop_1.UserOperationBuilder()
                .useDefaults({ sender })
                .setCallData(intent)
                .setPreVerificationGas('0x493E0')
                .setMaxFeePerGas('0')
                .setMaxPriorityFeePerGas('0')
                .setVerificationGasLimit('0x493E0')
                .setCallGasLimit('0xC3500')
                .setNonce(nonce)
                .setInitCode(initCode);
            const signature = yield this.getSignature(signer, builder);
            builder.setSignature(signature);
            const client = yield userop_1.Client.init(Constants_1.rpcBundlerUrl);
            const res = yield client.sendUserOperation(builder, {
                onBuild: op => console.log('Signed UserOperation:', op),
            });
            console.log(`UserOpHash: ${res.userOpHash}`);
            console.log('Waiting for transaction...');
        });
    }
    getInitCode(ownerAddress, sender, nodeUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = new ethers_1.ethers.providers.JsonRpcProvider(nodeUrl);
            const code = yield provider.getCode(sender);
            return code !== '0x'
                ? '0x'
                : `${Constants_1.factoryAddr}5fbfb9cf000000000000000000000000${ownerAddress}0000000000000000000000000000000000000000000000000000000000000000`;
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getSignature(signer, builder) {
        return __awaiter(this, void 0, void 0, function* () {
            const packedData = ethers_1.ethers.utils.defaultAbiCoder.encode(['address', 'uint256', 'bytes32', 'bytes32', 'uint256', 'uint256', 'uint256', 'uint256', 'uint256', 'bytes32'], [
                builder.getSender(),
                builder.getNonce(),
                ethers_1.ethers.utils.keccak256(builder.getInitCode()),
                ethers_1.ethers.utils.keccak256(builder.getCallData()),
                builder.getCallGasLimit(),
                builder.getVerificationGasLimit(),
                builder.getPreVerificationGas(),
                builder.getMaxFeePerGas(),
                builder.getMaxPriorityFeePerGas(),
                ethers_1.ethers.utils.keccak256(builder.getPaymasterAndData()),
            ]);
            const enc = ethers_1.ethers.utils.defaultAbiCoder.encode(['bytes32', 'address', 'uint256'], [ethers_1.ethers.utils.keccak256(packedData), Constants_1.entryPointAddr, Constants_1.chainID]);
            const userOpHash = ethers_1.ethers.utils.keccak256(enc);
            const signature = yield signer.signMessage(ethers_1.ethers.utils.arrayify(userOpHash));
            return signature;
        });
    }
    getNonce(sender, nodeUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const provider = new ethers_1.ethers.providers.JsonRpcProvider(nodeUrl);
            const abi = [
                {
                    inputs: [
                        {
                            internalType: 'address',
                            name: 'sender',
                            type: 'address',
                        },
                        {
                            internalType: 'uint192',
                            name: 'key',
                            type: 'uint192',
                        },
                    ],
                    name: 'getNonce',
                    outputs: [
                        {
                            internalType: 'uint256',
                            name: 'nonce',
                            type: 'uint256',
                        },
                    ],
                    stateMutability: 'view',
                    type: 'function',
                },
            ];
            // Create a contract instance
            const contract = new ethers_1.ethers.Contract(Constants_1.entryPointAddr, abi, provider);
            try {
                const nonce = yield contract.getNonce(sender, '0');
                console.log('Nonce:', nonce.toString());
                return nonce.toString();
            }
            catch (error) {
                console.error('Error getting nonce:', error);
            }
        });
    }
}
exports.IntentBuilder = IntentBuilder;
