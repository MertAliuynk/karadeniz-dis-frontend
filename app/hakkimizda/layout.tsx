import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hakkımızda - Diş Kliniği',
  description: '20 yılı aşkın deneyimimizle Samsun\'un önde gelen diş sağlığı kuruluşu. Modern teknoloji ve uzman kadromuzla hizmetinizdeyiz.',
  keywords: 'diş kliniği, hakkımızda, Samsun, diş sağlığı, deneyim, misyon, vizyon',
  openGraph: {
    title: 'Hakkımızda - Diş Kliniği',
    description: '20 yılı aşkın deneyimimizle Samsun\'un önde gelen diş sağlığı kuruluşu.',
    type: 'website',
  },
  alternates: {
    canonical: '/hakkimizda',
  },
};

export default function HakkimizdaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 