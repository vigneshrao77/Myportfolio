#!/bin/bash

# App.jsx
cat > src/App.jsx << 'EOF'
import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './sections/Home';
import About from './sections/About';
import Education from './sections/Education';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import Experience from './sections/Experience';
import Certifications from './sections/Certifications';
import Achievements from './sections/Achievements';
import Resume from './sections/Resume';
import Contact from './sections/Contact';
import './styles/global.css';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Home />
        <About />
        <Education />
        <Skills />
        <Projects />
        <Experience />
        <Certifications />
        <Achievements />
        <Resume />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;
EOF

# portfolioData.js
cat > src/data/portfolioData.js << 'EOF'
// Customize this file with your personal information

export const personalInfo = {
  name: "Alex Johnson",
  title: "Full Stack Developer",
  email: "alex.johnson@email.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  github: "https://github.com/alexjohnson",
  linkedin: "https://linkedin.com/in/alexjohnson",
  twitter: "https://twitter.com/alexjohnson",
  portfolio: "https://alexjohnson.dev"
};

export const about = {
  intro: "I'm a passionate software engineer with a focus on building scalable web applications and solving complex problems.",
  description: "With 3+ years of experience in full-stack development, I specialize in React, Node.js, and cloud technologies. I'm driven by creating elegant solutions that make a real impact. When I'm not coding, you'll find me contributing to open-source projects or exploring new technologies.",
  interests: ["Web Development", "Cloud Architecture", "Open Source", "Machine Learning"]
};

export const education = [
  {
    degree: "Bachelor of Science in Computer Science",
    institution: "Stanford University",
    location: "Stanford, CA",
    year: "2018 - 2022",
    gpa: "3.8/4.0",
    coursework: ["Data Structures", "Algorithms", "Database Systems", "Web Development", "Machine Learning"]
  }
];

export const skills = {
  languages: ["JavaScript", "TypeScript", "Python", "Java", "C++", "SQL", "HTML/CSS"],
  frameworks: ["React", "Node.js", "Express", "Next.js", "Django", "Flask", "TailwindCSS"],
  tools: ["Git", "Docker", "Kubernetes", "AWS", "MongoDB", "PostgreSQL", "Redis", "Figma"],
  other: ["REST APIs", "GraphQL", "CI/CD", "Microservices", "Agile", "Testing"]
};

export const projects = [
  {
    title: "E-Commerce Platform",
    description: "A full-stack e-commerce platform with real-time inventory management, payment integration, and admin dashboard.",
    technologies: ["React", "Node.js", "MongoDB", "Stripe", "AWS"],
    github: "https://github.com/alexjohnson/ecommerce-platform",
    live: "https://ecommerce-demo.com",
    featured: true
  },
  {
    title: "Task Management App",
    description: "Collaborative task management tool with drag-and-drop functionality, real-time updates, and team analytics.",
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Prisma", "WebSockets"],
    github: "https://github.com/alexjohnson/task-manager",
    live: "https://taskflow-app.com",
    featured: true
  },
  {
    title: "AI Image Generator",
    description: "Web application that generates AI images using Stable Diffusion API with custom prompt engineering.",
    technologies: ["React", "Python", "FastAPI", "TensorFlow", "Docker"],
    github: "https://github.com/alexjohnson/ai-image-gen",
    live: "https://ai-images.com",
    featured: false
  },
  {
    title: "Weather Dashboard",
    description: "Real-time weather dashboard with geolocation, forecasts, and interactive maps.",
    technologies: ["Vue.js", "Express", "OpenWeather API", "Mapbox"],
    github: "https://github.com/alexjohnson/weather-dash",
    live: "https://weather-dashboard.com",
    featured: false
  }
];

export const experience = [
  {
    role: "Software Engineer Intern",
    company: "Google",
    location: "Mountain View, CA",
    duration: "Jun 2023 - Aug 2023",
    description: [
      "Developed features for Google Search using React and TypeScript",
      "Optimized API performance reducing latency by 30%",
      "Collaborated with cross-functional teams in an Agile environment",
      "Wrote comprehensive unit and integration tests"
    ]
  },
  {
    role: "Full Stack Developer Intern",
    company: "Meta",
    location: "Menlo Park, CA",
    duration: "May 2022 - Aug 2022",
    description: [
      "Built internal tools using React and GraphQL",
      "Implemented real-time data synchronization features",
      "Participated in code reviews and architecture discussions",
      "Improved application performance by 25%"
    ]
  },
  {
    role: "Software Development Intern",
    company: "Amazon",
    location: "Seattle, WA",
    duration: "Jun 2021 - Aug 2021",
    description: [
      "Developed microservices using Java and Spring Boot",
      "Designed and implemented RESTful APIs",
      "Deployed applications to AWS using Docker and Kubernetes",
      "Participated in on-call rotations and incident management"
    ]
  }
];

export const certifications = [
  {
    name: "AWS Certified Solutions Architect",
    issuer: "Amazon Web Services",
    year: "2023",
    credentialId: "AWS-SA-123456"
  },
  {
    name: "Meta Front-End Developer Professional Certificate",
    issuer: "Meta via Coursera",
    year: "2022",
    credentialId: "META-FE-789012"
  },
  {
    name: "Google Cloud Professional Cloud Developer",
    issuer: "Google Cloud",
    year: "2023",
    credentialId: "GCP-CD-345678"
  }
];

export const achievements = [
  {
    title: "Winner - HackMIT 2023",
    description: "Built an AI-powered study assistant that won first place among 300+ participants",
    year: "2023"
  },
  {
    title: "Open Source Contributor",
    description: "Contributed to React, Next.js, and other major open-source projects with 50+ merged PRs",
    year: "2022-2023"
  },
  {
    title: "Dean's List",
    description: "Achieved Dean's List recognition for 6 consecutive semesters",
    year: "2019-2022"
  },
  {
    title: "Best Capstone Project Award",
    description: "Awarded for developing an innovative blockchain-based voting system",
    year: "2022"
  }
];
EOF

chmod +x create_all_files.sh
