import React, { useState, useEffect, useRef } from 'react';
import { FloatingDock } from './ui/floating-dock';
import {
  IconHome,
  IconUser,
  IconCode,
  IconBriefcase,
  IconMail
} from "@tabler/icons-react";
import '../styles/navbar.css';

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

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const scrolledRef = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const next = window.scrollY > 50;
      if (next !== scrolledRef.current) {
        scrolledRef.current = next;
        setScrolled(next);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar-floating-dock-container ${scrolled ? 'scrolled' : ''}`}>
      <FloatingDock items={links} />
    </nav>
  );
};

export default Navbar;
