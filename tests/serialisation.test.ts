import { describe, expect, it } from 'vitest';
import { serialiseAddressD } from '../src/types/common.js';

describe('Generic types serialisation', () => {
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
});
