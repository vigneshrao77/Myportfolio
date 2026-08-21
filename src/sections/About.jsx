import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionWrapper from "../components/SectionWrapper";
import LensflareBackground from "../components/animations/LensflareBackground";
import "../styles/about.css";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const containerRef = useRef(null);
  const headingRef = useRef(null);
  const textColumnRef = useRef(null);
  const statsColumnRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      
      // 1. Heading Animation (Premium fade and shift up)
      gsap.fromTo(headingRef.current, 
        { opacity: 0, y: 50, filter: "blur(10px)" },
        { 
          opacity: 1, 
          y: 0, 
          filter: "blur(0px)",
          duration: 1.5, 
          ease: "power4.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
          }
        }
      );

      // 2. Paragraph Staggering
      // We wrap the paragraphs in a single query selector context
      const paragraphs = textColumnRef.current.querySelectorAll("p");
      gsap.fromTo(paragraphs,
        { opacity: 0, y: 30, filter: "blur(5px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1.2,
          stagger: 0.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: textColumnRef.current,
            start: "top 80%",
          }
        }
      );

      // 3. Stats Panel Sequential Reveal
      const statLines = statsColumnRef.current.querySelectorAll(".stat-line");
      
      statLines.forEach((line, index) => {
        const divider = line.querySelector(".stat-divider");
        const label = line.querySelector(".stat-label");
        const value = line.querySelector(".stat-value");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: line,
            start: "top 90%",
          }
        });

        // Divider expands
        tl.fromTo(divider, 
          { scaleX: 0 }, 
          { scaleX: 1, duration: 1, ease: "power4.inOut" }
        )
        // Label fades in
        .fromTo(label, 
          { opacity: 0, x: -10 }, 
          { opacity: 1, x: 0, duration: 0.6, ease: "power2.out" }, 
          "-=0.4"
        )
        // Value slides in
        .fromTo(value, 
          { opacity: 0, x: 20 }, 
          { opacity: 1, x: 0, duration: 0.8, ease: "back.out(1.2)" }, 
          "-=0.4"
        );
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <SectionWrapper id="about" className="about-section" ref={containerRef}>
      <LensflareBackground />
      
      {/* Cinematic Anamorphic Glow Layers */}
      <div className="cinematic-glow-wrapper">
        <div className="glow-core"></div>
        <div className="glow-anamorphic-ray"></div>
        <div className="glow-beam beam-left"></div>
        <div className="glow-beam beam-right"></div>
        <div className="glow-vignette"></div>
      </div>

      <div className="about-container">
        
        <h2 ref={headingRef} className="section-title">Focus & Foundation</h2>
        
        <div className="about-content">
          <div className="about-text-column" ref={textColumnRef}>
            <p className="about-intro">
              I build resilient systems and solve complex problems. Currently pursuing my B.Tech in Computer Science at VNR VJIET, my foundation is built on rigorous algorithmic thinking and competitive programming in C++.
            </p>
            <p className="about-description">
              Rather than just writing code, I engineer solutions. Whether it's architecting a full-stack MERN application with secure REST APIs or optimizing data structures for milliseconds of performance, I focus on the intersection of deep technical fundamentals and real-world impact.
            </p>
          </div>
          
          <div className="about-stats-column" ref={statsColumnRef}>
            {/* Institution */}
            <div className="stat-line group">
              <div className="stat-divider"></div>
              <div className="stat-content">
                <span className="stat-label">Institution</span>
                <span className="stat-value">VNR VJIET</span>
              </div>
            </div>
            {/* Degree */}
            <div className="stat-line group">
              <div className="stat-divider"></div>
              <div className="stat-content">
                <span className="stat-label">Degree</span>
                <span className="stat-value">B.Tech CSE</span>
              </div>
            </div>
            {/* Graduation */}
            <div className="stat-line group">
              <div className="stat-divider"></div>
              <div className="stat-content">
                <span className="stat-label">Graduation</span>
                <span className="stat-value">2028</span>
              </div>
            </div>
            {/* Location */}
            <div className="stat-line group">
              <div className="stat-divider"></div>
              <div className="stat-content">
                <span className="stat-label">Location</span>
                <span className="stat-value">Hyderabad, India</span>
              </div>
            </div>
            {/* Core Focus */}
            <div className="stat-line group">
              <div className="stat-divider"></div>
              <div className="stat-content">
                <span className="stat-label">Core Focus</span>
                <span className="stat-value">Full Stack, DSA, C++</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

export default About;