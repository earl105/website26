import { useEffect, useState, type RefObject } from "react";

/* Comic speech bubble that pops over the Contact headshot on desktop. Add as
many strings as you like to SPEECH_BUBBLE_TEXTS and they'll be displayed one at
a time, in order. Flip SHOW_SPEECH_BUBBLE to `false` to hide it entirely.
Sequence starts once when the trigger element first scrolls into view. Styling
lives in index.css under `.speech-bubble`.
*/
const SHOW_SPEECH_BUBBLE = true;

/* A message is either a plain string (uses the default timings below) or an
 object that overrides any of the timings for that message only:
   delayMs    - wait before this message appears, replacing the default
                pre-message delay (initial delay when it's first in the
                sequence, otherwise the gap left by the previous message)
   durationMs - how long this message stays up
   gapMs      - blank time after this message before the next one appears
*/
type SpeechBubbleMessage = {
  text: string;
  delayMs?: number;
  durationMs?: number;
  gapMs?: number;
};

const SPEECH_BUBBLE_TEXTS: (string | SpeechBubbleMessage)[] = [
  { text: "Hire me!", durationMs: 10000},
  { text: "Hello World!", delayMs: 2000 },
  { text: "It works on my machine!"},
  { text: "TODO: Add more messages"},
  { text: "Go on, email me", durationMs: 6000},
  { text: "Wait, I'm goated", delayMs: 10000 },
  { text: "You're still here?", delayMs: 20000 },
  { text: "Last message, I promise", delayMs: 30000, durationMs: 8000 },

];
// If true, only the first message in SPEECH_BUBBLE_TEXTS is shown and the rest are ignored.
const SPEECH_BUBBLE_FIRST_ONLY = false;
/* If true, a single message is picked at random from SPEECH_BUBBLE_TEXTS and
 shown instead of the whole sequence. Takes precedence over
 SPEECH_BUBBLE_FIRST_ONLY; a fresh message is picked on each loop.
*/
const SPEECH_BUBBLE_RANDOM = false;
/* If true, the sequence restarts from the first message after the last one's
 gap instead of staying hidden once all messages have been shown. Applies to
 the single-message modes too, which just repeat that one message.
*/
const SPEECH_BUBBLE_LOOP = true;
/* Blank time between one full pass through the queue and the restart of the
 next (ms). Only used when SPEECH_BUBBLE_LOOP is true, and it takes over from
 the last message's gap and the first message's delay so the pause between
 cycles is controlled here alone.
*/
const SPEECH_BUBBLE_LOOP_DELAY_MS = 15000;
// How long to wait after the section comes into view before showing the first message (ms).
const SPEECH_BUBBLE_DELAY_MS = 1000;
// How long each message stays up before fading out (ms).
const SPEECH_BUBBLE_MS = 4000;
// How long the bubble stays blank between messages (ms).
const SPEECH_BUBBLE_GAP_MS = 3000;

type SpeechBubbleProps = {
  /** Element whose scrolling into view starts the sequence — usually the
   * enclosing section. Position the bubble by making its parent `relative`. */
  triggerRef: RefObject<HTMLElement | null>;
};

/**
 * Self-contained message sequencer: watches `triggerRef`, then runs the queue
 * above once per page load (or forever, with SPEECH_BUBBLE_LOOP). All timing
 * and content is configured by the constants in this file.
 */
export default function SpeechBubble({ triggerRef }: SpeechBubbleProps) {
  const [bubbleText, setBubbleText] = useState<string | null>(null);
  const [bubbleVisible, setBubbleVisible] = useState(false);

  /* Show the bubble messages in sequence the first time the trigger element
   scrolls into view: each message displays for its duration, then a blank
   gap before the next one. Timings come from the per-message overrides when
   present and the SPEECH_BUBBLE_*_MS defaults otherwise. Fires at most once
   per page load; loops back to the first message if SPEECH_BUBBLE_LOOP is
   true, otherwise stays hidden once all messages have been shown. The
   random/first-only flags collapse the queue down to a single message.
   */
  useEffect(() => {
    if (!SHOW_SPEECH_BUBBLE || SPEECH_BUBBLE_TEXTS.length === 0) return;
    const el = triggerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    let timer: ReturnType<typeof setTimeout>;

    const normalize = (message: string | SpeechBubbleMessage): SpeechBubbleMessage =>
      typeof message === "string" ? { text: message } : message;

    // Messages for one cycle. Re-evaluated per cycle so the random mode picks a new message each time the sequence loops.
    const cycleMessages = (): SpeechBubbleMessage[] => {
      if (SPEECH_BUBBLE_RANDOM) {
        const i = Math.floor(Math.random() * SPEECH_BUBBLE_TEXTS.length);
        return [normalize(SPEECH_BUBBLE_TEXTS[i])];
      }
      if (SPEECH_BUBBLE_FIRST_ONLY) return [normalize(SPEECH_BUBBLE_TEXTS[0])];
      return SPEECH_BUBBLE_TEXTS.map(normalize);
    };

    let messages = cycleMessages();

    const showMessage = (index: number) => {
      const message = messages[index];
      setBubbleText(message.text);
      setBubbleVisible(true);
      timer = setTimeout(() => hideMessage(index), message.durationMs ?? SPEECH_BUBBLE_MS);
    };

    const hideMessage = (index: number) => {
      setBubbleVisible(false);
      const gap = messages[index].gapMs ?? SPEECH_BUBBLE_GAP_MS;
      const next = index + 1;
      if (next < messages.length) {
        timer = setTimeout(() => showMessage(next), messages[next].delayMs ?? gap);
      } else if (SPEECH_BUBBLE_LOOP) {
        // Between-cycle pause is SPEECH_BUBBLE_LOOP_DELAY_MS alone, so a first message's delay override stays a one-time, page-load thing.
        messages = cycleMessages();
        timer = setTimeout(() => showMessage(0), SPEECH_BUBBLE_LOOP_DELAY_MS);
      }
    };

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            timer = setTimeout(
              () => showMessage(0),
              messages[0].delayMs ?? SPEECH_BUBBLE_DELAY_MS
            );
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
  }, [triggerRef]);

  if (!SHOW_SPEECH_BUBBLE) return null;

  /* Mounted from the start (empty and fully transparent) so the first message
     animates in: the browser needs to have painted the hidden state before
     `is-visible` can transition from it. */
  return (
    <div className={`speech-bubble${bubbleVisible ? ' is-visible' : ''}`} aria-hidden={!bubbleVisible}>
      {bubbleText ?? ""}
    </div>
  );
}
