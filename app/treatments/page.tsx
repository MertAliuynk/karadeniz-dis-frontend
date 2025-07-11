"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SocialBar from '@/components/layout/SocialBar';
import Image from 'next/image';

interface Treatment {
  id: number;
  title: string;
  short_description: string;
  description: string;
  content: {
    sections: Array<{
      title: string;
      content: string;
      links?: Array<{
        text: string;
        url: string;
      }>;
    }>;
  };
  image: string;
  slug: string;
  meta_title: string;
  meta_description: string;
  featured: boolean;
  order_index: number;
}

export default function TreatmentsPage() {
  const router = useRouter();
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchTreatments = async () => {
      try {
        const response = await axios.get('https://webapi.karadenizdis.com/api/treatments');
        const sortedTreatments = response.data.sort((a: Treatment, b: Treatment) => a.order_index - b.order_index);
        setTreatments(sortedTreatments);
        setLoading(false);
      } catch (error) {
        setError('Tedaviler yüklenirken bir hata oluştu.');
        setLoading(false);
      }
    };

    fetchTreatments();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#4964A9]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    );
  }

  const featuredTreatments = treatments.filter(treatment => treatment.featured);
  const regularTreatments = treatments.filter(treatment => !treatment.featured);

  // Arama filtreleme
  const filteredFeaturedTreatments = featuredTreatments.filter(treatment =>
    treatment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    treatment.short_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    treatment.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRegularTreatments = regularTreatments.filter(treatment =>
    treatment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    treatment.short_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    treatment.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-[80px] xs:pt-[85px] sm:pt-[90px] md:pt-[95px]">
        <div className="container mx-auto px-2 xs:px-3 sm:px-4 py-4 xs:py-6 sm:py-8">
          {/* Arama Kutusu */}
          <div className="max-w-2xl mx-auto mb-6 xs:mb-8 sm:mb-12">
            <input
              type="text"
              placeholder="Tedavi ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 xs:p-4 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-[#4964A9] transition-all duration-300 bg-white text-gray-800 text-sm xs:text-base font-medium xs:font-semibold shadow-md hover:shadow-lg"
            />
          </div>

          {/* Öne Çıkan Tedaviler */}
          {featuredTreatments.length > 0 && (
            <div className="mb-8 xs:mb-12 sm:mb-16">
              <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-800 mb-4 xs:mb-6 sm:mb-8">Öne Çıkan Tedaviler</h2>
              {filteredFeaturedTreatments.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6 lg:gap-8">
                  {filteredFeaturedTreatments.map((treatment) => (
                    <div
                      key={treatment.id}
                      onClick={() => router.push(`/treatments/${treatment.slug}`)}
                      className="bg-white rounded-lg xs:rounded-xl shadow-md hover:shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] flex flex-col"
                    >
                      <div className="relative w-full aspect-[4/3]">
                        <Image
                          src={`https://webapi.karadenizdis.com${treatment.image}`}
                          alt={treatment.title}
                          fill
                          quality={100}
                          sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="object-cover object-center"
                          priority={treatment.featured}
                          loading={treatment.featured ? 'eager' : 'lazy'}
                        />
                      </div>
                      <div className="flex-1 flex flex-col items-center text-center justify-between p-3 xs:p-4 sm:p-5 md:p-6">
                        <h3 className="text-sm xs:text-base sm:text-xl md:text-2xl font-semibold text-gray-800 mb-1 xs:mb-2 md:mb-3 line-clamp-2 min-h-[2.5rem] xs:min-h-[3rem] sm:min-h-[3.5rem] flex items-center w-full">
                          {treatment.title}
                        </h3>
                        <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-600 line-clamp-2 w-full">
                          {treatment.short_description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchTerm && (
                <div className="text-center text-gray-600 py-4 xs:py-6 sm:py-8 text-sm xs:text-base">
                  Arama kriterlerinize uygun öne çıkan tedavi bulunamadı.
                </div>
              )}
            </div>
          )}

          {/* Tüm Tedaviler */}
          <div>
            <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-800 mb-4 xs:mb-6 sm:mb-8">Tüm Tedaviler</h2>
            {filteredRegularTreatments.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6 lg:gap-8">
                {filteredRegularTreatments.map((treatment) => (
                  <div
                    key={treatment.id}
                    onClick={() => router.push(`/treatments/${treatment.slug}`)}
                    className="bg-white rounded-lg xs:rounded-xl shadow-md hover:shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] flex flex-col"
                  >
                    <div className="relative w-full aspect-[4/3]">
                      <Image
                        src={`https://webapi.karadenizdis.com${treatment.image}`}
                        alt={treatment.title}
                        fill
                        quality={100}
                        sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-center"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between p-3 xs:p-4 sm:p-5 md:p-6">
                      <h3 className="text-sm xs:text-base sm:text-xl md:text-2xl font-semibold text-gray-800 mb-1 xs:mb-2 md:mb-3">
                        {treatment.title}
                      </h3>
                      <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-600 line-clamp-2">
                        {treatment.short_description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : searchTerm ? (
              <div className="text-center text-gray-600 py-4 xs:py-6 sm:py-8 text-sm xs:text-base">
                Arama kriterlerinize uygun tedavi bulunamadı.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6 lg:gap-8">
                {regularTreatments.map((treatment) => (
                  <div
                    key={treatment.id}
                    onClick={() => router.push(`/treatments/${treatment.slug}`)}
                    className="bg-white rounded-lg xs:rounded-xl shadow-md hover:shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02] flex flex-col"
                  >
                    <div className="relative w-full aspect-[4/3]">
                      <Image
                        src={`https://webapi.karadenizdis.com${treatment.image}`}
                        alt={treatment.title}
                        fill
                        quality={100}
                        sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover object-center"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between p-3 xs:p-4 sm:p-5 md:p-6">
                      <h3 className="text-sm xs:text-base sm:text-xl md:text-2xl font-semibold text-gray-800 mb-1 xs:mb-2 md:mb-3">
                        {treatment.title}
                      </h3>
                      <p className="text-xs xs:text-sm sm:text-base md:text-lg text-gray-600 line-clamp-2">
                        {treatment.short_description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <SocialBar />
    </div>
  );
} 