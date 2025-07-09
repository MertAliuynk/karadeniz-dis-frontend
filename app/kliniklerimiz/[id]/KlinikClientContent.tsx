"use client";
import dynamic from "next/dynamic";
import PartnersLayout from "@/components/sections/PartnersSection";
import GallerySlider from "./GallerySlider";

const AppointmentSection = dynamic(() => import("@/components/sections/AppointmentSection"), { ssr: false });
const MapSection = dynamic(() => import("../MapSection"), { ssr: false });

export default function KlinikClientContent({ branch, gallery }: { branch: any, gallery: string[] }) {
  return (
    <div className="w-full">
      <AppointmentSection />
      <div className="mt-8 mb-8 w-full">
        <h1 className="text-3xl sm:text-4xl font-bold text-[#4964A9] text-center mb-2 tracking-wide">
          {branch.name}
        </h1>
        <div className="w-12 h-1 mx-auto mb-4 bg-gray-300 rounded-full opacity-80"></div>
        <div className="w-full px-0 sm:px-0 mb-4">
          <GallerySlider images={gallery} />
        </div>
        <div className="w-full flex flex-col md:flex-row items-stretch justify-center gap-4 md:gap-6 mt-8 px-2 sm:px-8 z-0 relative">
          <div className="w-full md:w-2/3 h-56 md:h-80 rounded-xl overflow-hidden shadow-lg mb-4 md:mb-0">
            <MapSection branches={[branch]} />
          </div>
          <div className="w-full md:w-1/3 bg-white rounded-xl shadow-lg p-6 flex flex-col items-start justify-center gap-2 border border-gray-100">
            <h2 className="text-lg font-bold mb-2 text-[#4964A9]">İletişim Bilgileri</h2>
            {/* {branch.address && <p className="text-gray-700 text-sm"><span className="font-semibold">Adres:</span> {branch.address}</p>} */}
            {branch.phone && <p className="text-gray-700 text-sm"><span className="font-semibold">Telefon:</span> {branch.phone}</p>}
            {branch.email && <p className="text-gray-700 text-sm"><span className="font-semibold">E-posta:</span> {branch.email}</p>}
          </div>
        </div>
      </div>
      <div className="mt-12">
        <PartnersLayout showNames />
      </div>
    </div>
  );
} 