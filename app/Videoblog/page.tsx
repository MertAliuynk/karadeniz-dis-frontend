"use client";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SocialBar from '@/components/layout/SocialBar';
import { useEscapeKey } from '@/hooks/useEscapeKey';

interface Video {
  id: number;
  video_id: string;
  title: string;
  description: string;
  long_description?: string;
}

const VideoblogPage = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalVideo, setModalVideo] = useState<Video | null>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  useEscapeKey(() => setModalVideo(null));

  const fetchVideos = async () => {
    try {
      const response = await axios.get('https://webapi.karadenizdis.com/api/videos');
      setVideos(response.data);
      setLoading(false);
    } catch (err) {
      setError('Videolar yüklenirken bir hata oluştu');
      setLoading(false);
    }
  };

  const filteredVideos = videos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F7F8FA]">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">Yükleniyor...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F7F8FA]">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-500">{error}</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex flex-col">
      <Header />
      <main className="flex-grow pt-[80px] xs:pt-[85px] sm:pt-[90px] md:pt-[95px]">
        <div className="w-full py-4 xs:py-6 sm:py-8">
          <div className="container mx-auto px-2 xs:px-3 sm:px-4">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-[#4964A9] to-[#022171] bg-clip-text text-transparent">
              Videoblog
            </h1>
          </div>
        </div>

        <div className="container mx-auto px-2 xs:px-3 sm:px-4 py-4 xs:py-6 sm:py-8">
          {/* Arama Kutusu */}
          <div className="max-w-2xl mx-auto mb-6 xs:mb-8 sm:mb-12">
            <input
              type="text"
              placeholder="Video ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 xs:p-4 rounded-lg border-2 border-gray-300 focus:outline-none focus:border-[#4964A9] transition-all duration-300 bg-white text-gray-800 text-sm xs:text-base font-medium xs:font-semibold shadow-md hover:shadow-lg"
            />
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 sm:gap-6 lg:gap-8">
            {filteredVideos.map((video) => (
              <div
                key={video.id}
                className="bg-white rounded-lg xs:rounded-xl shadow-md hover:shadow-lg overflow-hidden border border-gray-100 group cursor-pointer flex flex-col h-[280px] xs:h-[300px] sm:h-[320px] md:h-[340px]"
                onClick={() => setModalVideo(video)}
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && setModalVideo(video)}
                aria-label={`Videoyu aç: ${video.title}`}
              >
                <div className="aspect-w-16 aspect-h-9 bg-gray-200 group-hover:scale-[1.02] transition-transform duration-300">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.video_id}`}
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full rounded-t-lg xs:rounded-t-xl"
                  />
                </div>
                <div className="p-3 xs:p-4 flex-1 flex flex-col justify-between">
                  <h2 className="text-base xs:text-lg font-bold text-gray-800 mb-1 line-clamp-2 group-hover:text-[#4964A9] transition-colors">{video.title}</h2>
                  <p className="text-xs xs:text-sm text-gray-600 line-clamp-3 flex-1">{video.description}</p>
                </div>
              </div>
            ))}
          </div>

          {filteredVideos.length === 0 && (
            <div className="text-center text-gray-600 mt-4 xs:mt-6 sm:mt-8 text-sm xs:text-base">
              Arama kriterlerinize uygun video bulunamadı.
            </div>
          )}
        </div>
      </main>

      {/* Modal */}
      {modalVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-2 xs:p-3 sm:p-4">
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={() => setModalVideo(null)}
            aria-label="Modalı kapat"
          ></div>
          <div className="w-full max-w-3xl bg-white p-0 rounded-lg xs:rounded-xl relative z-10 max-h-[95vh] flex flex-col overflow-hidden">
            <div className="w-full bg-black flex-shrink-0" style={{height: '240px', maxHeight: '40vh'}}>
              <iframe
                className="w-full h-full rounded-t-lg xs:rounded-t-xl"
                src={`https://www.youtube.com/embed/${modalVideo.video_id}?autoplay=0`}
                title={`${modalVideo.title} modal`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                style={{height: '100%', width: '100%'}}
              ></iframe>
            </div>
            <div className="flex-1 overflow-y-auto p-3 xs:p-4 sm:p-6">
              <h2 className="mt-1 xs:mt-2 font-bold text-base xs:text-lg sm:text-xl text-gray-800">{modalVideo.title}</h2>
              <p className="text-gray-600 mt-2 break-words overflow-x-hidden text-sm xs:text-base">{modalVideo.description}</p>
              {modalVideo.long_description && (
                <div className="mt-3 xs:mt-4 pt-3 xs:pt-4 border-t border-gray-200">
                  <p className="text-gray-700 whitespace-pre-line break-words overflow-x-hidden text-sm xs:text-base">{modalVideo.long_description}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="mt-auto">
        <SocialBar />
        <Footer />
      </div>
    </div>
  );
};

export default VideoblogPage; 