import React from 'react';
import { projects } from '../data/portfolioData';
import AnimatedHeading from '../components/animations/AnimatedHeading';
import ProjectRow from '../components/animations/ProjectRow';
import '../styles/projects.css';
import CursorGrid from '../components/animations/CursorGrid';

const Projects = () => {
  return (
    <section id="projects" className="projects-section" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <CursorGrid
          cellSize={70}
          color="#FFD700"
          radius={140}
          falloff="smooth"
          holdTime={400}
          fadeDuration={800}
          lineWidth={1.2}
          maxOpacity={1}
          fillOpacity={0}
          gridOpacity={0}
          cellRadius={0}
          clickPulse
          pulseSpeed={600}
        />
      </div>
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ position: 'relative' }}>
          <AnimatedHeading as="h2" className="section-title" text="Selected Work" />

          <div className="projects-list" style={{ position: 'relative', zIndex: 1 }}>
            {projects.map((project, index) => (
              <ProjectRow 
                key={index} 
                title={project.title} 
                href={project.github}
              >
                {project.description}
                
                <div className="project-tech" style={{ marginTop: '16px' }}>
                  {project.technologies.map((tech, idx) => (
                    <span key={idx} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                </div>
              </ProjectRow>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;