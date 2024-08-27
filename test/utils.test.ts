import { ethers } from 'ethers';
import { BigInt as ProtoBigInt } from 'blndgs-model';
import { toBigInt, floatToWei, weiToFloat, tokenToFloat, floatToToken, amountToBigInt } from '../src/utils';

describe('Utility Functions', () => {
  describe('toBigInt', () => {
    it('should convert BigNumber to ProtoBigInt', () => {
      const bigNumber = ethers.BigNumber.from('1000000000000000000');
      const result = toBigInt(bigNumber);
      expect(result).toBeInstanceOf(ProtoBigInt);
      expect(result.value).toEqual(new Uint8Array([13, 224, 182, 179, 167, 100, 0, 0]));
    });

    it('should convert number to ProtoBigInt', () => {
      const result = toBigInt(1000000);
      expect(result).toBeInstanceOf(ProtoBigInt);
      expect(result.value).toEqual(new Uint8Array([15, 66, 64]));
    });

    it('should throw error for negative numbers', () => {
      expect(() => toBigInt(-1)).toThrow();
    });
  });

  describe('floatToWei', () => {
    it('should convert float to Wei', () => {
      const result = floatToWei(1.5);
      expect(result.toString()).toBe('1500000000000000000');
    });

    it('should handle very small numbers', () => {
      const result = floatToWei(0.000000000000000001);
      expect(result.toString()).toBe('1');
    });
  });

  describe('weiToFloat', () => {
    it('should convert Wei to float', () => {
      const wei = ethers.BigNumber.from('1500000000000000000');
      const result = weiToFloat(wei);
      expect(result).toBe(1.5);
    });

    it('should handle very large numbers', () => {
      const wei = ethers.BigNumber.from('1000000000000000000000000000000');
      const result = weiToFloat(wei);
      expect(result).toBe(1000000000000); // 1 trillion ETH
    });
  });

  describe('tokenToFloat', () => {
    it('should convert token amount to float', () => {
      const amount = ethers.BigNumber.from('1500000000');
      const result = tokenToFloat(amount, 6);
      expect(result).toBe(1500);
    });

    it('should handle different decimal places', () => {
      const amount = ethers.BigNumber.from('1500000000000000000');
      const result = tokenToFloat(amount, 18);
      expect(result).toBe(1.5);
    });
  });

  describe('floatToToken', () => {
    it('should convert float to token amount', () => {
      const result = floatToToken(1500, 6);
      expect(result.toString()).toBe('1500000000');
    });

    it('should handle different decimal places', () => {
      const result = floatToToken(1.5, 18);
      expect(result.toString()).toBe('1500000000000000000');
    });
  });

  describe('amountToBigInt', () => {
    it('should convert float amount to ProtoBigInt', () => {
      const result = amountToBigInt(0.1, 18);
      expect(result).toBeInstanceOf(ProtoBigInt);
      // 0.1 ETH in wei is 100000000000000000
      // Due to floating-point precision, we'll allow a small margin of error
      const bigNumberValue = ethers.BigNumber.from(result.value);
      const expectedValue = ethers.BigNumber.from('100000000000000000');
      const difference = bigNumberValue.sub(expectedValue).abs();
      expect(difference.lte(ethers.BigNumber.from(10))).toBe(true);
    });

    it('should handle different decimal places', () => {
      const result = amountToBigInt(100, 6);
      expect(result).toBeInstanceOf(ProtoBigInt);
      // 100 USDC with 6 decimals is 100000000
      const bigNumberValue = ethers.BigNumber.from(result.value);
      expect(bigNumberValue.toString()).toBe('100000000');
    });
  });
});
