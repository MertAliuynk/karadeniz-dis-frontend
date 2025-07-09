"use client";
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { StarIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid';
import axios from 'axios';
import useWindowSize from '@/hooks/useWindowSize';

interface Feedback {
  id: string;
  name: string;
  comment: string;
  image: string;
  rating: number;
}

const FeedBackSection: React.FC = () => {
  const [startIndex, setStartIndex] = useState<number>(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const size = useWindowSize();

  let feedbacksPerPage = 4;
  if (size.width && size.width < 640) {
    feedbacksPerPage = 3;
  }

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get('https://webapi.karadenizdis.com/api/feedbacks');
        setFeedbacks(response.data);
        setLoading(false);
      } catch (err) {
        setError('Geri dönüşler yüklenemedi');
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  const scrollToFeedback = (direction: 'up' | 'down') => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    if (direction === 'up') {
      setStartIndex((prev) => Math.max(prev - feedbacksPerPage, 0));
    } else if (direction === 'down') {
      setStartIndex((prev) =>
        prev + feedbacksPerPage < feedbacks.length ? prev + feedbacksPerPage : prev
      );
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsTransitioning(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [startIndex]);

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (loading) {
    return <div className="text-gray-600 text-center p-4">Yükleniyor...</div>;
  }

  const visibleFeedbacks = feedbacks.slice(startIndex, startIndex + feedbacksPerPage);

  return (
    <div className="w-full min-h-[500px] sm:min-h-[600px] flex flex-col items-center p-3 sm:p-10 lg:p-[60px] space-y-4 sm:space-y-10 bg-white">
      <div>
        <h2 className="font-bold text-2xl sm:text-4xl lg:text-5xl bg-gradient-to-r from-[#4964A9] to-[#022171] bg-clip-text text-transparent drop-shadow-lg text-center px-4">
          Geri Dönüşlerimiz
        </h2>
      </div>
      <div
        onClick={() => scrollToFeedback('up')}
        onKeyDown={(e) => e.key === 'Enter' && scrollToFeedback('up')}
        role="button"
        tabIndex={0}
        className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-r from-[#4964A9] to-[#022171] flex items-center justify-center hover:bg-blue-700 transition-colors duration-300 cursor-pointer ${
          startIndex === 0 || isTransitioning ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        aria-label="Yukarı kaydır"
      >
        <ChevronUpIcon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
      </div>
      <div className="w-full max-w-md sm:max-w-lg lg:max-w-2xl flex flex-col items-center space-y-4 sm:space-y-6">
        {visibleFeedbacks.map((feedback) => (
          <div
            key={feedback.id}
            className={`w-full min-h-[90px] sm:min-h-[120px] rounded-3xl bg-[#F7F8FA] shadow-md flex flex-row items-center justify-between space-x-4 sm:space-x-[60px] px-4 sm:px-6 hover:scale-105 hover:shadow-xl hover:brightness-105 transition-all duration-500 ease-in-out ${
              isTransitioning ? 'opacity-70 translate-y-2' : 'opacity-100 translate-y-0'
            }`}
          >
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-white shadow-lg flex-shrink-0 bg-gray-200">
              <Image
                src={`https://webapi.karadenizdis.com${feedback.image}`}
                alt={feedback.name}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-full"
                sizes="(max-width: 640px) 64px, (max-width: 1024px) 80px, 96px"
                quality={100}
                priority={true}
                unoptimized={false}
              />
            </div>
            <div className="h-full w-3/4 flex flex-col justify-center space-y-1 sm:space-y-2">
              <p className="font-bold text-xs sm:text-sm lg:text-base text-gray-800">{feedback.name}</p>
              <div className="flex flex-row">
                {Array.from({ length: feedback.rating }).map((_, idx) => (
                  <StarIcon key={idx} className="w-2 h-2 sm:w-3 sm:h-3 text-yellow-400" />
                ))}
              </div>
              <p className="font-thin text-xs sm:text-sm text-gray-600">{feedback.comment}</p>
            </div>
          </div>
        ))}
      </div>
      <div
        onClick={() => scrollToFeedback('down')}
        onKeyDown={(e) => e.key === 'Enter' && scrollToFeedback('down')}
        role="button"
        tabIndex={0}
        className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-gradient-to-r from-[#4964A9] to-[#022171] flex items-center justify-center hover:bg-blue-700 transition-colors duration-300 cursor-pointer ${
          startIndex + feedbacksPerPage >= feedbacks.length || isTransitioning
            ? 'opacity-50 cursor-not-allowed'
            : ''
        }`}
        aria-label="Aşağı kaydır"
      >
        <ChevronDownIcon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
      </div>
    </div>
  );
};

export default FeedBackSection;