import { useEffect, useState } from "react";

const STORAGE_KEY = "dismissMobileLandscapeWarning";

function isLikelyMobile(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  const mobileUA = /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i;
  if (mobileUA.test(ua)) return true;
  // fallback: touch device with small viewport
  // treat widths <= 1024 as mobile/tablet
  if (typeof window !== "undefined") {
    if ((navigator as any).maxTouchPoints > 0 && window.innerWidth <= 1024) return true;
  }
  return false;
}

function isLandscape(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia) {
    try {
      return window.matchMedia("(orientation: landscape)").matches;
    } catch (e) {
      // ignore
    }
  }
  return window.innerWidth > window.innerHeight;
}

export default function MobileLandscapeWarning() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const dismissed = typeof localStorage !== "undefined" && localStorage.getItem(STORAGE_KEY) === "true";
    function update() {
      const show = !dismissed && isLikelyMobile() && isLandscape();
      setVisible(show);
    }

    update();

    const onResize = () => update();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, []);

  function dismiss() {
    try {
      localStorage.setItem(STORAGE_KEY, "true");
    } catch (e) {
      // ignore storage errors
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-[min(92%,640px)] bg-amber-50 dark:bg-amber-900 border border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-100 rounded-md p-3 shadow-lg"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M5.07 19h13.86A2 2 0 0021 17.07V6.93A2 2 0 0019.07 5H4.93A2 2 0 003 6.93v10.14A2 2 0 005.07 19z" />
          </svg>
        </div>
        <div className="flex-1 text-sm leading-6">
          <strong className="block">Display orientation recommended</strong>
          <span>
            This site is not built for landscape on mobile devices. For the best experience, view in portrait
            on mobile, or use landscape on desktop.
          </span>
        </div>
        <div className="flex-shrink-0 ml-2">
          <button
            onClick={dismiss}
            aria-label="Dismiss orientation warning"
            className="inline-flex items-center justify-center rounded-md p-1 hover:bg-amber-200 dark:hover:bg-amber-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
