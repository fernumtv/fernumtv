/**
 * Privacy-friendly cookieless event tracking (Plausible Analytics compatible)
 * Zero cookies, zero personal tracking, fully GDPR/CCPA compliant.
 */

declare global {
  interface Window {
    plausible?: (eventName: string, options?: { props?: Record<string, any> }) => void;
  }
}

export function trackEvent(eventName: string, props?: Record<string, any>) {
  if (typeof window === "undefined") return;

  try {
    if (typeof window.plausible === "function") {
      window.plausible(eventName, { props });
    }
    // Also dispatch custom event for testing / observation
    window.dispatchEvent(
      new CustomEvent("fernum-event", {
        detail: { eventName, props, timestamp: Date.now() },
      })
    );
  } catch {}
}
