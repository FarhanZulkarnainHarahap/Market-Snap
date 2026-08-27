/**
 * Only Xendit's HTTPS checkout hosts may receive customer payment redirects.
 *
 * @param {string | null | undefined} value
 * @returns {value is string}
 */
export function isSafePaymentRedirect(value) {
  if (!value) return false;
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    return url.protocol === "https:" && (host === "xendit.co" || host.endsWith(".xendit.co"));
  } catch {
    return false;
  }
}

/**
 * @param {string | null | undefined} value
 * @returns {string}
 */
export function formatPaymentDeadline(value) {
  if (!value) return "";
  const deadline = new Date(value);
  if (Number.isNaN(deadline.getTime())) return "";
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(deadline);
}
