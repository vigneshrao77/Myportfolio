// Customize this file with your personal information

export const personalInfo = {
  name: "Vignesh Rao",
  title: "Full Stack Developer",
  email: "vigneshraopeggarla@gmail.com",
  phone: "+91 6300306330",
  location: "Hyderabad, India",
  github: "https://github.com/vigneshrao77",
  linkedin: "https://www.linkedin.com/in/peggarla-vignesh-rao-44a374326/"
};

export const about = {
  intro: "I'm a passionate software engineer with a focus on building scalable web applications and solving complex problems.",
  description: "With 3+ years of experience in full-stack development, I specialize in React, Node.js, and cloud technologies. I'm driven by creating elegant solutions that make a real impact. When I'm not coding, you'll find me contributing to open-source projects or exploring new technologies.",
  interests: ["Web Development", "Cloud Architecture", "Open Source", "Machine Learning", "AI Engineering"],
  image: "src/assets/image.jpg"
};

export const skills = {
  languages: ["JavaScript", "TypeScript", "Python", "Java", "C++", "SQL", "HTML/CSS"],
  frameworks: ["React", "Node.js", "Express", "Next.js", "Django", "Flask", "TailwindCSS", "LangChain", "LangGraph", "LangSmith"],
  tools: ["Git", "Docker", "Kubernetes", "AWS", "MongoDB", "PostgreSQL", "Redis", "Figma"],
  other: ["REST APIs", "GraphQL", "CI/CD", "Microservices", "Agile", "Testing"]
};

export const projects = [
  {
    title: "Paper2PPT Generator",
    description: "Developed an AI system that retrieves research papers from Semantic Scholar, arXiv, and CrossRef and automatically generates PowerPoint presentations using Llama 3.2 via Ollama. Built with Python, Streamlit, and python-pptx for automated paper summarization and slide generation.",
    technologies: ["Python", "Streamlit", "Llama 3.2", "Ollama"],
    github: "https://github.com/vigneshrao77/LLM-Project-PPT-Generator-",
    featured: true
  },
  {
    title: "EduDisaster",
    description: "Developed a full-stack MERN disaster preparedness education platform with age-based content personalization to deliver disaster response education. Implemented RESTful APIs for dynamic content delivery and user management, enabling scalable learning experiences across different demographics.",
    technologies: ["React", "Node.js", "Express.js", "MongoDB", "REST API"],
    github: "https://github.com/m-sai-dinesh/sih_2025",
    featured: true
  },
  {
    title: "BharatFix",
    description: "Built a full-stack MERN civic issue reporting platform enabling citizens to report civic problems with image uploads and real-time status tracking, featuring secure RESTful APIs with JWT authentication.",
    technologies: ["React", "Node.js", "Express.js", "MongoDB", "JWT", "Cloudinary"],
    github: "https://github.com/m-sai-dinesh/BharatFix",
    featured: false
  },
  {
    title: "Banking System Simulator",
    description: "A simulation of a banking system in C language, implementing various data structures and algorithms to manage accounts, transactions, and customer operations efficiently.",
    technologies: ["C", "Data Structures & Algorithms", "File Handling"],
    github: "https://github.com/vigneshrao77/datastructures",
    featured: false
  },
  {
    title: "Resume Screening AI",
    description: "Automates recruitment screening by comparing resumes with job descriptions using AI. Generates ATS scores, identifies matched/missing skills, performs risk & reward assessment, creates interview questions, and saves results to Notion. Sends confirmation emails to candidates.",
    technologies: ["n8n", "Google Gemini", "Google Drive", "Gmail", "Notion", "PDF Extract"],
    github: "https://github.com/vigneshrao77/Resume_Screening_AI",
    featured: true
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
