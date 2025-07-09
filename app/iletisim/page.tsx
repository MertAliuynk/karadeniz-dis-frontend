"use client";
import React, { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SocialBar from '@/components/layout/SocialBar';
import axios from 'axios';
import dynamic from 'next/dynamic';

const MapSection = dynamic(() => import("../kliniklerimiz/MapSection"), { ssr: false });

interface Branch {
  id: string;
  name: string;
  image: string;
  address?: string;
  phone?: string;
  email?: string;
  lat?: number;
  lng?: number;
}

const IletisimPage: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [selected, setSelected] = useState<number>(0);

  useEffect(() => {
    axios.get('https://webapi.karadenizdis.com/api/branches')
      .then(res => setBranches(res.data))
      .catch(() => setBranches([]));
  }, []);

  const branch = branches[selected] || null;

  return (
    <div className="relative min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-[#022171] to-white pb-8 xs:pb-12 sm:pb-16 pt-28">
        <div className="max-w-4xl mx-auto px-2 xs:px-3 sm:px-4 md:px-4 pt-2 xs:pt-3 sm:pt-4">
          <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-center text-white mb-1 xs:mb-2">Bize Ulaşın</h1>
          <p className="text-center text-white text-sm xs:text-base mb-4 xs:mb-6 sm:mb-8 px-2">3 klinik ve 1 laboratuvarımızla size bir telefon kadar yakınız.</p>
          <div className="flex flex-col lg:flex-row gap-4 xs:gap-6 md:gap-8 items-start justify-center bg-white/80 rounded-lg xs:rounded-xl shadow-md xs:shadow-lg p-3 xs:p-4 sm:p-6">
            {/* Şubeler Butonları */}
            <div className="flex flex-col gap-2 xs:gap-3 sm:gap-4 w-full lg:w-auto lg:min-w-[280px] lg:max-w-[300px]">
              <h2 className="font-bold text-base xs:text-lg mb-1 xs:mb-2">Şubelerimiz</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 xs:gap-3 sm:gap-4">
                {branches.map((b, i) => (
                  <button
                    key={b.id}
                    className={`rounded-full border px-3 xs:px-4 sm:px-6 py-1.5 xs:py-2 text-sm sm:text-base font-semibold transition-all ${
                      selected === i 
                        ? 'bg-[#022171] text-white' 
                        : 'bg-white text-black border-gray-300 hover:bg-blue-100'
                    }`}
                    onClick={() => setSelected(i)}
                  >
                    {b.name}
                  </button>
                ))}
              </div>
            </div>
            {/* Kart */}
            <div className="flex-1 flex flex-col items-center lg:items-start gap-4 xs:gap-5 sm:gap-6 w-full">
              <div className="w-full max-w-3xl bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-3 xs:p-4 sm:p-6">
                {/* Harita veya adres */}
                {branch?.lat && branch?.lng ? (
                  <div className="w-full aspect-video xs:aspect-[4/3] sm:aspect-[16/9] lg:aspect-[2/1] rounded-lg overflow-hidden">
                    <MapSection branches={[branch]} />
                  </div>
                ) : (
                  <div className="w-full min-h-[50px] xs:min-h-[60px] flex items-center justify-center bg-gray-100 rounded mb-3 xs:mb-4">
                    <span className="text-xs xs:text-sm sm:text-base text-gray-600 px-2 text-center">{branch?.address || 'Adres eklenmemiş'}</span>
                  </div>
                )}
                {/* İletişim Bilgileri */}
                <div className="mt-4 space-y-2 sm:space-y-3">
                  {/* Adres */}
                  {branch?.address && !branch?.lat && !branch?.lng && (
                    <div className="text-sm xs:text-base sm:text-lg text-gray-800 font-semibold text-center w-full break-words">{branch.address}</div>
                  )}
                  {/* Telefon */}
                  {branch?.phone && (
                    <div className="text-xs xs:text-sm sm:text-base text-gray-700 w-full text-center">
                      Telefon: <a href={`tel:${branch.phone.replace(/\D/g, '')}`} className="text-blue-700 hover:underline">{branch.phone}</a>
                    </div>
                  )}
                  {/* E-posta */}
                  {branch?.email && (
                    <div className="text-xs xs:text-sm sm:text-base text-gray-700 w-full text-center">
                      E-posta: <a href={`mailto:${branch.email}`} className="text-blue-700 hover:underline">{branch.email}</a>
                    </div>
                  )}
                  {/* WhatsApp */}
                  {branch?.phone && (
                    <a
                      href={`https://wa.me/90${branch.phone.replace(/\D/g, '').replace(/^0/, '')}?text=Merhaba%2C%20${encodeURIComponent(branch?.name || '')}%20şubesi%20hakkında%20bilgi%20almak%20istiyorum.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 mt-4 text-green-600 hover:text-green-700 hover:underline text-xs xs:text-sm sm:text-base transition-colors duration-300"
                    >
                      <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-4 h-4 xs:w-5 xs:h-5" />
                      WhatsApp ile Mesaj Gönder
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Sağ altta SocialBar */}
        <div className="fixed bottom-6 right-6 z-50">
          <SocialBar />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default IletisimPage; 