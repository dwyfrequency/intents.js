import { BytesLike, ethers } from 'ethers';
import { ENTRY_POINT, FACTORY, NODE_URL } from './constants';
import { Presets } from 'userop';
import { BigInt as ProtoBigInt } from 'blndgs-model/dist/asset_pb';

export async function getInitCode(nonce: string, signer: ethers.Signer) {
  let ownerAddress = await signer.getAddress();
  // console.log('ownerAddress ' + ownerAddress);
  ownerAddress = ownerAddress.substring(2); // Remove 0x value
  // console.log('nonce ' + nonce);
  return nonce !== '0'
    ? '0x'
    : `${FACTORY}5fbfb9cf000000000000000000000000${ownerAddress}0000000000000000000000000000000000000000000000000000000000000000`;
}

export async function getNonce(sender: string): Promise<string> {
  const provider = new ethers.providers.JsonRpcProvider(NODE_URL);
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

  const contract = new ethers.Contract(ENTRY_POINT, abi, provider);

  try {
    const nonce = await contract.getNonce(sender, '0');
    // console.log('Nonce:', nonce.toString());
    return nonce.toString();
  } catch (error) {
    console.error('Error getting nonce:', error);
    throw error;
  }
}

export async function getSender(signer: ethers.Signer, bundlerUrl: string, salt: BytesLike = '0'): Promise<string> {
  const simpleAccount = await Presets.Builder.SimpleAccount.init(signer, bundlerUrl, {
    factory: FACTORY,
    salt: salt,
  });
  return simpleAccount.getSender();
}

export function toBigInt(value: number | bigint): ProtoBigInt {
  if (value <= 0) {
    throw new Error('Amount cannot be zero or negative');
  }
  // Convert number/bigint to a hexadecimal string
  const hexString = value.toString(16);
  // Ensure the hex string length is even
  const paddedHexString = hexString.length % 2 === 0 ? hexString : '0' + hexString;
  // Convert hex string to Uint8Array
  const byteArray = new Uint8Array(paddedHexString.length / 2);
  for (let i = 0; i < byteArray.length; i++) {
    byteArray[i] = parseInt(paddedHexString.substring(2 * i, 2 * i + 2), 16);
  }
  // Create the ProtoBigInt message
  const protoBigInt = new ProtoBigInt();
  protoBigInt.value = byteArray;
  return protoBigInt;
}
