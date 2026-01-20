import Navbar from "./components/Navbar";
import MobileLandscapeWarning from "./components/MobileLandscapeWarning";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Jobs from "./sections/Jobs";
import Projects from "./sections/Projects";

import "./App.css";
import Contact from "./sections/Contact";

function App() {
  return (
    <>
      <MobileLandscapeWarning />
      <Navbar />
      <main>
        <Hero/>
        <About />
        <Projects />
        <Jobs />
        
     
        <Contact />
      </main>
    </>
  );
}

export default App;
