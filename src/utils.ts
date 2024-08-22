import { BigInt as ProtoBigInt } from 'blndgs-model';
import { ethers } from 'ethers';
/**
 * Converts a number or bigint into a ProtoBigInt, suitable for serialization and transport in network requests.
 *
 * @param value The numerical value to convert. Must be a positive non-zero integer.
 * @returns A ProtoBigInt instance representing the provided value.
 * @throws Error if the provided value is zero or negative.
 */
export function toBigInt(value: ethers.BigNumber | number): ProtoBigInt {
  // Convert all inputs to BigNumber to simplify handling inside the function
  const bigNumberValue = ethers.BigNumber.isBigNumber(value) ? value : ethers.BigNumber.from(value);

  let hexString = bigNumberValue.toHexString().substring(2); // remove the '0x' prefix
  hexString = hexString.length % 2 !== 0 ? '0' + hexString : hexString; // pad if necessary

  const byteArray = ethers.utils.arrayify('0x' + hexString); // create a Uint8Array
  const protoBigInt = new ProtoBigInt();
  protoBigInt.value = byteArray;
  return protoBigInt;
}
