import { create } from "zustand";

type CheckoutDraft = {
  addressId: string;
  deliveryId: string;
  paymentId: string;
  storeId: string;
  voucherCode: string;
  updateDraft: (draft: Partial<Omit<CheckoutDraft, "updateDraft">>) => void;
};

export const useCheckoutDraftStore = create<CheckoutDraft>((set) => ({
  addressId: "",
  deliveryId: "standard",
  paymentId: "",
  storeId: "",
  voucherCode: "",
  updateDraft: (draft) => set(draft)
}));
