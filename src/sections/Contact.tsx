import linkedinLogo from "../assets/buttons/linkedinLogo.png";
import githubLogo from "../assets/buttons/githubLogo.png";
import emailLogo from "../assets/buttons/emailLogo.png";

export default function Contact() {
  return (
    <section id="contact" className="min-h-screen px-8 pt-0 md:pt-16 flex items-center justify-center">
      <div className="w-full max-w-4xl rounded-lg bg-[var(--card)] text-[var(--text)] p-6 shadow-md">
        <h2 className="text-xl font-bold">Contact</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
          <div className="p-4 flex flex-col justify-between">
            <div>
              <p className="mt-0">
                Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat
              </p>

              <h3 className="font-semibold mt-4">Get in touch</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">Email: example@example.com</p>
              <p className="mt-1 text-sm text-[var(--muted)]">Phone: (000) 000-0000</p>

              <h3 className="font-semibold mt-4">Socials</h3>
              <div className="flex gap-2.5 mt-3">
                <a
                  href="https://www.linkedin.com/in/dylanearl/"
                  className="social-button transform hover:scale-105 transition-transform duration-150"
                >
                  <img src={linkedinLogo} alt="LinkedIn" className="w-10 h-auto" />
                </a>

                <a
                  href="https://github.com/earl105"
                  className="social-button transform hover:scale-105 transition-transform duration-150"
                >
                  <img src={githubLogo} alt="GitHub" className="w-10 h-auto" />
                </a>

                <a
                  href="mailto:earl.105@osu.edu"
                  className="social-button transform hover:scale-105 transition-transform duration-150"
                >
                  <img src={emailLogo} alt="Email" className="w-10 h-auto" />
                </a>
              </div>
            </div>
          </div>

          <div className="col-span-1 p-0 flex items-stretch">
            <div
              aria-label="Headshot placeholder"
              className="w-full h-full bg-[var(--muted)] flex items-center justify-center text-[var(--text)]"
            >
              <span className="text-sm md:text-base font-medium">Headshot Placeholder</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
