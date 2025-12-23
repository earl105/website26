export default function Hero() {
  return (
    <section id="hero" className="min-h-screen grid grid-cols-1 md:grid-cols-6 items-center px-8 pt-16">
      <div className="md:col-start-2 md:col-span-1 flex flex-col items-start">
        <h1 className="text-5xl font-bold">
          Dylan Earl
        </h1>

        <div className="flex gap-6 mt-6">
          <a href="https://www.linkedin.com/in/dylanearl/" className="social-button transform hover:scale-103 transition-transform duration-150">
            <img src="assets/buttons/linkedinLogo.png" alt="LinkedIn"/>
          </a>
          <a href="https://github.com/earl105" className="social-button transform hover:scale-103 transition-transform duration-150">
            <img src="assets/buttons/githubLogo.png" alt="GitHub"/>
          </a>
          <a href="mailto:earl.105@osu.edu" className="social-button transform hover:scale-103 transition-transform duration-150">
            <img src="assets/buttons/emailLogo.png" alt="Email"/>
          </a>
        </div>
      </div>
    </section>
  );
}