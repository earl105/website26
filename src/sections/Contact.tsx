import linkedinLogo from "../assets/buttons/linkedinLogo.png";
import githubLogo from "../assets/buttons/githubLogo.png";
import emailLogo from "../assets/buttons/emailLogo.png";
import headshot from "../assets/headshot.jpg";
import { trackEvent } from "../utils/analytics";

export default function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden px-8 pt-0 md:pt-16 flex items-center justify-center" style={{ minHeight: 'calc(var(--vh, 1vh) * 100)' }}>
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

          <div className="col-span-1 p-0 hidden md:flex items-stretch">
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
