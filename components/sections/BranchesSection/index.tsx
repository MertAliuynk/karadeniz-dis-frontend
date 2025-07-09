"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import useWindowSize from '@/hooks/useWindowSize';

interface Branch {
  id: string;
  name: string;
  image: string;
}

const BranchesSection: React.FC = () => {
  const router = useRouter();
  const [startIndex, setStartIndex] = useState(0);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const size = useWindowSize();

  let cardsPerPage = 3;
  if (size.width && size.width < 640) {
    cardsPerPage = 1;
  } else if (size.width && size.width < 1024) {
    cardsPerPage = 2;
  }

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get('https://webapi.karadenizdis.com/api/branches');
        setBranches(response.data);
        setLoading(false);
      } catch (err) {
        setError('Şubeler yüklenemedi');
        setLoading(false);
      }
    };
    fetchBranches();
  }, []);

  const goToComingSoon = () => {
    router.push('/coming-soon');
  };

  const scrollLeft = () => {
    setStartIndex((prev) => Math.max(prev - cardsPerPage, 0));
  };

  const scrollRight = () => {
    setStartIndex((prev) =>
      prev + cardsPerPage < branches.length ? prev + cardsPerPage : prev
    );
  };

  const getBranchImageSrc = (image: any): string => {
    if (!image) return '/default-image.jpg';
    if (image.startsWith('http')) return image;
    return `https://webapi.karadenizdis.com${image.startsWith('/') ? image : '/' + image}`;
  };

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (loading) {
    return <div className="text-gray-600 text-center p-4">Yükleniyor...</div>;
  }

  const visibleBranches = branches.slice(startIndex, startIndex + cardsPerPage);

  return (
    <div
      id="clinics"
      className="w-full min-h-[600px] sm:min-h-[800px] flex flex-col justify-center items-center py-4 sm:py-12 bg-gradient-to-t from-white to-[#C7D1EB]"
    >
      <div className="h-8 sm:h-16 w-full flex justify-center items-center mb-4 sm:mb-12 lg:mb-16">
        <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-white drop-shadow-sm text-center px-4">
          Kliniklerimiz
        </h2>
      </div>
      <div className="w-full max-w-6xl px-4 sm:px-6 lg:px-8 flex flex-row items-center space-x-2 sm:space-x-4">
        <div
          onClick={scrollLeft}
          onKeyDown={(e) => e.key === 'Enter' && scrollLeft()}
          role="button"
          tabIndex={0}
          className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-r from-[#4964A9] to-[#022171] flex items-center justify-center hover:bg-blue-700 transition-colors duration-300 cursor-pointer ${
            startIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-label="Sola kaydır"
        >
          <ChevronLeftIcon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full">
          {visibleBranches.map((branch, index) => (
            <div
              key={branch.id}
              className="w-full bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              <div className="relative w-full aspect-[4/3]">
                <Image
                  src={getBranchImageSrc(branch.image)}
                  alt={branch.name}
                  fill
                  className="object-cover object-center w-full h-full"
                  quality={100}
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  priority={index === 0}
                />
              </div>
              <div className="flex flex-col justify-between flex-1 p-3 xs:p-4 sm:p-5">
                <p className="text-base sm:text-lg md:text-xl font-bold text-gray-800 text-center mb-2 truncate">
                  {branch.name}
                </p>
                <div className="flex justify-center">
                  <button
                    onClick={() => router.push(`/kliniklerimiz/${branch.id}`)}
                    className="relative overflow-hidden h-9 w-4/5 sm:w-3/5 rounded-full bg-gradient-to-r from-[#4964A9] to-[#022171] flex items-center justify-center shadow group hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
                    aria-label={`Detaylı incele ${branch.name}`}
                    style={{ outline: 'none', border: 'none' }}
                  >
                    <span className="absolute top-0 left-[-75%] w-2/3 h-full bg-gradient-to-r from-white/60 via-white/20 to-transparent opacity-70 blur-sm pointer-events-none group-hover:animate-shine" />
                    <span className="relative z-10 text-sm sm:text-base font-semibold text-white text-center tracking-wide group-hover:tracking-wider transition-all duration-200">
                      Detaylı İncele
                    </span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div
          onClick={scrollRight}
          onKeyDown={(e) => e.key === 'Enter' && scrollRight()}
          role="button"
          tabIndex={0}
          className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-r from-[#4964A9] to-[#022171] flex items-center justify-center hover:bg-blue-700 transition-colors duration-300 cursor-pointer ${
            startIndex + cardsPerPage >= branches.length ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-label="Sağa kaydır"
        >
          <ChevronRightIcon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
        </div>
      </div>
    </div>
  );
};

export default BranchesSection;