import { Assets, toUnit, Unit } from '@lucid-evolution/lucid';
import { AssetClass } from '../types/common';

export function mkLovelacesOf(amount: bigint): Assets {
  return { lovelace: amount };
}

export function assetClassToUnit(ac: AssetClass): Unit {
  return toUnit(ac.policy_id, ac.asset_name);
}

export function isSameAssetClass(ac1: AssetClass, ac2: AssetClass): boolean {
  return ac1.asset_name === ac2.asset_name && ac1.policy_id === ac2.policy_id;
}

export function mkAssetsOf(assetClass: AssetClass, amount: bigint): Assets {
  return {
    [assetClassToUnit(assetClass)]: amount,
  };
}

export function lovelacesAmt(assets: Assets): bigint {
  return assets.lovelace ?? 0n;
}

export function assetClassValueOf(
  assets: Assets,
  assetClass: AssetClass,
): bigint {
  return assets[assetClassToUnit(assetClass)] ?? 0n;
}

export function negateAssets(assets: Assets): Assets {
  return Object.fromEntries(
    Object.entries(assets).map(([asset, amt]) => [asset, -amt]),
  );
}

export function isAssetsZero(assets: Assets): boolean {
  return Object.entries(assets).every(([_, amt]) => amt === 0n);
}
