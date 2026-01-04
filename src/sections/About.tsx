import osucoeLogo from "../assets/osucoeLogo.png";
import eagleScoutLogo from "../assets/eagleScoutLogo.png";
import TechCarousel from "../components/TechCarousel";

export default function About() {
  return (
    <section id="about" className="min-h-screen px-8 pt-0 md:pt-16 flex flex-col items-center justify-center pb-20 md:pb-0">
      <div className="flex flex-col space-y-6 md:space-y-0 md:grid md:grid-cols-6 md:grid-rows-2 md:gap-4">
        {/* Left: Name block (2x2) */}
        <div className="col-start-1 col-span-2 row-start-1 row-span-2 rounded-lg bg-[var(--card)] text-[var(--text)] p-3 md:p-4 shadow-md hover:shadow-lg transition-shadow transform hover:scale-103 transition-transform duration-200 flex flex-col md:justify-between">
          <h2 className="text-xl font-bold mb-0 md:mb-2">Dylan Earl</h2>
          <ul className="list-disc ml-5">
            <li>Software Developer</li>
            <li>Computer Science and Engineering</li>
            <li>The Ohio State University</li>
            <li>Looking for post-graduation employment</li>
            <li>Eagle Scout</li>
          </ul>

          <img
            src={osucoeLogo}
            alt="The Ohio State University College of Engineering Logo"
            className="w-3/4 max-w-[300px] self-center"
          />
        </div>

        {/* Middle top: Involvement (2x1) - hidden on mobile */}
        <div className="hidden md:block col-start-3 col-span-2 row-start-1 row-span-1 rounded-lg bg-[var(--card)] text-[var(--text)] p-3 md:p-4 shadow-md hover:shadow-lg transition-shadow transform hover:scale-103 transition-transform duration-200">
          <h2 className="text-xl font-bold mb-0 md:mb-2">Involvement</h2>
          <ul className="list-disc ml-5">
            <li>AI Robotics Club</li>
            <li>Block O Club</li>
            <li>Buck-I-Watch Club</li>
            <li>Choose Ohio First @ OSU</li>
          </ul>
        </div>

        {/* Middle bottom left: Location (1x1) */}
        <div className="hidden md:flex md:col-start-3 md:col-span-1 md:row-start-2 md:row-span-1 rounded-lg bg-[var(--card)] text-[var(--text)] p-4 shadow-md items-center justify-center hover:shadow-lg transition-shadow transform hover:scale-103 transition-transform duration-200">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[var(--accent)] mr-2" viewBox="0 0 24 24" fill="white" aria-hidden="true">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
            </svg>
            <span>Columbus, Ohio</span>
          </div>
        </div>

        {/* Middle bottom right: Eagle Scout image (1x1) */}
        <div className="hidden md:flex md:col-start-4 md:col-span-1 md:row-start-2 md:row-span-1 rounded-lg bg-[var(--card)] text-[var(--text)] p-4 shadow-md items-center justify-center hover:shadow-lg transition-shadow transform hover:scale-103 transition-transform duration-200">
          <img src={eagleScoutLogo} alt="Eagle Scout Logo" width={100} />
        </div>

        {/* Right: About Me (2x2) */}
        <div className="col-start-5 col-span-2 row-start-1 row-span-2 rounded-lg bg-[var(--card)] text-[var(--text)] p-3 md:p-4 shadow-md hover:shadow-lg transition-shadow transform hover:scale-103 transition-transform duration-200">
          <h2 className="text-xl font-bold mb-0 md:mb-2">About Me</h2>
          <p className="block md:hidden">
            As a third-year student at The Ohio State University majoring in
            Computer Science and Engineering, I am currently completing a Summer
            2026 internship at CoverMyMeds and am seeking post-graduation job
            opportunities beginning Summer 2027.
          </p>
          <p className="hidden md:block">
            As a third-year student at The Ohio State University majoring in
            Computer Science and Engineering, I am currently completing a Summer
            2026 internship at CoverMyMeds and am seeking post-graduation job
            opportunities beginning Summer 2027.

            I am well-versed in software such as Git, Autodesk Inventor, Fusion
            360, Onshape, and the Arduino IDE. Outside of tech, I enjoy camping,
            kayaking, canoeing, rock climbing, and sharpshooting.
          </p>
        </div>
      </div>
      {/* Show carousel only on md+; hidden on mobile (will be rendered above projects on mobile) */}
      <div className="w-full mt-2 md:mt-6 hidden md:block">
        <TechCarousel speed={"slow"} pauseOnHover />
      </div>
    </section>
  );
}
