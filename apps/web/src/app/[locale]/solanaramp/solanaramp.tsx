"use client";

import RampLayout from "@/components/ramps/RampsLayout";
import {
  rampData,
  fiatAssets,
  countries,
  paymentRails,
} from "@/data/ramps/ramps-data";

export function SolanarampPage() {
  return (
    <RampLayout
      data={rampData}
      fiatAssetsOptions={fiatAssets}
      countryOptions={countries}
      paymentRailsOptions={paymentRails}
    />
  );
}
