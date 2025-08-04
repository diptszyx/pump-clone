"use client";

import { TokenControls } from "./TokenControls";
import { TokenList } from "./TokenList";

export function TokenListingSection() {
  return (
    <div className="pb-8">
      <TokenControls />
      <TokenList />
    </div>
  );
}
