import { Core } from '@evolution-sdk/evolution';

const CredentialSchema = Core.TSchema.Union(
  Core.TSchema.Struct(
    { PublicKeyCredential: Core.TSchema.ByteArray },
    { flatInUnion: true },
  ),
  Core.TSchema.Struct(
    { ScriptCredential: Core.TSchema.ByteArray },
    { flatInUnion: true },
  ),
);

export type CredentialD = typeof CredentialSchema.Type;

export const StakeCredentialSchema = Core.TSchema.Union(
  Core.TSchema.Struct({ Inline: CredentialSchema }, { flatInUnion: true }),
  Core.TSchema.Struct(
    {
      Pointer: Core.TSchema.Struct({
        slotNumber: Core.TSchema.Integer,
        transactionIndex: Core.TSchema.Integer,
        certificateIndex: Core.TSchema.Integer,
      }),
    },
    { flatInUnion: true },
  ),
);

export type StakeCredentialD = typeof StakeCredentialSchema.Type;

export const AddressSchema = Core.TSchema.Struct({
  paymentCredential: CredentialSchema,
  stakeCredential: Core.TSchema.NullOr(StakeCredentialSchema),
});

export type AddressD = typeof AddressSchema.Type;

export function serialiseAddressD(a: AddressD): string {
  return Core.Data.withSchema(AddressSchema).toCBORHex(a);
}
