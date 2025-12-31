import linkedinLogo from "../assets/buttons/linkedinLogo.png";
import githubLogo from "../assets/buttons/githubLogo.png";
import emailLogo from "../assets/buttons/emailLogo.png";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen grid grid-cols-1 md:grid-cols-6 items-center px-8 pt-16 overflow-hidden"
    >
      {/* 3D Laptop Background */}
      {/* <div className="absolute inset-0 z-0">
        <LaptopScene />
      </div> */}

      {/* Left Content */}
      <div className="relative z-10 md:col-start-2 md:col-span-2 flex flex-col items-start">
        <h1 className="text-5xl font-bold text-white">
          Dylan Earl
        </h1>

        <div className="flex gap-2.5 mt-6">
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
    </section>
  )
}
