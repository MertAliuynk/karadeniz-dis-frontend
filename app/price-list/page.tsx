"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SocialBar from '@/components/layout/SocialBar';

interface PriceItem {
  id: number;
  category: string;
  name: string;
  min_price: number;
  max_price: number;
  description?: string;
}

const PriceListPage = () => {
  const [prices, setPrices] = useState<PriceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      const response = await axios.get('https://webapi.karadenizdis.com/api/prices');
      setPrices(response.data);
      setLoading(false);
    } catch (err) {
      setError('Fiyat listesi yüklenirken bir hata oluştu');
      setLoading(false);
    }
  };

  const categories = ['all', ...new Set(prices.map(item => item.category))];

  const filteredPrices = selectedCategory === 'all'
    ? prices
    : prices.filter(item => item.category === selectedCategory);

  const formatPrice = (price: number) => {
    return price.toLocaleString('tr-TR');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-8 pt-32 flex-grow">
          <div className="text-center text-gray-600">Yükleniyor...</div>
        </div>
        <div className="mt-auto">
          <SocialBar />
          <Footer />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F7F8FA] flex flex-col">
        <Header />
        <div className="container mx-auto px-4 py-8 pt-32 flex-grow">
          <div className="text-center text-red-500">{error}</div>
        </div>
        <div className="mt-auto">
          <SocialBar />
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col">
      <Header />
      <main className="flex-grow pt-[80px] xs:pt-[85px] sm:pt-[90px] md:pt-[95px]">
        <div className="container mx-auto px-2 xs:px-3 sm:px-4 py-4 xs:py-6 sm:py-8">
          <h1 className="text-2xl xs:text-2xl sm:text-3xl font-bold text-center mb-8 xs:mb-12 sm:mb-16 bg-gradient-to-r from-[#4964A9] to-[#022171] bg-clip-text text-transparent">
            Fiyat Listesi
          </h1>

          {/* Kategori Filtreleme */}
          <div className="flex flex-wrap justify-center gap-2 xs:gap-3 sm:gap-4 mb-8 xs:mb-12 sm:mb-16">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 xs:px-4 sm:px-6 py-2 xs:py-2.5 sm:py-3 rounded-full transition-all duration-300 text-sm xs:text-base sm:text-lg ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-[#4964A9] to-[#022171] text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                }`}
              >
                {category === 'all' ? 'Tümü' : category}
              </button>
            ))}
          </div>

          {/* Fiyat Listesi */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6 lg:gap-8">
            {filteredPrices.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg xs:rounded-xl shadow-md hover:shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.02]"
              >
                <div className="p-4 xs:p-6 sm:p-8">
                  <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 xs:gap-4 mb-4 xs:mb-6">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base xs:text-lg sm:text-2xl font-bold text-gray-800 mb-2 line-clamp-2">{item.name}</h3>
                      <p className="text-xs xs:text-sm text-gray-500 bg-gray-100 px-2 xs:px-3 py-1 rounded-full inline-block">{item.category}</p>
                    </div>
                    <div className="text-base xs:text-lg sm:text-2xl font-bold text-[#4964A9] text-left xs:text-right whitespace-nowrap">
                      {formatPrice(item.min_price)} ₺ - {formatPrice(item.max_price)} ₺
                    </div>
                  </div>
                  {item.description && (
                    <p className="text-gray-600 mt-3 xs:mt-4 text-sm xs:text-base sm:text-lg">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredPrices.length === 0 && (
            <div className="text-center text-gray-600 mt-4 xs:mt-6 sm:mt-8 text-sm xs:text-base sm:text-xl">
              Bu kategoride fiyat bulunamadı.
            </div>
          )}
        </div>
      </main>
      <div className="mt-auto">
        <SocialBar />
        <Footer />
      </div>
    </div>
  );
};

export default PriceListPage; 