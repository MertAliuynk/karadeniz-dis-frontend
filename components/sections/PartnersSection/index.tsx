'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';

interface Partner {
  id: number;
  name: string;
  logo: string;
  description: string;
}

interface PartnersLayoutProps {
  showNames?: boolean;
}

const PartnersLayout = ({ showNames = false }: PartnersLayoutProps) => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await axios.get('https://webapi.karadenizdis.com/api/partners');
        setPartners(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching partners:', error);
        setError('Anlaşmalı kurumlar yüklenemedi');
        setLoading(false);
      }
    };

    fetchPartners();
  }, []);

  if (loading) {
    return (
      <div className="w-full py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4964A9] mx-auto"></div>
            <p className="mt-2 text-gray-600">Yükleniyor...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center py-8 text-red-500">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-bold text-2xl sm:text-3xl lg:text-4xl py-2 sm:py-3 lg:py-4 bg-gradient-to-r from-[#4964A9] to-[#022171] bg-clip-text text-transparent">
            Anlaşmalı Kurumlar
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-[#4964A9] to-[#022171] mx-auto mt-4 rounded-full"></div>
        </div>
        
        <div className="md:grid md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 flex md:flex-none flex-row md:flex-row-none overflow-x-auto md:overflow-x-visible scrollbar-hide">
          {partners.map((partner) => (
            <div
              key={partner.id}
              className={`bg-white rounded-xl border-2 border-gray-100 hover:border-[#4964A9] hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center mx-2 md:mx-0 p-2 xs:p-3 sm:p-4 md:p-5 group ${
                showNames ? 'aspect-auto min-h-[100px] md:min-h-[120px]' : 'aspect-square'
              } min-w-[140px] xs:min-w-[160px] sm:min-w-[180px] md:min-w-0`}
            >
              <div className={`relative w-full ${showNames ? 'h-20 xs:h-24 sm:h-28 md:h-32 mb-2 md:mb-3' : 'h-full'} max-w-[80%] max-h-[80%]`}>
                <Image
                  src={`https://webapi.karadenizdis.com${partner.logo}`}
                  alt={partner.name}
                  fill
                  className="object-contain filter group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              {showNames && (
                <div className="text-center w-full">
                  <h3 className="text-xs xs:text-sm sm:text-base md:text-sm font-bold text-gray-800 group-hover:text-[#4964A9] transition-colors duration-300 line-clamp-2 tracking-wide uppercase">
                    {partner.name}
                  </h3>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PartnersLayout; 