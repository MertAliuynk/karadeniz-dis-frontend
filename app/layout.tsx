import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";


const inter = localFont({
  src: [
    {
      path: "./fonts/Inter-VariableFont_opsz,wght.ttf",
      style: "normal",
    },
    {
      path: "./fonts/Inter-Italic-VariableFont_opsz,wght.ttf",
      style: "italic",
    },
  ],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Karadeniz Ağız ve Diş Sağlığı Polikliniği",
  description:
    "Samsun’da uzman diş hekimleriyle implant, ortodonti ve estetik diş tedavisi. Hemen online randevu alın, sağlıklı bir gülümsemeye adım atın!",
  icons: {
    icon: "/sekmelogo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
