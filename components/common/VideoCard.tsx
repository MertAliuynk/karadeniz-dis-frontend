// components/ui/VideoCard.tsx
"use client";
import React, { useState } from 'react';
import { useEscapeKey } from '@/hooks/useEscapeKey';

interface VideoCardProps {
  id: string;
  title: string;
  description: string;
  index: number;
}

const VideoCard: React.FC<VideoCardProps> = ({ id, title, description, index }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEscapeKey(() => setIsModalOpen(false));

  return (
    <div className="relative">
      <div
        onClick={() => setIsModalOpen(true)}
        onKeyDown={(e) => e.key === 'Enter' && setIsModalOpen(true)}
        role="button"
        tabIndex={0}
        className="block cursor-pointer bg-gray-200 rounded-4xl overflow-hidden hover:scale-105 transition"
        aria-label={`Video oynat: ${title}`}
      >
        <div className="aspect-video">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${id}`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            loading="lazy"
          ></iframe>
        </div>
        <div className="p-4">
          <p className="font-bold">{title}</p>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 scale-100 transition-transform duration-300">
          <div
            onClick={() => setIsModalOpen(false)}
            onKeyDown={(e) => e.key === 'Enter' && setIsModalOpen(false)}
            role="button"
            tabIndex={0}
            className="absolute inset-0 cursor-pointer"
            aria-label="Modalı kapat"
          ></div>
          <div className="w-11/12 md:w-2/3 lg:w-1/2 bg-white p-4 rounded-2xl relative z-10">
            <div className="aspect-video w-full">
              <iframe
                className="w-full h-full rounded-xl"
                src={`https://www.youtube.com/embed/${id}?autoplay=0`}
                title={`${title} modal`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
            <p className="mt-4 font-bold">{title}</p>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCard;