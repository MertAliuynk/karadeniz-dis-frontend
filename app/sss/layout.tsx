import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sıkça Sorulan Sorular (SSS) - Diş Kliniği',
  description: 'Diş kliniğimiz hakkında sıkça sorulan sorular ve cevapları. Randevu, tedavi, fiyat ve diğer konularda bilgi alın.',
  keywords: 'diş kliniği, sıkça sorulan sorular, SSS, randevu, tedavi, fiyat',
  openGraph: {
    title: 'Sıkça Sorulan Sorular (SSS) - Diş Kliniği',
    description: 'Diş kliniğimiz hakkında sıkça sorulan sorular ve cevapları.',
    type: 'website',
  },
  alternates: {
    canonical: '/sss',
  },
};

export default function SSSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 