import Header from "@/components/layout/Header"
import SocialBar from "@/components/layout/SocialBar";
export default function ComingSoonPage() {
  return (
    <div className="relative">
        <Header></Header>
        <SocialBar></SocialBar>
        <main className="flex items-center justify-center h-screen">
            <h1 className="text-4xl font-bold text-gray-700">Yakında Gelecek 🚀</h1>
        </main>
    </div>
);}