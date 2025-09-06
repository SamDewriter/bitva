import React from "react";
import { QuickActionCard } from "../components/QuickActionCard";
import { DollarSign, ShoppingCart, Gift, Plane } from "lucide-react";

export default function QuickActions() {
  return (
    <section className="mt-2">
      <h2 className="px-2 sm:px-0 text-[18px] font-semibold text-gray-900">Quick Actions</h2>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <QuickActionCard
          icon={<DollarSign />}
          title="Sell Crypto"
          blurb="Instantly sell your cryptocurrency holdings for fiat currency."
        />
        <QuickActionCard
          icon={<ShoppingCart />}
          title="Buy Crypto"
          blurb="Purchase various cryptocurrencies with ease and competitive rates."
        />
        <QuickActionCard
          icon={<Gift />}
          title="Trade Giftcard"
          blurb="Exchange your unused gift cards for crypto or cash."
        />
        <QuickActionCard
          icon={<Plane />}
          title="Book Flight"
          blurb="Book flights globally using your crypto or other funds."
        />
      </div>
    </section>
  );
}
