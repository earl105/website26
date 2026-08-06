import Navbar from "./components/Navbar";
import Background from "./components/Background";
import MobileLandscapeWarning from "./components/MobileLandscapeWarning";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Jobs from "./sections/Jobs";
import Projects from "./sections/Projects";

import "./App.css";
import Contact from "./sections/Contact";
import useKeyboardNavigation from "./hooks/useKeyboardNavigation";
import { useEffect } from 'react'
import { enableAnchorSnap, disableAnchorSnap } from './utils/anchorSnap'

function App() {
  useKeyboardNavigation();

  useEffect(() => {
    // This runs after the component mounts and the DOM elements exist
    enableAnchorSnap()

    // Cleanup: This runs when the component unmounts (e.g., page change)
    return () => {
      disableAnchorSnap()
    }
  }, []) // Empty dependency array ensures this runs once on mount

  return (
    <>
      <Background />
      <MobileLandscapeWarning />
      <Navbar />
      <main className="relative z-10">
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
