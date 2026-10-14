import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './sections/Home';
import About from './sections/About';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import Resume from './sections/Resume';
import Contact from './sections/Contact';
import SmoothScroll from './components/animations/SmoothScroll';
import ScrollProgress from './components/animations/ScrollProgress';
import NeonCursor from './components/animations/NeonCursor';
import EyesLoader from './components/ui/EyesLoader';
import './styles/global.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    // Ensure we are strictly at the top of the home page
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setIsLoading(false);
  };

  return (
    <SmoothScroll isLoading={isLoading}>
      <div className="app">
        <EyesLoader onComplete={handleLoadingComplete} />
        <NeonCursor />
        <ScrollProgress />
        
        {/* Navbar soft reveal */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? -20 : 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        >
          <Navbar />
        </motion.div>

        {/* Cinematic Home landing reveal */}
        <motion.main
          initial={{ opacity: 0, y: 35, scale: 0.985 }}
          animate={{
            opacity: isLoading ? 0 : 1,
            y: isLoading ? 35 : 0,
            scale: isLoading ? 0.985 : 1,
          }}
          transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
        >
          <Home />
          <About />
          <Skills />
          <Projects />
          <Resume />
          <Contact />
        </motion.main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}

export default App;