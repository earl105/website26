import linkedinLogo from "../assets/buttons/linkedinLogo.png";
import githubLogo from "../assets/buttons/githubLogo.png";
import emailLogo from "../assets/buttons/emailLogo.png";
import headshot from "../assets/headshot.jpg";

export default function Contact() {
  return (
    <section id="contact" className="min-h-screen px-8 pt-0 md:pt-16 flex items-center justify-center">
      <div className="w-full max-w-4xl rounded-lg bg-[var(--card)] text-[var(--text)] p-6 shadow-md">
        <h2 className="text-xl font-bold ml-4">Contact</h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
          <div className="p-4 flex flex-col justify-between">
            <div>
              <p className="mt-0">
                I am always open to discussing new opportunities, projects, or collaborations.
The best way to reach me is via email.
You can also find my work on GitHub and connect with me on LinkedIn.
I look forward to hearing from you.
 </p>

              <h3 className="font-semibold mt-4">Get in touch</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">Email: earl.105@osu.edu</p>
              <p className="mt-1 text-sm text-[var(--muted)]">Phone: (330) 690-2393</p>

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

          <div className="col-span-1 p-0 hidden md:flex items-stretch">
            <div className="w-full h-full bg-[var(--muted)] flex items-center justify-center text-[var(--text)] rounded-lg overflow-hidden">
              <img src={headshot} alt="Headshot" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
