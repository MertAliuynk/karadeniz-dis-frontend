import Image from "next/image";
import SectionDivider from "@/components/common/SectionDivider";
import Header from "@/components/layout/Header";
import SocialBar from "@/components/layout/SocialBar";
import Treatments from "@/components/sections/TreatmentsSection";
import VideoSection from "@/components/sections/VideoSection";
import BranchesSection from "@/components/sections/BranchesSection";
import PartnersSection from "@/components/sections/PartnersSection";
import Footer from "@/components/layout/Footer";
import FeedBackSection from "@/components/sections/FeedBackSection";
import AppointmentSection from "@/components/sections/AppointmentSection";

export default function Home() {
  return (
    <div id="home" className="relative">
      <SocialBar />
      <Header />
      <div className="h-30 w-full"></div>
      <AppointmentSection />
      <SectionDivider />
      <Treatments />
      <BranchesSection />
      <FeedBackSection />
      <SectionDivider />
      <VideoSection />
      <PartnersSection showNames={true} />
      <Footer />
    </div>
  );
}
