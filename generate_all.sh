#!/bin/bash

# Create all CSS files
mkdir -p src/styles

# global.css - Already shown in documentation
# navbar.css, home.css, etc. - Will be created below

# Create all component files
cat > src/components/Navbar.jsx << 'NAVBAREOF'
import React, { useState, useEffect } from 'react';
import '../styles/navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const sections = ['home', 'about', 'education', 'skills', 'projects', 'experience', 'certifications', 'achievements', 'resume', 'contact'];
      const current = sections.find(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (current) {
        setActiveSection(current);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', id: 'home' },
    { name: 'About', id: 'about' },
    { name: 'Education', id: 'education' },
    { name: 'Skills', id: 'skills' },
    { name: 'Projects', id: 'projects' },
    { name: 'Experience', id: 'experience' },
    { name: 'Contact', id: 'contact' }
  ];

  return (
    <nav className={\`navbar \${scrolled ? 'scrolled' : ''}\`}>
      <div className="navbar-container">
        <a href="#home" className="navbar-logo">
          <span className="logo-bracket">{'<'}</span>
          <span className="logo-text">AJ</span>
          <span className="logo-bracket">{'/>'}</span>
        </a>
        
        <ul className="navbar-menu">
          {navItems.map((item, index) => (
            <li key={item.id} style={{ animationDelay: \`\${index * 0.1}s\` }}>
              <a 
                href={\`#\${item.id}\`}
                className={activeSection === item.id ? 'active' : ''}
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
NAVBAREOF

# Create README
cat > README.md << 'READMEEOF'
# Professional Developer Portfolio

A modern, responsive portfolio website built with React and Vite.

## Quick Start

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Run development server:
\`\`\`bash
npm run dev
\`\`\`

3. Build for production:
\`\`\`bash
npm run build
\`\`\`

## Customization

Edit \`src/data/portfolioData.js\` with your information.

## Deployment

### Vercel
1. Push to GitHub
2. Import on Vercel
3. Deploy automatically

### Netlify
1. Build command: \`npm run build\`
2. Publish directory: \`dist\`

Built with React + Vite
READMEEOF

echo "Core files created"
