import type { CheckoutOption } from "./types";

const paymentLogos: Record<string, string> = {
  ALFAMART: "/payment-methods/retail.svg",
  BCA: "/payment-methods/bca.svg",
  BNI: "/payment-methods/bni.svg",
  BRI: "/payment-methods/bri.svg",
  CREDIT_CARD: "/payment-methods/card.svg",
  MANDIRI: "/payment-methods/mandiri.svg",
  MANUAL_TRANSFER: "/payment-methods/bank-transfer.svg",
  MANUAL_BANK_TRANSFER: "/payment-methods/bank-transfer.svg",
  QRIS: "/payment-methods/qris.svg",
  OVO: "/payment-methods/ovo.svg"
};

export function paymentMethodLogo(method: CheckoutOption) {
  return paymentLogos[method.channel ?? ""] ?? paymentLogos[method.id.toUpperCase()] ?? "/payment-methods/bank-transfer.svg";
}
