"use client";
import React, { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import useWindowSize from '@/hooks/useWindowSize';

interface Video {
  id: string;
  video_id: string;
  title: string;
  description: string;
}

const VideoSection: React.FC = () => {
  const [startIndex, setStartIndex] = useState(0);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const size = useWindowSize();

  let cardsPerPage = 6;
  if (size.width && size.width < 640) {
    cardsPerPage = 3;
  }

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await axios.get('https://webapi.karadenizdis.com/api/videos');
        setVideos(response.data);
        setLoading(false);
      } catch (err) {
        setError('Videolar yüklenemedi');
        setLoading(false);
      }
    };
    fetchVideos();
  }, []);

  const scrollLeft = () => {
    setStartIndex((prev) => Math.max(prev - cardsPerPage, 0));
  };

  const scrollRight = () => {
    setStartIndex((prev) =>
      prev + cardsPerPage < videos.length ? prev + cardsPerPage : prev
    );
  };

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (loading) {
    return <div className="text-gray-600 text-center p-4">Yükleniyor...</div>;
  }

  const visibleVideos = videos.slice(startIndex, startIndex + cardsPerPage);

  return (
    <div className="w-full min-h-[600px] sm:min-h-[700px] py-4 sm:py-8 lg:py-10 flex flex-col items-center justify-center bg-gradient-to-t from-white to-[#4964a9]">
      <div className="w-full sm:w-4/5 lg:w-2/3 rounded-4xl bg-white flex flex-col items-center space-y-4 sm:space-y-8 lg:space-y-10 p-2 sm:p-6 lg:p-8">
        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold bg-gradient-to-r from-[#4964a9] to-[#022171] bg-clip-text text-transparent text-center px-4">
          Video Blog
        </h2>
        <div className="w-full flex flex-row items-center space-x-2 sm:space-x-4">
          <div
            onClick={scrollLeft}
            onKeyDown={(e) => e.key === 'Enter' && scrollLeft()}
            role="button"
            tabIndex={0}
            className={`h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-r from-[#4964A9] to-[#022171] flex items-center justify-center hover:bg-blue-700 transition-colors duration-300 cursor-pointer ${
              startIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label="Sola kaydır"
          >
            <ChevronLeftIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full">
            {visibleVideos.map((video) => (
              <div key={video.id} className="relative w-full">
                <input
                  type="checkbox"
                  id={`modal-toggle-${video.id}`}
                  className="hidden peer"
                />
                <label
                  htmlFor={`modal-toggle-${video.id}`}
                  className="block cursor-pointer bg-gray-200 rounded-4xl overflow-hidden hover:scale-105 transition-all duration-300"
                >
                  <div className="aspect-video">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${video.video_id}`}
                      title={video.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <div className="p-3 sm:p-4">
                    <p className="font-bold text-sm sm:text-base lg:text-lg line-clamp-2 min-h-[2.5em] sm:min-h-[3em]">{video.title}</p>
                    <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 min-h-[2.5em] sm:min-h-[3em]">{video.description}</p>
                  </div>
                </label>
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 scale-0 peer-checked:scale-100 transition-transform duration-300">
                  <label
                    htmlFor={`modal-toggle-${video.id}`}
                    className="absolute inset-0 cursor-pointer"
                    aria-label="Modalı kapat"
                  ></label>
                  <div className="w-11/12 sm:w-3/4 lg:w-1/2 bg-white p-3 sm:p-4 lg:p-6 rounded-2xl relative z-10">
                    <div className="aspect-video w-full">
                      <iframe
                        className="w-full h-full rounded-xl"
                        src={`https://www.youtube.com/embed/${video.video_id}?autoplay=0`}
                        title={`${video.title} modal`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <p className="mt-2 sm:mt-4 font-bold text-sm sm:text-base lg:text-lg">{video.title}</p>
                    <p className="text-xs sm:text-sm text-gray-600">{video.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div
            onClick={scrollRight}
            onKeyDown={(e) => e.key === 'Enter' && scrollRight()}
            role="button"
            tabIndex={0}
            className={`h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-gradient-to-r from-[#4964A9] to-[#022171] flex items-center justify-center hover:bg-blue-700 transition-colors duration-300 cursor-pointer ${
              startIndex + cardsPerPage >= videos.length ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label="Sağa kaydır"
          >
            <ChevronRightIcon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoSection;