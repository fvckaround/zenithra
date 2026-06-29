import { Playfair_Display, DM_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Translator from "@/components/ui/Translator";

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
    <html lang="en" className={`${displayFont.variable} ${sansFont.variable}`}>
      <body className="bg-navy-900 text-ink antialiased font-sans">
        {children}
        <Translator />

        {/* Smartsupp Live Chat */}
        <Script
          id="smartsupp-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              var _smartsupp = _smartsupp || {};
              _smartsupp.key = '2cc7629c53f1a59a5d9096fcaf4a29f29d4b02e2';
              window.smartsupp||(function(d) {
                var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
                s=d.getElementsByTagName('script')[0];c=d.createElement('script');
                c.type='text/javascript';c.charset='utf-8';c.async=true;
                c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
              })(document);
            `,
          }}
        />
      </body>
    </html>
  );
}