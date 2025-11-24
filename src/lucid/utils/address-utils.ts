import {
  Credential,
  credentialToAddress,
  getAddressDetails,
  Network,
} from '@lucid-evolution/lucid';
import { match, P } from 'ts-pattern';
import { AddressD, CredentialD } from '../types.js';

export function addressFromBech32(address: string): AddressD {
  const details = getAddressDetails(address);

  const matchCred = (cred: Credential): CredentialD => {
    return match(cred)
      .returnType<CredentialD>()
      .with({ type: 'Key', hash: P.select() }, (pkh) => {
        return {
          PublicKeyCredential: [pkh],
        };
      })
      .with({ type: 'Script', hash: P.select() }, (scriptHash) => ({
        ScriptCredential: [scriptHash],
      }))
      .exhaustive();
  };

  return match(details)
    .returnType<AddressD>()
    .with(
      { paymentCredential: P.nullish },
      { type: P.not(P.union('Base', 'Enterprise')) },
      (_) => {
        throw new Error('Invalid address provided');
      },
    )
    .narrow()
    .otherwise((details) => ({
      paymentCredential: matchCred(details.paymentCredential),
      stakeCredential: details.stakeCredential
        ? {
            Inline: [matchCred(details.stakeCredential)],
          }
        : null,
    }));
}

export function addressToBech32(address: AddressD, network: Network): string {
  const matchCred = (cred: CredentialD) =>
    match(cred)
      .returnType<Credential>()
      .with({ PublicKeyCredential: [P.select()] }, (pkh) => {
        return { type: 'Key', hash: pkh };
      })
      .with({ ScriptCredential: [P.select()] }, (scriptCred) => {
        return { type: 'Script', hash: scriptCred };
      })
      .exhaustive();

  const stakeCred: Credential | undefined = match(address.stakeCredential)
    .returnType<Credential | undefined>()
    .with(P.nullish, () => undefined)
    .with({ Inline: [P.select()] }, (cred) => matchCred(cred))
    .otherwise(() => {
      throw new Error('Unexpected stake credential format.');
    });

  const cred: Credential = matchCred(address.paymentCredential);

  return credentialToAddress(network, cred, stakeCred);
}
