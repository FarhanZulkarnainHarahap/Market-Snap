import type { CheckoutOption } from "./types";

const paymentLogos: Record<string, string> = {
  ALFAMART: "/payment-methods/retail.svg",
  alfamart: "/payment-methods/retail.svg",
  bca_va: "/payment-methods/bca.svg",
  BCA: "/payment-methods/bca.svg",
  bni_va: "/payment-methods/bni.svg",
  BNI: "/payment-methods/bni.svg",
  bri_va: "/payment-methods/bri.svg",
  BRI: "/payment-methods/bri.svg",
  credit_card: "/payment-methods/card.svg",
  CREDIT_CARD: "/payment-methods/card.svg",
  echannel: "/payment-methods/mandiri.svg",
  gopay: "/payment-methods/gopay.svg",
  MANDIRI: "/payment-methods/mandiri.svg",
  MANUAL_TRANSFER: "/payment-methods/bank-transfer.svg",
  MANUAL_BANK_TRANSFER: "/payment-methods/bank-transfer.svg",
  MIDTRANS: "/payment-methods/midtrans.svg",
  midtrans: "/payment-methods/midtrans.svg",
  qris: "/payment-methods/qris.svg",
  QRIS: "/payment-methods/qris.svg",
  OVO: "/payment-methods/ovo.svg"
};

export function paymentMethodLogo(method: CheckoutOption) {
  return paymentLogos[method.channel ?? ""] ?? paymentLogos[method.id.toUpperCase()] ?? "/payment-methods/bank-transfer.svg";
}
