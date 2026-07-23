"use client";

import Image from "next/image";
import type { CheckoutOption } from "@/lib/types";
import { paymentMethodLogo } from "@/lib/payment-methods";

type PaymentMethodCardProps = {
  active: boolean;
  method: CheckoutOption;
  onSelect: () => void;
};

export function PaymentMethodCard({ active, method, onSelect }: PaymentMethodCardProps) {
  return (
    <button
      aria-pressed={active}
      className={active ? "payment-method-card active" : "payment-method-card"}
      onClick={onSelect}
      type="button"
    >
      <Image alt={`${method.label} logo`} height={36} src={paymentMethodLogo(method)} width={72} />
      <span>
        <strong>{method.label}</strong>
        <small>{method.description}</small>
      </span>
    </button>
  );
}
