import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Karadeniz Ağız ve Diş Sağlığı Polikliniği",
  description: "Samsun’da uzman diş hekimleriyle implant, ortodonti ve estetik diş tedavisi. Hemen online randevu alın, sağlıklı bir gülümsemeye adım atın!",
  icons: {
    icon: "/sekmelogo.png",
  },
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
