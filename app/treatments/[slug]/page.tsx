"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';
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

export default function TreatmentDetailPage() {
  const params = useParams();
  const [treatment, setTreatment] = useState<Treatment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTreatment = async () => {
      try {
        const response = await axios.get(`https://webapi.karadenizdis.com/api/treatments/${params.slug}`);
        setTreatment(response.data);
        setLoading(false);
      } catch (error) {
        setError('Tedavi detayları yüklenirken bir hata oluştu.');
        setLoading(false);
      }
    };

    fetchTreatment();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#4964A9]"></div>
      </div>
    );
  }

  if (error || !treatment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-xl">{error || 'Tedavi bulunamadı.'}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-grow pt-32">
        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <div className="relative w-full aspect-[16/9] min-h-[220px] max-h-[500px] mb-8 sm:mb-12 rounded-xl overflow-hidden shadow-lg">
            <Image
              src={`https://webapi.karadenizdis.com${treatment.image}`}
              alt={treatment.title}
              fill
              quality={100}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
              className="object-cover object-center"
              priority
              loading="eager"
              style={{ objectFit: 'cover', objectPosition: 'center' }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent z-10" />
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4">
              <h1 className="text-3xl xs:text-4xl sm:text-5xl font-bold text-white mb-3 sm:mb-4 drop-shadow-lg">
                {treatment.title}
              </h1>
              <p className="text-base xs:text-lg sm:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
                {treatment.short_description}
              </p>
            </div>
          </div>

          {/* Short Description */}
          <div className="mb-8">
            <p className="text-lg text-gray-600">
              {treatment.short_description}
            </p>
          </div>

          {/* Content Sections */}
          {treatment.content && treatment.content.sections && Array.isArray(treatment.content.sections) && (
            treatment.content.sections.map((section, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md mb-6">
                <h2 className="text-2xl font-semibold text-[#4964A9] mb-4">
                  {section.title}
                </h2>
                <div
                  className="w-full max-w-none break-words whitespace-pre-line text-gray-500 text-[15px] sm:text-base leading-7 sm:leading-8 mt-2 mb-1 px-2"
                  style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                >
                  {section.content}
                </div>
                {section.links && Array.isArray(section.links) && section.links.length > 0 && (
                  <div className="mt-4">
                    {section.links.map((link, linkIndex) => (
                      <a
                        key={linkIndex}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#4964A9] hover:text-[#022171] underline mr-4"
                      >
                        {link.text}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
      <Footer />
      <SocialBar />
    </div>
  );
} 