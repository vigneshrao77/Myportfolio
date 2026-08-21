import React from 'react';
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
import CursorSpotlight from './components/animations/CursorSpotlight';
import ScrollProgress from './components/animations/ScrollProgress';
import NeonCursor from './components/animations/NeonCursor';
import './styles/global.css';

function App() {
  return (
    <SmoothScroll>
      <div className="app">
        <NeonCursor />
        <ScrollProgress />
        <CursorSpotlight />
        <Navbar />
        <motion.main
          initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
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