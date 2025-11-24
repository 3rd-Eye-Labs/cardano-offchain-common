import { describe, expect, it } from 'vitest';
import {
  serialiseAddressD,
  serialiseOutputReference,
} from '../src/lucid/types.js';

describe('Generic types serialisation', () => {
  describe('OutputReference', () => {
    it('OutputReference 1', () => {
      expect(
        serialiseOutputReference({
          txHash: '',
          outputIndex: 0n,
        }),
      ).toEqual('d8799f4000ff');
    });
  });

  describe('Address', () => {
    it('Address 1', () => {
      expect(
        serialiseAddressD({
          paymentCredential: { PublicKeyCredential: [''] },
          stakeCredential: null,
        }),
      ).toEqual('d8799fd8799f40ffd87a80ff');
    });

    it('Address 2', () => {
      expect(
        serialiseAddressD({
          paymentCredential: { PublicKeyCredential: [''] },
          stakeCredential: {
            Inline: [{ PublicKeyCredential: [''] }],
          },
        }),
      ).toEqual('d8799fd8799f40ffd8799fd8799fd8799f40ffffffff');
    });

    it('Address 3', () => {
      expect(
        serialiseAddressD({
          paymentCredential: { ScriptCredential: [''] },
          stakeCredential: {
            Inline: [{ PublicKeyCredential: [''] }],
          },
        }),
      ).toEqual('d8799fd87a9f40ffd8799fd8799fd8799f40ffffffff');
    });

    it('Address 4', () => {
      expect(
        serialiseAddressD({
          paymentCredential: { ScriptCredential: [''] },
          stakeCredential: null,
        }),
      ).toEqual('d8799fd87a9f40ffd87a80ff');
    });

    it('Address 5', () => {
      expect(
        serialiseAddressD({
          paymentCredential: { ScriptCredential: [''] },
          stakeCredential: {
            Pointer: [
              { certificateIndex: 0n, slotNumber: 0n, transactionIndex: 0n },
            ],
          },
        }),
      ).toEqual('d8799fd87a9f40ffd8799fd87a9fd8799f000000ffffffff');
    });
  });
});
