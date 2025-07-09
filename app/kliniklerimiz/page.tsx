"use client";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SocialBar from "@/components/layout/SocialBar";
import Image from "next/image";
import axios from "axios";
import Link from 'next/link';

const Map = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });
const MapSection = dynamic(() => import("./MapSection"), { ssr: false });

interface Branch {
  id: string;
  name: string;
  image: string;
  address?: string;
  lat?: number;
  lng?: number;
}

const defaultCenter = [41.2867, 36.33]; // Samsun merkez koordinatı

const getBranchImageSrc = (image: any): string => {
  if (!image) return '/default-image.jpg';
  if (image.startsWith('http')) return image;
  return `https://webapi.karadenizdis.com${image.startsWith('/') ? image : '/' + image}`;
};

const KlinikerimizPage = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("https://webapi.karadenizdis.com/api/branches").then(res => {
      setBranches(res.data);
      setLoading(false);
    });
  }, []);

  // Harita için marker koordinatlarını hazırla
  const markers = branches
    .filter(b => b.lat && b.lng)
    .map(b => ({ lat: b.lat!, lng: b.lng!, name: b.name }));

  return (
    <div className="relative min-h-screen flex flex-col bg-[#F7F8FA]">
      <SocialBar />
      <Header />
      <main className="flex-1 pt-[80px] xs:pt-[85px] sm:pt-[90px] md:pt-[95px]">
        <div className="max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 py-4 xs:py-6 sm:py-8">
          <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-center mb-4 xs:mb-6 sm:mb-8">Şubelerimiz</h1>
          <div className="flex flex-col md:flex-row md:space-x-6 lg:space-x-8 mb-6 xs:mb-8 sm:mb-10">
            <div className="flex-1 mb-6 md:mb-0 md:max-w-[50%]">
              <h2 className="text-lg xs:text-xl font-semibold mb-2">Samsunun Her Yerindeyiz</h2>
              <div className="h-1 w-16 xs:w-20 sm:w-24 bg-gradient-to-r from-[#4964A9] to-[#022171] mb-3 xs:mb-4" />
              <p className="text-gray-700 text-[13px] xs:text-sm sm:text-base md:text-[14px] lg:text-[15px] leading-[1.6] xs:leading-[1.65] md:leading-[1.5] lg:leading-[1.6] tracking-[-0.01em] md:tracking-[-0.02em]">
                Karadeniz Diş olarak, Samsun'da bulunan şubelerimizle hizmetinizdeyiz. Hastalarımıza en iyi diş sağlığı hizmetini sunmak için Samsun'daki şubelerimizi kullanarak kolay erişilebilirlik ve konfor sağlıyoruz. Her bir şubemizde uzman diş hekimleri ve deneyimli personel ekibimiz, yüksek kaliteli tedavi ve bakım sunmak için bir araya gelmiştir. Şubelerimizdeki modern ve ileri teknolojiyle donatılmış diş kliniklerimiz, hasta konforunu ve güvenliğini en üst düzeyde tutmak için tasarlanmıştır. Her bir şube, sterilizasyon protokollerine tamamen uygun olarak işletilmekte olup, hijyenik bir ortamda tedavi almanızı sağlamak için en son teknikleri kullanmaktadır. Karadeniz Diş Özel Diş Hastanesi olarak Samsun'da şubelerimizle hizmetinizdeyiz.
              </p>
            </div>
            <div className="flex-1 md:max-w-[50%] flex justify-center items-start">
              <div className="w-full h-48 xs:h-52 sm:h-64 md:h-[280px] lg:h-[320px] rounded-lg xs:rounded-xl sm:rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 z-0">
                <MapSection branches={branches} />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6 lg:gap-8">
            {loading ? (
              <div className="col-span-full text-center text-gray-500 text-sm xs:text-base">Yükleniyor...</div>
            ) : branches.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 text-sm xs:text-base">Klinik bulunamadı.</div>
            ) : (
              branches.map((branch) => (
                <div key={branch.id} className="bg-white rounded-lg xs:rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col">
                  <div className="relative w-full h-32 xs:h-40 sm:h-48">
                    <Image 
                      src={getBranchImageSrc(branch.image)} 
                      alt={branch.name} 
                      fill 
                      className="object-cover"
                      sizes="(max-width: 480px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="p-3 xs:p-4 flex-1 flex flex-col justify-between">
                    <h3 className="text-base xs:text-lg font-bold mb-2">{branch.name}</h3>
                    <Link href={`/kliniklerimiz/${branch.id}`}>
                      <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Detaylı İncele</button>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default KlinikerimizPage; 