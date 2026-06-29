import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const displayFont = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display-serif",
});

const sansFont = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans-base",
});

export const metadata = {
  title: "Zenithra Holding | Invest Beyond Limits",
  description:
    "Zenithra Holding is a premium digital asset investment platform offering secure, transparent, and high-yield crypto investment plans.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${displayFont.variable} ${sansFont.variable}`}
    >
      <body className="bg-navy-900 text-ink antialiased font-sans">
        {children}
      </body>
    </html>
  );
}