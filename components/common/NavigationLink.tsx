// components/ui/NavigationLink.tsx
"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { useScroll } from 'framer-motion';

interface NavigationLinkProps {
  children: React.ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  className?: string;
}

const NavigationLink: React.FC<NavigationLinkProps> = ({ children, to, href, onClick, className = '' }) => {
  const router = useRouter();
  const { scrollY } = useScroll();

  const handleClick = () => {
    if (onClick) {
      onClick();
      return;
    }

    if (to) {
      const element = document.getElementById(to);
      if (element) {
        const headerOffset = 100;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    } else if (href) {
      router.push(href);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={
        `
        text-[#4964A9]
        hover:text-[#022171]
        transition-colors
        duration-300
        whitespace-nowrap
        text-xs
        sm:text-sm
        md:text-base
        lg:text-lg
        font-medium
        tracking-wide
        hover:scale-105
        active:scale-95
        transition-transform
        duration-200
        ${className}
        `
      }
    >
      {children}
    </button>
  );
};

export default NavigationLink;