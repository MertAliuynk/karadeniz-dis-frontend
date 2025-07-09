import axios from 'axios';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import SocialBar from '@/components/layout/SocialBar';
import KlinikClientContent from './KlinikClientContent';

export default async function KlinikDetayPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let branch = null;
  try {
    const res = await axios.get(`https://webapi.karadenizdis.com/api/branches`);
    branch = res.data.find((b: any) => String(b.id) === id);
  } catch (e) {
    branch = null;
  }

  if (!branch) {
    return (
      <div className="max-w-xl mx-auto mt-20 text-center">
        <h2 className="text-2xl font-bold mb-4">Klinik bulunamadı</h2>
        <a href="/kliniklerimiz" className="text-blue-600 underline">Kliniklerimize Dön</a>
      </div>
    );
  }

  const gallery: string[] = [branch.image, ...(branch.gallery || [])].filter(Boolean);

  return (
    <div className="relative min-h-screen flex flex-col bg-white">
      <SocialBar />
      <Header />
      <main className="flex-1 pt-[80px] xs:pt-[85px] sm:pt-[90px] md:pt-[95px] pb-8">
        <KlinikClientContent branch={branch} gallery={gallery} />
      </main>
      <Footer />
    </div>
  );
} 