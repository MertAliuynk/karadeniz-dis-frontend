"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import GradientButton from '@/components/common/GradientButton';
import useWindowSize from '@/hooks/useWindowSize';

interface Treatment {
  id: string;
  title: string;
  short_description?: string;
  description?: string;
  image: string;
  slug?: string;
}

const Treatments: React.FC = () => {
  const router = useRouter();
  const [startIndex, setStartIndex] = useState(0);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const size = useWindowSize();

  let cardsPerPage = 6;
  if (size.width && size.width < 640) {
    cardsPerPage = 3;
  } else if (size.width && size.width < 1024) {
    cardsPerPage = 4;
  }

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const response = await axios.get('https://webapi.karadenizdis.com/api/treatments');
        setTreatments(response.data);
        setLoading(false);
      } catch (err) {
        setError('Tedaviler yüklenemedi');
        setLoading(false);
      }
    };
    fetchTreatments();
  }, []);

  const goToComingSoon = () => {
    router.push('/coming-soon');
  };

  const goToTreatments = () => {
    router.push('/treatments');
  };

  const scrollLeft = () => {
    setStartIndex((prev) => Math.max(prev - cardsPerPage, 0));
  };

  const scrollRight = () => {
    setStartIndex((prev) =>
      prev + cardsPerPage < treatments.length ? prev + cardsPerPage : prev
    );
  };

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (loading) {
    return <div className="text-gray-600 text-center p-4">Yükleniyor...</div>;
  }

  const visibleTreatments = treatments.slice(startIndex, startIndex + cardsPerPage);

  return (
    <div
      id="treatments"
      className="w-full min-h-[600px] sm:min-h-[720px] flex flex-col items-center space-y-4 sm:space-y-12 bg-gradient-to-t from-[#C7D1EB] to-[#4964A9] py-4 sm:py-12"
    >
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg text-center px-4">
        Tedavilerimiz
      </h2>
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-row items-center space-x-2 sm:space-x-4">
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
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {visibleTreatments.map((treatment) => (
            <div
              key={treatment.id}
              className="relative w-full bg-white rounded-xl overflow-hidden cursor-pointer group shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-2 flex flex-col justify-center items-center"
              style={{ minHeight: '0' }}
            >
              <div className="relative w-full aspect-[4/3] flex flex-col justify-center items-center text-center p-4 bg-gradient-to-t from-[#4964A9]/10 to-white">
                <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 mb-1 drop-shadow-lg z-10 line-clamp-2 flex items-center justify-center w-full">
                  {treatment.title}
                </h3>
                <p className="text-xs sm:text-sm md:text-base text-gray-700 line-clamp-2 z-10 flex items-center justify-center w-full">
                  {treatment.short_description}
                </p>
                <div className="absolute inset-0 w-full h-full z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <Image
                    src={`https://webapi.karadenizdis.com${treatment.image}`}
                    alt={treatment.title}
                    fill
                    quality={100}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-center rounded-t-xl"
                    priority={true}
                    style={{ objectFit: 'cover', objectPosition: 'center' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                </div>
                <div className="absolute bottom-2 sm:bottom-4 left-0 w-full flex justify-center z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 group-hover:delay-500 delay-0 pointer-events-none group-hover:pointer-events-auto px-2 sm:px-0">
                  <GradientButton
                    onClick={() => treatment.slug && router.push(`/treatments/${treatment.slug}`)}
                    ariaLabel={`İncele ${treatment.title}`}
                    className="!rounded-full !px-6 !py-2 text-base sm:text-lg font-bold shadow-lg shadow-blue-200/40"
                  >
                    İncele
                  </GradientButton>
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
            startIndex + cardsPerPage >= treatments.length ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          aria-label="Sağa kaydır"
        >
          <ChevronRightIcon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
        </div>
      </div>
      <div className="flex justify-center w-full px-4">
        <button
          onClick={goToTreatments}
          className="cursor-pointer h-12 sm:h-14 w-56 sm:w-64 rounded-4xl flex items-center justify-center bg-gradient-to-b from-[#4964A9] to-[#022171] shadow-md shadow-gray-700 border border-white transform transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
        >
          <p className="font-extrabold text-lg sm:text-xl text-white drop-shadow-md text-center">
            Tüm Tedavileri Göster
          </p>
        </button>
      </div>
    </div>
  );
};

export default Treatments;