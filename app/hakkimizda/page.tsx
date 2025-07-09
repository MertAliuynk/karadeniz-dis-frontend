"use client";
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SocialBar from "@/components/layout/SocialBar";

interface TimelineItem {
  id: number;
  title: string;
  description: string;
  date: string;
  order_index: number;
}

const HakkimizdaPage: React.FC = () => {
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set());
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTimeline();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;

      const timelineRect = timelineRef.current.getBoundingClientRect();
      const timelineTop = timelineRect.top;
      const timelineBottom = timelineRect.bottom;
      const windowHeight = window.innerHeight;

      // Timeline görünür olduğunda animasyonları başlat
      if (timelineTop < windowHeight && timelineBottom > 0) {
        const newVisibleItems = new Set<number>();
        
        timelineItems.forEach((item, index) => {
          const itemTop = timelineTop + (index * 200); // Her kart arası 200px
          if (itemTop < windowHeight - 100) {
            newVisibleItems.add(item.id);
          }
        });
        
        setVisibleItems(newVisibleItems);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // İlk yüklemede kontrol et

    return () => window.removeEventListener('scroll', handleScroll);
  }, [timelineItems]);

  const fetchTimeline = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://webapi.karadenizdis.com/api/timeline');
      setTimelineItems(response.data);
      setError(null);
    } catch (err: any) {
      console.error('Timeline yükleme hatası:', err);
      setError('Timeline yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="hakkimizda" className="relative">
      <SocialBar />
      <Header />
      <div className="h-30 w-full"></div>
      
      <div className="w-full min-h-screen bg-white">
        {/* Hero Section */}
        <div className="w-full py-8 xs:py-12 sm:py-16 md:py-24">
          <div className="max-w-4xl mx-auto px-3 xs:px-4 text-center">
            <h1 className="font-bold text-2xl xs:text-3xl sm:text-4xl lg:text-5xl py-2 xs:py-3 lg:py-4 bg-gradient-to-r from-[#4964A9] to-[#022171] bg-clip-text text-transparent mb-4 xs:mb-6 sm:mb-8">
              Hakkımızda
            </h1>
            
            <div className="prose prose-sm xs:prose-base sm:prose-lg mx-auto text-gray-700 leading-relaxed">
              <p className="text-base xs:text-lg sm:text-xl mb-4 xs:mb-5 sm:mb-6">
                20 yılı aşkın deneyimimizle, Samsun'un önde gelen diş sağlığı kuruluşlarından biri olarak hizmet vermekteyiz. 
                Modern teknoloji ve uzman kadromuzla, hastalarımıza en kaliteli diş tedavi hizmetlerini sunmaya devam ediyoruz.
              </p>
              
              <p className="text-base xs:text-lg sm:text-xl mb-4 xs:mb-5 sm:mb-6">
                Misyonumuz, her yaştan hastamıza gülümseyebilme özgürlüğü kazandırmak ve ağız sağlığının 
                genel sağlığın ayrılmaz bir parçası olduğu bilinciyle hareket etmektir.
              </p>
              
              <p className="text-base xs:text-lg sm:text-xl">
                Vizyonumuz, Türkiye'nin en güvenilir ve tercih edilen diş sağlığı merkezi olmak ve 
                uluslararası standartlarda hizmet kalitesini sürdürmektir.
              </p>
            </div>
          </div>
        </div>

        {/* Timeline Section */}
        <div ref={timelineRef} className="w-full py-8 xs:py-12 sm:py-16 md:py-24 bg-gradient-to-b from-white to-gray-50">
          <div className="max-w-6xl mx-auto px-2 xs:px-3 sm:px-4">
            <div className="text-center mb-8 xs:mb-10 sm:mb-16">
              <h2 className="font-bold text-xl xs:text-2xl sm:text-3xl lg:text-4xl py-2 xs:py-3 lg:py-4 bg-gradient-to-r from-[#4964A9] to-[#022171] bg-clip-text text-transparent mb-3 xs:mb-4">
                Yolculuğumuz
              </h2>
              <div className="w-12 xs:w-16 sm:w-24 h-0.5 xs:h-1 bg-gradient-to-r from-[#4964A9] to-[#022171] mx-auto rounded-full"></div>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12 xs:py-16 sm:py-20">
                <div className="animate-spin rounded-full h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12 border-b-2 border-[#4964A9]"></div>
              </div>
            ) : error ? (
              <div className="text-center py-12 xs:py-16 sm:py-20">
                <div className="text-red-600 text-lg xs:text-xl mb-3 xs:mb-4">⚠️</div>
                <p className="text-gray-600 text-base xs:text-lg">{error}</p>
                <button 
                  onClick={fetchTimeline}
                  className="mt-3 xs:mt-4 px-4 xs:px-6 py-1.5 xs:py-2 bg-gradient-to-r from-[#4964A9] to-[#022171] text-white text-sm xs:text-base rounded-lg hover:opacity-90 transition-opacity"
                >
                  Tekrar Dene
                </button>
              </div>
            ) : (
              <div className="relative">
                {/* Timeline Çizgisi */}
                <div className="hidden sm:block absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-[#4964A9] to-[#022171] h-full rounded-full"></div>
                <div className="block sm:hidden absolute left-4 w-1 bg-gradient-to-b from-[#4964A9] to-[#022171] h-full rounded-full"></div>
                
                {/* Timeline Kartları */}
                <div className="space-y-6 xs:space-y-8 sm:space-y-16">
                  {timelineItems.map((item, index) => {
                    const position = index % 2 === 0 ? 'right' : 'left';
                    return (
                      <div
                        key={item.id}
                        className={`relative flex flex-col md:flex-row items-center md:items-stretch ${
                          position === 'left' ? 'md:justify-start' : 'md:justify-end'
                        }`}
                      >
                        {/* Timeline Noktası */}
                        <div className="absolute left-4 sm:left-1/2 transform -translate-x-1/2 w-3 h-3 sm:w-4 sm:h-4 bg-[#4964A9] rounded-full border-4 border-white shadow-lg z-10"></div>
                        
                        {/* Kart */}
                        <div
                          className={`w-full ml-6 sm:ml-0 max-w-[260px] xs:max-w-xs sm:max-w-sm md:max-w-md lg:max-w-xl transform transition-all duration-1000 ease-out ${
                            visibleItems.has(item.id)
                              ? 'opacity-100 translate-y-0'
                              : 'opacity-0 translate-y-20'
                          } ${
                            position === 'left'
                              ? 'md:mr-auto md:pr-8 lg:pr-12'
                              : 'md:ml-auto md:pl-8 lg:pl-12'
                          }`}
                        >
                          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-3 xs:p-4 sm:p-6 hover:shadow-xl transition-shadow duration-300">
                            <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between mb-2 xs:mb-3 gap-1 xs:gap-2">
                              <h3 className="text-base xs:text-lg sm:text-xl font-bold text-gray-800">{item.title}</h3>
                              <span className="text-sm xs:text-base sm:text-lg font-bold text-[#4964A9]">
                                {new Date(item.date).toLocaleDateString('tr-TR', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </span>
                            </div>
                            <p className="text-gray-600 leading-relaxed text-xs xs:text-sm sm:text-base">{item.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default HakkimizdaPage; 