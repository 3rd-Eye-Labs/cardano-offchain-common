import { Data, OutputDatum } from '@lucid-evolution/lucid';
import { match, P } from 'ts-pattern';

// Generic types for contracts.

export const OutputReferenceSchema = Data.Object({
  txHash: Data.Bytes({ minLength: 32, maxLength: 32 }),
  outputIndex: Data.Integer(),
});

export type OutputReference = Data.Static<typeof OutputReferenceSchema>;
export const OutputReference =
  OutputReferenceSchema as unknown as OutputReference;

export const CredentialSchema = Data.Enum([
  Data.Object({
    PublicKeyCredential: Data.Tuple([Data.Bytes()]),
  }),
  Data.Object({
    ScriptCredential: Data.Tuple([Data.Bytes()]),
  }),
]);
export type CredentialD = Data.Static<typeof CredentialSchema>;
export const CredentialD = CredentialSchema as unknown as CredentialD;

export const StakeCredentialSchema = Data.Enum([
  Data.Object({ Inline: Data.Tuple([CredentialSchema]) }),
  Data.Object({
    Pointer: Data.Tuple([
      Data.Object({
        slotNumber: Data.Integer(),
        transactionIndex: Data.Integer(),
        certificateIndex: Data.Integer(),
      }),
    ]),
  }),
]);

export type StakeCredentialD = Data.Static<typeof StakeCredentialSchema>;
export const StakeCredentialD =
  StakeCredentialSchema as unknown as StakeCredentialD;

export const AddressSchema = Data.Object({
  paymentCredential: CredentialSchema,
  stakeCredential: Data.Nullable(StakeCredentialSchema),
});
export type AddressD = Data.Static<typeof AddressSchema>;
export const AddressD = AddressSchema as unknown as AddressD;

export function serialiseAddressD(a: AddressD): string {
  return Data.to(a, AddressD);
}

export const AssetClassSchema = Data.Object({
  policy_id: Data.Bytes(),
  /** Use the HEX encoding */
  asset_name: Data.Bytes(),
});

export type AssetClass = Data.Static<typeof AssetClassSchema>;
export const AssetClass = AssetClassSchema as unknown as AssetClass;

export const OutputDatumSchema = Data.Enum([
  Data.Literal('NoDatum'),
  Data.Object({ DatumHash: Data.Object({ hash: Data.Bytes() }) }),
  Data.Object({ InlineDatum: Data.Object({ datum: Data.Any() }) }),
]);

export type OutputDatumD = Data.Static<typeof OutputDatumSchema>;
export const OutputDatumD = OutputDatumSchema as unknown as OutputDatumD;

export function outputDToDatum(d: OutputDatumD): OutputDatum | undefined {
  return match(d)
    .returnType<OutputDatum | undefined>()
    .with('NoDatum', () => {
      return undefined;
    })
    .with({ DatumHash: { hash: P.select() } }, (datum) => {
      return { kind: 'hash', value: Data.from(datum) };
    })
    .with({ InlineDatum: { datum: P.select() } }, (datum) => {
      return { kind: 'inline', value: Data.to(datum) };
    })
    .exhaustive();
}

export const RationalSchema = Data.Object({
  num: Data.Integer(),
  den: Data.Integer(),
});

export type Rational = Data.Static<typeof RationalSchema>;
export const Rational = RationalSchema as unknown as Rational;

export function rationalToNum(rational: Rational): number {
  return Number(rational.num) / Number(rational.den);
}
