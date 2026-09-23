import React from 'react';
import AnimatedHeading from '../components/animations/AnimatedHeading';
import { TiltCard } from '@/components/ui/3d-tilt-card';
import '../styles/skills.css';

// Module-level constant — created once, never recreated on re-render
const skillCategories = [
  { title: 'Programming Languages', items: ['Java', 'C', 'C++', 'JavaScript', 'Python'] },
  { title: 'Frontend Development', items: ['HTML', 'CSS', 'Bootstrap', 'ReactJS'] },
  { title: 'Backend Development', items: ['Node.js', 'Express.js', 'REST APIs'] },
  { title: 'Databases', items: ['MongoDB', 'Oracle SQL', 'PostgreSQL', 'Supabase'] },
  { title: 'CS Fundamentals', items: ['Data Structures and Algorithms', 'OOP Concepts', 'DBMS'] },
  { title: 'Tools & Platforms', items: ['Git', 'GitHub', 'Figma', 'REST Client', 'Anaconda', 'n8n', 'Notion'] },
  { title: 'AI / LLM Frameworks', items: ['LangChain', 'LangGraph', 'LangSmith'] }
];

const Skills = () => {

  return (
    <section id="skills" className="skills-section" style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <AnimatedHeading as="h2" className="section-title" text="Technical Expertise" />

        <div className="skills-grid">
          {skillCategories.map((category, index) => {
            const indexStr = `0${index + 1}`;
            return (
              <TiltCard key={index} className="skill-tilt-wrapper">
                <div className="skill-group">
                  <div className="skill-meta-row">
                    <span className="skill-index">{indexStr}</span>
                    <span className="skill-count-tag">{category.items.length} SKILLS</span>
                  </div>
                  <div className="skill-header">
                    <h3 className="skill-category-title">{category.title}</h3>
                    <div className="skill-header-line" />
                  </div>
                  <div className="skill-list">
                    {category.items.map((skill, idx) => (
                      <span key={idx} className="skill-badge">
                        <span className="skill-badge-dot" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </TiltCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;
