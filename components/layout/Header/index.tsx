"use client";
import React, { useState } from 'react';
import Image from 'next/image';
import Button from '@/components/common/Button';
import { GiHamburgerMenu } from 'react-icons/gi';
import { IoClose } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import { useEscapeKey } from '@/hooks/useEscapeKey';
import NavigationLink from '@/components/common/NavigationLink';
import { useRouter } from 'next/navigation';

// Sabit değerler
const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
};

const STYLES = {
  header: {
    container: "w-full fixed flex flex-col items-center z-50",
    main: "flex flex-row justify-between w-full bg-white shadow-lg shadow-gray-200 px-3 sm:px-6 lg:px-25",
    logo: {
      container: "w-[280px] xs:w-[280px] sm:w-[350px] md:w-[450px] h-12 sm:h-15 flex flex-col justify-center items-center",
    },
    menuButton: {
      container: "focus:outline-none p-1.5 sm:p-2 rounded-full hover:bg-gradient-to-r from-[#4964A9] to-[#022171] hover:text-white transition-all duration-300 mr-2",
      icon: "text-[#4964A9] size-7 sm:size-12 transition-colors duration-300"
    },
    mobileButton: {
      container: "sm:hidden w-auto mx-auto flex justify-center shadow-md shadow-gray-200 rounded-b-full bg-white/30 backdrop-blur-sm py-0.5 px-2"
    },
    navigation: {
      container: `
        hidden
        sm:flex
        w-auto
        min-w-[800px]
        max-w-[1100px]
        shadow-lg
        shadow-gray-200
        h-10
        sm:h-12
        md:h-14
        rounded-b-full
        flex-row
        items-center
        justify-center
        space-x-2
        sm:space-x-3
        md:space-x-4
        lg:space-x-6
        xl:space-x-8
        bg-white/50
        backdrop-blur-sm
        transition-all
        duration-300
        px-4
        sm:px-6
        md:px-8
        lg:px-10
      `,
      mobile: {
        container: "fixed top-0 right-0 h-full w-[260px] sm:w-80 bg-white shadow-2xl border-l border-gray-200 z-50",
        closeButton: "self-end mb-3 sm:mb-5 focus:outline-none p-1.5 sm:p-2 rounded-full hover:bg-gradient-to-r from-[#4964A9] to-[#022171] hover:text-white transition-all duration-300",
        nav: "flex flex-col space-y-3 sm:space-y-6 p-3 sm:p-4"
      }
    }
  }
};

