// components/ui/Card.tsx
import React from 'react';
import Image, { StaticImageData } from 'next/image';

interface CardProps {
  id: string;
  title: string;
  description?: string;
  image: string | StaticImageData;
  imageAlt: string;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  id,
  title,
  description,
  image,
  imageAlt,
  onClick,
  className = '',
  children,
}) => {
  return (
    <div
      key={id}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick && onClick()}
      role={onClick ? 'button' : 'article'}
      tabIndex={onClick ? 0 : undefined}
      className={`bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 ${className}`}
    >
      <div className="relative w-full h-2/3">
        <Image
          src={image}
          alt={imageAlt}
          fill
          style={{ objectFit: 'cover' }}
          className="rounded-t-xl"
          quality={90}
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <div className="p-4 flex flex-col items-center justify-center">
        <p className="font-extrabold text-xl text-gray-800">{title}</p>
        {description && <p className="text-sm text-gray-600 mt-2">{description}</p>}
        {children}
      </div>
    </div>
  );
};

export default Card;