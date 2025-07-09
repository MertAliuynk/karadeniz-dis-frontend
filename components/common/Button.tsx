"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

const STYLES = {
  button: {
    container: `
      relative
      overflow-hidden
      rounded-full
      flex
      items-center
      justify-center
      bg-gradient-to-r
      from-[#4964a9]
      to-[#022171]
      shadow-lg
      shadow-[#4964a9]/30
      transition-all
      duration-300
      hover:shadow-xl
      hover:shadow-[#4964a9]/40
      hover:scale-105
      active:scale-95
      cursor-pointer
      group
    `,
    size: {
      sm: "h-9 w-36 px-4",
      md: "h-11 w-44 px-6",
      lg: "h-14 w-56 px-8"
    },
    text: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg"
    },
    glow: `
      absolute
      inset-0
      bg-gradient-to-r
      from-white/0
      via-white/20
      to-white/0
      translate-x-[-100%]
      group-hover:translate-x-[100%]
      transition-transform
      duration-1000
    `
  }
};

const Button = () => {
  const router = useRouter();

  const handleClick = () => {
    // Eğer ana sayfadaysak, appointment-section'a scroll yap
    if (window.location.pathname === '/') {
      const appointmentSection = document.getElementById('appointment-section');
      if (appointmentSection) {
        appointmentSection.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    } else {
      // Ana sayfada değilsek, ana sayfaya git
      router.push('/');
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`
        ${STYLES.button.container}
        ${STYLES.button.size.sm} 
        sm:${STYLES.button.size.md} 
        md:${STYLES.button.size.lg}
      `}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      aria-label="Randevu oluştur"
    >
      <div className={STYLES.button.glow} />
      <p className={`
        relative
        text-white
        font-bold
        tracking-wide
        ${STYLES.button.text.sm}
        sm:${STYLES.button.text.md}
        md:${STYLES.button.text.lg}
      `}>
        Randevu Al
      </p>
    </div>
  );
};

export default Button;