const Header = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationHandlers = {
    goToComingSoon: () => {
      router.push('/coming-soon');
      setIsMenuOpen(false);
    },
    goToHomePage: () => {
      if (window.location.pathname === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        router.push('/');
      }
      setIsMenuOpen(false);
    },
    goToTreatments: () => {
      router.push('/treatments');
      setIsMenuOpen(false);
    },
    goToVideoblog: () => {
      router.push('/Videoblog');
      setIsMenuOpen(false);
    },
    goToPriceList: () => {
      router.push('/price-list');
      setIsMenuOpen(false);
    },
    goToSSS: () => {
      router.push('/sss');
      setIsMenuOpen(false);
    },
    goToHakkimizda: () => {
      router.push('/hakkimizda');
      setIsMenuOpen(false);
    },
    goToKliniklerimiz: () => {
      router.push('/kliniklerimiz');
      setIsMenuOpen(false);
    },
    goToHekimlerimiz: () => {
      router.push('/hekimlerimiz');
      setIsMenuOpen(false);
    },
    goToIletisim: () => {
      router.push('/iletisim');
      setIsMenuOpen(false);
    }
  };

  useEscapeKey(() => setIsMenuOpen(false));

  const navItems = [
    { label: 'Ana Sayfa', href: '/', onClick: navigationHandlers.goToHomePage },
    { label: 'Tedavilerimiz', href: '/treatments', onClick: navigationHandlers.goToTreatments },
    { label: 'Kliniklerimiz', href: '/kliniklerimiz', onClick: navigationHandlers.goToKliniklerimiz },
    { label: 'Hakkımızda', href: '/hakkimizda', onClick: navigationHandlers.goToHakkimizda },
    { label: 'İletişim', href: '/iletisim', onClick: navigationHandlers.goToIletisim },
    { label: 'Karadeniz Lab.', href: '/coming-soon', onClick: navigationHandlers.goToComingSoon },
  ];

  const mobileNavItems = [
    ...navItems.filter(item => item.label !== 'Karadeniz Lab.'),
    { label: 'Hekimlerimiz', href: '/hekimlerimiz', onClick: navigationHandlers.goToHekimlerimiz },
    { label: 'Videoblog', href: '/Videoblog', onClick: navigationHandlers.goToVideoblog },
    { label: 'SSS', href: '/sss', onClick: navigationHandlers.goToSSS },
    { label: 'Fiyat Listesi', href: '/price-list', onClick: navigationHandlers.goToPriceList },
    ...[navItems.find(item => item.label === 'Karadeniz Lab.')].filter(Boolean)
  ];

  return (
    <div className={STYLES.header.container}>
      <div className={STYLES.header.main}>
        <div className={STYLES.header.logo.container}>
          <Image 
            src="/logo.png" 
            alt="Logo" 
            width={450}
            height={80}
            className="object-contain w-[280px] xs:w-[280px] sm:w-[350px] md:w-[450px]"
            priority
          />
        </div>
        <div className="flex flex-row justify-center space-x-3 sm:space-x-10 items-center">
          <div className="hidden sm:block">
            {!isMenuOpen && <Button />}
          </div>
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={
              `${STYLES.header.menuButton.container} 
              transition-all duration-300
              hover:rotate-12 hover:scale-110 hover:shadow-2xl hover:shadow-[#4964A9]/40
              hover:bg-gradient-to-r hover:from-[#4964A9] hover:to-[#022171] hover:text-white
              active:scale-95 active:shadow-md`
            }
            aria-label="Menüyü aç/kapat"
          >
            <GiHamburgerMenu className={STYLES.header.menuButton.icon} />
          </button>
        </div>
      </div>

      {/* Mobil ekranlarda randevu butonu */}
      <div className={STYLES.header.mobileButton.container}>
        <div className="py-0.5 scale-75">
          {!isMenuOpen && <Button />}
        </div>
      </div>

      <div className={STYLES.header.navigation.container}>
        {navItems.map((item, index) => (
          <NavigationLink 
            key={index} 
            href={item.href} 
            onClick={item.onClick}
            className={item.label === 'Karadeniz Lab.' ? 'bg-gradient-to-r from-pink-400 via-blue-400 to-blue-600 bg-clip-text text-transparent font-bold transition-all duration-300 hover:from-pink-500 hover:via-blue-500 hover:to-blue-700 hover:bg-gradient-to-r hover:bg-clip-text hover:text-transparent' : ''}
          >
            {item.label}
          </NavigationLink>
        ))}
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={STYLES.header.navigation.mobile.container}
            >
              <div className="p-4 sm:p-5 flex flex-col h-full">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className={STYLES.header.navigation.mobile.closeButton}
                  aria-label="Menüyü kapat"
                >
                  <IoClose size={24} className="text-[#4964A9] transition-colors duration-300" />
                </button>
                <nav className={STYLES.header.navigation.mobile.nav}>
                  {(mobileNavItems.filter(Boolean) as typeof navItems).map((item, index) => (
                    <NavigationLink
                      key={index}
                      href={item.href}
                      onClick={() => {
                        item.onClick && item.onClick();
                        setIsMenuOpen(false);
                      }}
                      className={item.label === 'Karadeniz Lab.' ? 'bg-gradient-to-r from-pink-400 via-blue-400 to-blue-600 bg-clip-text text-transparent font-bold transition-all duration-300 hover:from-pink-500 hover:via-blue-500 hover:to-blue-700 hover:bg-gradient-to-r hover:bg-clip-text hover:text-transparent' : ''}
                    >
                      {item.label}
                    </NavigationLink>
                  ))}
                </nav>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black z-40"
              aria-hidden="true"
            />
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Header;