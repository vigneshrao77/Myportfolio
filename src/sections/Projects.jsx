import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { projects, personalInfo } from '../data/portfolioData';
import '../styles/projects.css';

const Projects = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const progressFillRef = useRef(null);
  const [activeSlide, setActiveSlide] = useState(1);
  const totalSlides = projects.length + 1; // 5 projects + 1 ending card

  useEffect(() => {
    let ctx = gsap.context(() => {
      let mm = gsap.matchMedia();

      mm.add("(min-width: 992px)", () => {
        const section = sectionRef.current;
        const track = trackRef.current;
        if (!section || !track) return;

        const getScrollDistance = () => {
          return track.scrollWidth - window.innerWidth + 140;
        };

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${getScrollDistance() + 500}`,
            pin: true,
            scrub: 1.1,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              if (progressFillRef.current) {
                progressFillRef.current.style.transform = `scaleX(${self.progress})`;
              }
              const current = Math.min(
                totalSlides,
                Math.max(1, Math.ceil(self.progress * totalSlides))
              );
              setActiveSlide(current);
            },
          },
        });

        tl.to(track, {
          x: () => -getScrollDistance(),
          ease: "none",
        });

        // Parallax numbers within cards
        const cards = track.querySelectorAll(".project-showcase-card");
        cards.forEach((card) => {
          const numberEl = card.querySelector(".project-card-number");
          if (numberEl) {
            gsap.fromTo(
              numberEl,
              { x: -15, opacity: 0.6 },
              {
                x: 20,
                opacity: 1,
                ease: "none",
                scrollTrigger: {
                  trigger: card,
                  containerAnimation: tl,
                  start: "left right",
                  end: "right left",
                  scrub: true,
                },
              }
            );
          }
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [totalSlides]);

  return (
    <section id="projects" className="projects-showcase-section" ref={sectionRef}>
      {/* Top Header & Scrub Progress Bar */}
      <div className="projects-showcase-header">
        <div className="projects-header-left">
          <span className="projects-meta-tag">[ 04 / SELECTED WORK ]</span>
          <h2 className="projects-main-title">Curated Systems & Intelligence</h2>
        </div>

        <div className="projects-header-right">
          <div className="projects-scroll-indicator">
            <span className="scroll-hint-dot" />
            <span className="scroll-hint-text">SCROLL HORIZONTALLY</span>
            <span className="scroll-hint-arrow">➔</span>
          </div>

          <div className="projects-counter-badge">
            <span className="counter-current">0{activeSlide}</span>
            <span className="counter-divider">/</span>
            <span className="counter-total">0{totalSlides}</span>
          </div>
        </div>

        {/* Dynamic Scrub Progress Bar */}
        <div className="projects-progress-track">
          <div className="projects-progress-fill" ref={progressFillRef} />
        </div>
      </div>

      {/* Horizontal Runway Track */}
      <div className="projects-track-wrapper">
        <div className="projects-horizontal-track" ref={trackRef}>
          {projects.map((project, index) => {
            const indexStr = index < 9 ? `0${index + 1}` : `${index + 1}`;
            return (
              <article key={index} className="project-showcase-card">
                <div className="project-card-glass">
                  <div className="project-card-top">
                    <span className="project-card-number">{indexStr}</span>
                    <div className="project-badge-row">
                      {project.featured && (
                        <span className="project-featured-badge">FEATURED</span>
                      )}
                      <span className="project-category-badge">ENGINEERED</span>
                    </div>
                  </div>

                  <div className="project-card-body">
                    <h3 className="project-card-title">{project.title}</h3>
                    <p className="project-card-desc">{project.description}</p>
                  </div>

                  <div className="project-card-footer">
                    <div className="project-tech-pills">
                      {project.technologies.map((tech, idx) => (
                        <span key={idx} className="project-pill">
                          <span className="project-pill-dot" />
                          {tech}
                        </span>
                      ))}
                    </div>

                    {project.github && (
                      <a
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="project-action-link"
                      >
                        <span>VIEW REPOSITORY</span>
                        <span className="project-action-arrow">↗</span>
                      </a>
                    )}
                  </div>
                </div>
              </article>
            );
          })}

          {/* End Invitation Card */}
          <article className="project-showcase-card project-end-card">
            <div className="project-card-glass end-card-content">
              <span className="end-card-badge">EXPLORE MORE</span>
              <h3 className="end-card-title">More Works & Open Source</h3>
              <p className="end-card-desc">
                Curious to see more? Explore algorithmic solutions, experimental prototypes, and full project histories directly on GitHub.
              </p>
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noopener noreferrer"
                className="end-card-btn"
              >
                <span>VISIT GITHUB PROFILE</span>
                <span>↗</span>
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
};

export default Projects;