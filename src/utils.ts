import { BigInt as ProtoBigInt } from 'blndgs-model/dist/asset_pb';

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
