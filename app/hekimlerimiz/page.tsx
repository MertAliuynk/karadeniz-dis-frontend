"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SocialBar from '@/components/layout/SocialBar';
import Image from 'next/image';

interface Doctor {
  id: string;
  name: string;
  clinic_id: string;
  branch_id?: string;
  image: string;
  clinic_name?: string;
}

interface Clinic {
  id: string;
  name: string;
  image: string;
}

export default function HekimlerimizPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedClinic, setSelectedClinic] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsResponse, clinicsResponse] = await Promise.all([
          axios.get('https://webapi.karadenizdis.com/api/doctors'),
          axios.get('https://webapi.karadenizdis.com/api/clinics')
        ]);

        // Doktorlara klinik isimlerini ekle
        const doctorsWithClinicNames = doctorsResponse.data.map((doctor: Doctor) => {
          const clinic = clinicsResponse.data.find((c: Clinic) => String(c.id) === String(doctor.clinic_id));
          return {
            ...doctor,
            clinic_name: clinic ? clinic.name : 'Bilinmeyen Klinik'
          };
        });

        setDoctors(doctorsWithClinicNames);
        setClinics(clinicsResponse.data);
        setLoading(false);
      } catch (error) {
        setError('Hekimler yüklenirken bir hata oluştu.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredDoctors = selectedClinic === 'all' 
    ? doctors 
    : doctors.filter(doctor => {
        const doctorClinicId = String(doctor.clinic_id);
        const selectedClinicId = String(selectedClinic);
        return doctorClinicId === selectedClinicId;
      });

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-[80px] xs:pt-[85px] sm:pt-[90px] md:pt-[95px]">
        <div className="container mx-auto px-2 xs:px-3 sm:px-4 py-4 xs:py-6 sm:py-8">
          {/* Sayfa Başlığı */}
          <div className="text-center mb-6 xs:mb-8 sm:mb-12">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl font-bold text-gray-800 mb-3 xs:mb-4">Hekimlerimiz</h1>
            <div className="w-16 xs:w-20 sm:w-24 h-1 bg-gradient-to-r from-[#4964A9] to-[#022171] mx-auto rounded-full"></div>
          </div>

          {/* Klinik Filtresi */}
          <div className="max-w-md mx-auto mb-6 xs:mb-8 sm:mb-12">
            <label htmlFor="clinic-filter" className="block text-xs xs:text-sm font-medium text-gray-700 mb-2">
              Kliniğe Göre Filtrele
            </label>
            <select
              id="clinic-filter"
              value={selectedClinic}
              onChange={(e) => setSelectedClinic(e.target.value)}
              className="w-full p-2 xs:p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#4964A9] transition-all duration-300 bg-white text-gray-800 text-sm xs:text-base font-medium shadow-md"
            >
              <option value="all">Tüm Klinikler</option>
              {clinics.map((clinic) => (
                <option key={clinic.id} value={clinic.id}>
                  {clinic.name}
                </option>
              ))}
            </select>
          </div>

          {/* Hekim Listesi */}
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 xs:gap-4 sm:gap-6 lg:gap-8">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-lg xs:rounded-xl shadow-md hover:shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.02] flex flex-col"
              >
                <div className="relative h-40 xs:h-48 sm:h-56 lg:h-64 flex-shrink-0">
                  <Image
                    src={`https://webapi.karadenizdis.com${doctor.image}`}
                    alt={doctor.name}
                    fill
                    quality={100}
                    sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, (max-width: 1536px) 25vw, 20vw"
                    className="object-cover object-center"
                    loading="lazy"
                  />
                </div>
                <div className="p-3 xs:p-4 sm:p-5 lg:p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-base xs:text-lg sm:text-xl font-bold text-gray-800 mb-2 line-clamp-2 min-h-[2.5rem] xs:min-h-[3rem] sm:min-h-[3.5rem] flex items-center">
                      {doctor.name}
                    </h3>
                    <p className="text-[#4964A9] font-semibold text-xs xs:text-sm line-clamp-1">
                      {doctor.clinic_name}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sonuç Bulunamadı */}
          {filteredDoctors.length === 0 && (
            <div className="text-center py-4 xs:py-6 sm:py-8 sm:py-12">
              <div className="text-gray-500 text-sm xs:text-base sm:text-lg">
                {selectedClinic === 'all' 
                  ? 'Henüz hekim bulunmamaktadır.'
                  : 'Seçilen klinikte hekim bulunmamaktadır.'
                }
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <SocialBar />
    </div>
  );
} 