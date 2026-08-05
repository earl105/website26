import linkedinLogo from "../assets/buttons/linkedinLogo.png";
import githubLogo from "../assets/buttons/githubLogo.png";
import emailLogo from "../assets/buttons/emailLogo.png";
import LaptopScene from "../components/LaptopScene";
import ScrollCue from "../components/ScrollCue";

// Toggle this to `false` (or comment out) to remove the debug border for deployment
const SHOW_DEBUG_BORDER = false;
export default function Hero() {
  return (
    <section
      id="hero"
      className="relative grid grid-cols-1 md:grid-cols-6 items-center px-8 pt-16 overflow-hidden"
      style={{ minHeight: 'calc(var(--vh, 1vh) * 100)' }}
    >
      {/* 3D Laptop Background */}
      {/* <div className="absolute inset-0 z-0">
        <LaptopScene />
      </div> */}

      {/* Left Content */}
      <div className="relative z-10 md:col-start-2 md:col-span-2 flex flex-col items-center md:items-start">
        <h1 className="hero-name text-5xl md:text-7xl text-white text-center md:text-left hover:scale-105 transition-transform duration-150">
          Dylan Earl
        </h1>

        <div className="flex gap-2.5 mt-6 justify-center md:justify-start">
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

      {/* 3D Laptop Card (constrained) - placed to the right of the left content in column 4 */}
      <div className="relative z-10 -mt-20 md:mt-0 md:col-start-4 md:col-span-2 flex items-center justify-center">
        <div
          className={`relative ${SHOW_DEBUG_BORDER ? 'rounded-xl p-2 border-4 border-dashed border-yellow-400' : ''}`}
        >
          <div
            className="rounded-xl overflow-hidden"
            style={{
              width: 'min(600px, 92vw)',
              height: 'min(600px, 92vw)',
              background: 'var(--bg-alt)'
            }}
          >
            <LaptopScene />
          </div>
        </div>
      </div>

      {/* Low-key "there's more below" cue (CARD-019) */}
      <ScrollCue />
    </section>
  )
}
