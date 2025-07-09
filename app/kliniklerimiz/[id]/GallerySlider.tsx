"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function GallerySlider({ images }: { images: string[] }) {
  const [current, setCurrent] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dragStartX = useRef<number | null>(null);
  const dragDelta = useRef<number>(0);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (images.length <= 1) return;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [current, images.length]);

  if (!images.length) return null;

  // Slider ayarları
  const getIndex = (offset: number) => (current + offset + images.length) % images.length;

  // Drag/Swipe eventleri
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    if ('touches' in e) {
      dragStartX.current = e.touches[0].clientX;
    } else {
      dragStartX.current = e.clientX;
    }
    dragDelta.current = 0;
  };
  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (dragStartX.current === null) return;
    let clientX = 0;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = e.clientX;
    }
    dragDelta.current = clientX - dragStartX.current;
  };
  const handleDragEnd = () => {
    if (dragDelta.current > 60) {
      setCurrent(getIndex(-1));
    } else if (dragDelta.current < -60) {
      setCurrent(getIndex(1));
    }
    dragStartX.current = null;
    dragDelta.current = 0;
  };

  return (
    <div
      ref={sliderRef}
      className="relative w-full aspect-[4/3] sm:aspect-[7/6] md:aspect-[16/5] flex items-center justify-center overflow-visible select-none touch-pan-x mx-auto"
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchMove={handleDragMove}
      onTouchEnd={handleDragEnd}
      style={{ cursor: 'grab' }}
    >
      {/* Slider track */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Önceki görsel (sol) */}
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[18%] h-[55%] rounded-xl overflow-hidden shadow-lg transition-all duration-700 z-10 cursor-pointer group"
          style={{ filter: 'brightness(0.6) blur(1px)', opacity: 0.7 }}
          onClick={() => setCurrent(getIndex(-1))}
        >
          <Image
            src={`https://webapi.karadenizdis.com${images[getIndex(-1)]}`}
            alt="Önceki"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 30vw, 300px"
          />
        </div>
        {/* Sonraki görsel (sağ) */}
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-[18%] h-[55%] rounded-xl overflow-hidden shadow-lg transition-all duration-700 z-10 cursor-pointer group"
          style={{ filter: 'brightness(0.6) blur(1px)', opacity: 0.7 }}
          onClick={() => setCurrent(getIndex(1))}
        >
          <Image
            src={`https://webapi.karadenizdis.com${images[getIndex(1)]}`}
            alt="Sonraki"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 30vw, 300px"
          />
        </div>
        {/* Aktif görsel (ortada büyük) */}
        <div
          className="relative mx-auto w-[60%] h-[70%] rounded-2xl overflow-hidden shadow-2xl z-20 transition-all duration-700 bg-white"
          style={{ boxShadow: '0 8px 32px 0 rgba(73,100,169,0.15)' }}
        >
          <Image
            src={`https://webapi.karadenizdis.com${images[current]}`}
            alt={`Galeri ${current + 1}`}
            fill
            className="object-cover transition-transform duration-700 hover:scale-105"
            sizes="(max-width: 768px) 80vw, 700px"
            priority
          />
        </div>
      </div>
      {/* Geçiş noktaları */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
          {images.map((_, i) => (
            <button
              key={i}
              className={`w-3 h-3 rounded-full border-2 ${i === current ? "bg-[#4964A9] border-[#4964A9]" : "bg-white border-gray-300"} transition-all`}
              onClick={() => setCurrent(i)}
              aria-label={`Fotoğraf ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
} 