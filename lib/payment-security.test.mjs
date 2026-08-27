import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { formatPaymentDeadline, isSafePaymentRedirect } from "./payment-security.mjs";

describe("isSafePaymentRedirect", () => {
  it("allows Xendit HTTPS hosts", () => {
    assert.equal(isSafePaymentRedirect("https://checkout.xendit.co/web/invoice-id"), true);
    assert.equal(isSafePaymentRedirect("https://xendit.co/payment"), true);
  });

  it("blocks arbitrary HTTPS, HTTP, and malformed URLs", () => {
    assert.equal(isSafePaymentRedirect("https://example.com/payment"), false);
    assert.equal(isSafePaymentRedirect("http://checkout.xendit.co/web/invoice-id"), false);
    assert.equal(isSafePaymentRedirect("not-a-url"), false);
  });
});

describe("formatPaymentDeadline", () => {
  it("formats a valid deadline and ignores invalid values", () => {
    assert.match(formatPaymentDeadline("2026-08-27T07:30:00.000Z"), /2026/);
    assert.equal(formatPaymentDeadline("invalid"), "");
  });
});
