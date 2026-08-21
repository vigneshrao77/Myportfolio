import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SectionWrapper from '../components/SectionWrapper';
import AnimatedHeading from '../components/animations/AnimatedHeading';
import TypingCode from '../components/animations/TypingCode';
import MagneticButton from '../components/animations/MagneticButton';
import Tilt3D from '../components/animations/Tilt3D';
import HeroParticles from '../components/animations/HeroParticles';
import { TextParticle } from '@/components/ui/text-particle';
import { MouseFollowingEyes } from '@/components/ui/mouse-following-eyes';
import '../styles/home.css';
import myPhoto from '../assets/image.jpg';

const Home = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  const codeString = `#include <iostream>
#include <opencv2/opencv.hpp>
using namespace std;
using namespace cv;

int main() {
    Mat image = imread("profile.jpg");
    if (image.empty()) return -1;
    
    cout << "Decoding pixels...\\n";
    cout << "Rendering profile...\\n";
    
    imshow("Vignesh Rao", image);
    waitKey(0);
    return 0;
}`;

  return (
    <SectionWrapper id="home" className="home-section">
      <HeroParticles />
      <div className="home-content" style={{ position: 'relative', zIndex: 1 }}>
        <div className="home-intro">
          <div className="home-name-header">
            <div className="home-name-particle-wrapper">
              <TextParticle
                text="Vignesh Rao"
                fontSize={92}
                fontFamily="'Instrument Serif', Georgia, serif"
                particleSize={1.6}
                particleColor="#C9A15A"
                particleDensity={2.4}
                backgroundColor="transparent"
              />
            </div>
            <div className="home-name-eyes-wrapper">
              <MouseFollowingEyes size={26} gap={6} />
            </div>
          </div>
          <p className="home-description">
            Engineering resilient full-stack systems and exploring deep algorithmic problems in C++.
          </p>
          
          <div className="home-cta">
            <MagneticButton className="btn btn-primary" onClick={() => window.location.href='#projects'}>
              View Projects
            </MagneticButton>
          </div>
        </div>
        
        <div className="home-visual">
          <motion.div
            drag
            dragConstraints={{ top: 0, right: 0, bottom: 0, left: 0 }}
            dragTransition={{ bounceStiffness: 500, bounceDamping: 15 }}
            dragElastic={0.2}
            whileDrag={{ cursor: "grabbing" }}
            style={{ cursor: "grab", zIndex: 10, position: 'relative' }}
          >
            <Tilt3D maxTilt={5}>
              <div className={`flip-card ${isFlipped ? 'is-flipped' : ''}`}>
                <div className="flip-card-inner">
                  {/* Front: Terminal Block */}
                  <div className="flip-card-front">
                    <div className="terminal-block">
                      <div className="terminal-header">
                        <div className="terminal-dots">
                          <span className="dot"></span>
                          <span className="dot"></span>
                          <span className="dot"></span>
                        </div>
                        <span className="terminal-title">solution.cpp</span>
                        <button className="run-button" onClick={() => setIsFlipped(true)} aria-label="Run Code" title="Run & View Profile">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                          <span>Run</span>
                        </button>
                      </div>
                      <div className="terminal-body language-cpp">
                        <TypingCode code={codeString} speed={15} />
                      </div>
                    </div>
                  </div>
                  
                  {/* Back: Photo Placeholder */}
                  <div className="flip-card-back" onClick={() => setIsFlipped(false)} title="Click to flip back">
                    <div className="photo-placeholder-box">
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
                        <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                        <circle cx="9" cy="9" r="2" />
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                      </svg>
                      <span className="photo-placeholder-text">photo</span>
                      <span className="photo-placeholder-hint">Click to return to code</span>
                    </div>
                    <div className="back-button-overlay">
                      <button className="back-button" aria-label="Flip Back">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Tilt3D>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default Home;
