import React, { useState, useEffect } from 'react';
import { FloatingDock } from './ui/floating-dock';
import {
  IconHome,
  IconUser,
  IconCode,
  IconBriefcase,
  IconMail
} from "@tabler/icons-react";
import '../styles/navbar.css';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      const sections = ['home', 'about', 'skills', 'projects', 'contact'];
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

  const links = [
    {
      title: "Home",
      icon: <IconHome />,
      href: "#home",
    },
    {
      title: "About",
      icon: <IconUser />,
      href: "#about",
    },
    {
      title: "Skills",
      icon: <IconCode />,
      href: "#skills",
    },
    {
      title: "Projects",
      icon: <IconBriefcase />,
      href: "#projects",
    },
    {
      title: "Contact",
      icon: <IconMail />,
      href: "#contact",
    },
  ];

  return (
    <nav className={`navbar-floating-dock-container ${scrolled ? 'scrolled' : ''}`}>
      <FloatingDock items={links} />
    </nav>
  );
};

export default Navbar;