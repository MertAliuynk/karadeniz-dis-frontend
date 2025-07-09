"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SocialBar from "@/components/layout/SocialBar";

interface FAQ {
  id: number;
  question: string;
  answer: string;
  category: string;
  order_index: number;
  is_active: boolean;
}

const SSSPage: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchFAQs();
  }, []);

  const fetchFAQs = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://webapi.karadenizdis.com/api/faqs');
      setFaqs(response.data);
      setError(null);
    } catch (err: any) {
      console.error('SSS yükleme hatası:', err);
      setError('SSS yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const toggleItem = (id: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const getCategories = () => {
    const categories = Array.from(new Set(faqs.map(faq => faq.category)));
    return ['all', ...categories];
  };

  const filteredFAQs = selectedCategory === 'all' 
    ? faqs 
    : faqs.filter(faq => faq.category === selectedCategory);

  const categoryLabels: { [key: string]: string } = {
    'all': 'Tümü',
    'genel': 'Genel',
    'tedavi': 'Tedavi',
    'randevu': 'Randevu',
    'fiyat': 'Fiyat',
    'lokasyon': 'Lokasyon',
    'hizmet': 'Hizmet'
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-[80px] xs:pt-[85px] sm:pt-[90px] md:pt-[95px]">
        <div className="container mx-auto px-2 xs:px-3 sm:px-4 py-4 xs:py-6 sm:py-8">
          {/* Hero Section */}
          <div className="text-center mb-6 xs:mb-8 sm:mb-12">
            <h1 className="font-bold text-xl xs:text-2xl sm:text-3xl lg:text-5xl bg-gradient-to-r from-[#4964A9] to-[#022171] bg-clip-text text-transparent">
              Sıkça Sorulan Sorular
            </h1>
            <p className="mt-2 xs:mt-3 sm:mt-4 font-thin text-sm xs:text-base sm:text-lg lg:text-2xl bg-gradient-to-r from-[#4964A9] to-[#022171] bg-clip-text text-transparent animate-pulse">
              Diş kliniğimiz hakkında merak ettiğiniz her şey
            </p>
          </div>

          {/* Main Content */}
          <div className="w-full max-w-6xl mx-auto">
            {loading ? (
              <div className="flex justify-center items-center py-8 xs:py-12 sm:py-20">
                <div className="animate-spin rounded-full h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12 border-b-2 border-[#4964A9]"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8 xs:py-12 sm:py-20">
                <div className="text-red-600 text-lg xs:text-xl mb-4">⚠️</div>
                <p className="text-gray-600 text-sm xs:text-base sm:text-lg">{error}</p>
                <button 
                  onClick={fetchFAQs}
                  className="mt-4 px-4 xs:px-5 sm:px-6 py-2 bg-gradient-to-r from-[#4964A9] to-[#022171] text-white rounded-lg hover:opacity-90 transition-opacity text-sm xs:text-base"
                >
                  Tekrar Dene
                </button>
              </div>
            ) : (
              <>
                {/* Category Filter */}
                <div className="mb-6 xs:mb-8">
                  <div className="flex flex-wrap gap-1.5 xs:gap-2 justify-center">
                    {getCategories().map((category) => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-3 xs:px-4 py-1.5 xs:py-2 rounded-full text-xs xs:text-sm font-medium transition-all duration-200 ${
                          selectedCategory === category
                            ? 'bg-gradient-to-r from-[#4964A9] to-[#022171] text-white shadow-lg'
                            : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-[#4964A9]'
                        }`}
                      >
                        {categoryLabels[category] || category}
                      </button>
                    ))}
                  </div>
                </div>

                {/* FAQ List */}
                <div className="max-w-4xl mx-auto">
                  {filteredFAQs.length === 0 ? (
                    <div className="text-center py-8 xs:py-12 sm:py-20">
                      <div className="text-gray-400 text-4xl xs:text-5xl sm:text-6xl mb-4">❓</div>
                      <h3 className="text-base xs:text-lg sm:text-xl font-semibold text-gray-600 mb-2">
                        Bu kategoride henüz soru bulunmuyor
                      </h3>
                      <p className="text-sm xs:text-base text-gray-500">
                        Farklı bir kategori seçmeyi deneyin
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2 xs:space-y-3 sm:space-y-4">
                      {filteredFAQs.map((faq) => (
                        <div
                          key={faq.id}
                          className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow duration-200"
                        >
                          <button
                            onClick={() => toggleItem(faq.id)}
                            className="w-full px-3 xs:px-4 sm:px-6 py-3 xs:py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                          >
                            <h3 className="text-sm xs:text-base sm:text-lg font-semibold text-gray-800 pr-3 xs:pr-4">
                              {faq.question}
                            </h3>
                            <div className="flex-shrink-0">
                              <svg
                                className={`w-4 h-4 xs:w-5 xs:h-5 sm:w-6 sm:h-6 text-[#4964A9] transition-transform duration-200 ${
                                  expandedItems.has(faq.id) ? 'rotate-180' : ''
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </div>
                          </button>
                          
                          {expandedItems.has(faq.id) && (
                            <div className="px-3 xs:px-4 sm:px-6 pb-3 xs:pb-4">
                              <div className="border-t border-gray-100 pt-3 xs:pt-4">
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words min-h-[40px] w-full overflow-x-auto text-sm xs:text-base">
                                  {faq.answer}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Contact Section */}
                <div className="mt-8 xs:mt-12 sm:mt-16 bg-white rounded-lg shadow-lg p-4 xs:p-6 sm:p-8 max-w-4xl mx-auto border border-gray-100">
                  <div className="text-center">
                    <h2 className="text-lg xs:text-xl sm:text-2xl font-bold text-gray-800 mb-3 xs:mb-4">
                      Hala sorunuz mu var?
                    </h2>
                    <p className="text-sm xs:text-base text-gray-600 mb-4 xs:mb-5 sm:mb-6">
                      Burada bulamadığınız sorularınız için bizimle iletişime geçebilirsiniz.
                    </p>
                    <div className="flex flex-col xs:flex-row gap-3 xs:gap-4 justify-center">
                      <a
                        href="/iletisim"
                        className="px-6 py-2.5 xs:py-3 bg-gradient-to-r from-[#4964A9] to-[#022171] text-white rounded-lg hover:opacity-90 transition-opacity font-medium text-sm xs:text-base"
                      >
                        İletişime Geç
                      </a>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
      <div className="mt-auto">
        <SocialBar />
        <Footer />
      </div>
    </div>
  );
};

export default SSSPage; 