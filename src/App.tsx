import Navbar from "./components/Navbar";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Jobs from "./sections/Jobs";
import Projects from "./sections/Projects";

import "./App.css";
import Contact from "./sections/Contact";

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero/>
        <About />
        <Jobs />
        <Projects />
     
        <Contact />
      </main>
    </>
  );
}

export default App;
