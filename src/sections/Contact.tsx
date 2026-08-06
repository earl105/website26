import { useEffect, useRef, useState } from "react";
import linkedinLogo from "../assets/buttons/linkedinLogo.png";
import githubLogo from "../assets/buttons/githubLogo.png";
import emailLogo from "../assets/buttons/emailLogo.png";
import headshot from "../assets/headshot.jpg";
import { trackEvent } from "../utils/analytics";

// Comic speech bubble that pops over the headshot on desktop. Add as many
// strings as you like to SPEECH_BUBBLE_TEXTS and they'll be displayed one at
// a time, in order. Flip SHOW_SPEECH_BUBBLE to `false` to hide it entirely.
// Sequence starts once when the section first scrolls into view.
const SHOW_SPEECH_BUBBLE = true;
const SPEECH_BUBBLE_TEXTS = ["Hire me!"];
// If true, the sequence restarts from the first message after the last one's
// gap instead of staying hidden once all messages have been shown.
const SPEECH_BUBBLE_LOOP = false;
// How long to wait after the section comes into view before showing the first message (ms).
const SPEECH_BUBBLE_DELAY_MS = 1000;
// How long each message stays up before fading out (ms).
const SPEECH_BUBBLE_MS = 4000;
// How long the bubble stays blank between messages (ms).
const SPEECH_BUBBLE_GAP_MS = 1000;

export default function Contact() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [bubbleIndex, setBubbleIndex] = useState(-1);
  const [bubbleVisible, setBubbleVisible] = useState(false);

  // Show the bubble messages in sequence the first time the Contact section
  // scrolls into view: each message displays for SPEECH_BUBBLE_MS, then a
  // SPEECH_BUBBLE_GAP_MS blank gap before the next one. Fires at most once
  // per page load; loops back to the first message if SPEECH_BUBBLE_LOOP is
  // true, otherwise stays hidden once all messages have been shown.
  useEffect(() => {
    if (!SHOW_SPEECH_BUBBLE || SPEECH_BUBBLE_TEXTS.length === 0) return;
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    let timer: ReturnType<typeof setTimeout>;

    const showMessage = (index: number) => {
      setBubbleIndex(index);
      setBubbleVisible(true);
      timer = setTimeout(() => hideMessage(index), SPEECH_BUBBLE_MS);
    };

    const hideMessage = (index: number) => {
      setBubbleVisible(false);
      const next = index + 1;
      if (next < SPEECH_BUBBLE_TEXTS.length) {
        timer = setTimeout(() => showMessage(next), SPEECH_BUBBLE_GAP_MS);
      } else if (SPEECH_BUBBLE_LOOP) {
        timer = setTimeout(() => showMessage(0), SPEECH_BUBBLE_GAP_MS);
      }
    };

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            timer = setTimeout(() => showMessage(0), SPEECH_BUBBLE_DELAY_MS);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0.4 }
    );

    obs.observe(el);
    return () => {
      obs.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return (
    <section ref={sectionRef} id="contact" className="relative overflow-hidden px-8 pt-0 md:pt-16 flex items-center justify-center" style={{ minHeight: 'calc(var(--vh, 1vh) * 100)' }}>
      {/* Ordered-dither dissolve anchored to the very bottom of the page */}
      <div aria-hidden="true" className="dither pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[28vh]">
        <div className="d-a" />
        <div className="d-b" />
      </div>
      <div className="relative z-10 w-full max-w-4xl rounded-lg glass-surface text-[var(--text)] overflow-hidden transition-transform duration-150 hover:scale-103">
        {/* Title bar */}
        <div className="flex items-center gap-3 px-4 py-2.5 border-b border-white/10">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
          </div>
          <div className="text-xs text-[color:var(--muted-2)] font-mono truncate">
            contact / <span className="text-[color:var(--muted)]">get-in-touch.md</span>
          </div>
        </div>

        <div className="p-6">
        <h2 className="text-xl font-bold ml-4">Contact</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
          <div className="p-4 flex flex-col justify-between">
            <div>
              <p className="mt-0">
                I am always open to discussing new opportunities, projects, or collaborations.
The best way to reach me is via email.
You can also find (some of) my work on GitHub and connect with me on LinkedIn.
I look forward to hearing from you.
 </p>

              <h3 className="font-semibold mt-4">Get in touch</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">Email: earl.105@osu.edu</p>
              <p className="mt-1 text-sm text-[var(--muted)]">Phone: (330) 690-2393</p>

              <div className="flex gap-2.5 mt-3">
                <a
                  href="https://www.linkedin.com/in/dylanearl/"
                  onClick={() => trackEvent('contact_click', { platform: 'linkedin' })}
                  className="social-button transform hover:scale-105 transition-transform duration-150"
                >
                  <img src={linkedinLogo} alt="LinkedIn" className="w-10 h-auto" />
                </a>

                <a
                  href="https://github.com/earl105"
                  onClick={() => trackEvent('contact_click', { platform: 'github' })}
                  className="social-button transform hover:scale-105 transition-transform duration-150"
                >
                  <img src={githubLogo} alt="GitHub" className="w-10 h-auto" />
                </a>

                <a
                  href="mailto:earl.105@osu.edu"
                  onClick={() => trackEvent('contact_click', { platform: 'email' })}
                  className="social-button transform hover:scale-105 transition-transform duration-150"
                >
                  <img src={emailLogo} alt="Email" className="w-10 h-auto" />
                </a>
              </div>
            </div>
          </div>

          <div className="col-span-1 p-0 hidden md:flex items-stretch relative">
            {SHOW_SPEECH_BUBBLE && bubbleIndex >= 0 && (
              <div className={`speech-bubble${bubbleVisible ? ' is-visible' : ''}`} aria-hidden={!bubbleVisible}>
                {SPEECH_BUBBLE_TEXTS[bubbleIndex]}
              </div>
            )}
            <div className="w-full h-full bg-[var(--muted)] flex items-center justify-center text-[var(--text)] rounded-lg overflow-hidden">
              <img src={headshot} alt="Headshot" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Subtle admin entry — not advertised; real access is gated server-side. */}
        <div className="mt-4 text-right">
          <a href="/admin" className="text-[10px] text-[color:var(--muted-2)] opacity-40 hover:opacity-80 transition-opacity">
            admin
          </a>
        </div>
        </div>
      </div>
    </section>
  );
}
