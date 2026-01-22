import Navbar from "./components/Navbar";
import MobileLandscapeWarning from "./components/MobileLandscapeWarning";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Jobs from "./sections/Jobs";
import Projects from "./sections/Projects";

import "./App.css";
import Contact from "./sections/Contact";
import useSpacebarNavigation from "./hooks/useSpacebarNavigation";
import { useEffect } from 'react'
import { enableAnchorSnap, disableAnchorSnap } from './utils/anchorSnap'

function App() {
  useSpacebarNavigation();

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
