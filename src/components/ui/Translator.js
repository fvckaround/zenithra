"use client";

import { useEffect, useState } from "react";
import { Globe } from "lucide-react";

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "it", label: "Italiano" },
  { code: "pt", label: "Português" },
  { code: "ru", label: "Русский" },
  { code: "zh-CN", label: "中文 (简体)" },
  { code: "zh-TW", label: "中文 (繁體)" },
  { code: "ja", label: "日本語" },
  { code: "ko", label: "한국어" },
  { code: "ar", label: "العربية" },
  { code: "hi", label: "हिन्दी" },
  { code: "bn", label: "বাংলা" },
  { code: "tr", label: "Türkçe" },
  { code: "vi", label: "Tiếng Việt" },
  { code: "th", label: "ภาษาไทย" },
  { code: "id", label: "Bahasa Indonesia" },
  { code: "ms", label: "Bahasa Melayu" },
  { code: "fa", label: "فارسی" },
  { code: "ur", label: "اردو" },
  { code: "nl", label: "Nederlands" },
  { code: "pl", label: "Polski" },
  { code: "uk", label: "Українська" },
  { code: "sv", label: "Svenska" },
  { code: "da", label: "Dansk" },
  { code: "fi", label: "Suomi" },
  { code: "no", label: "Norsk" },
  { code: "cs", label: "Čeština" },
  { code: "ro", label: "Română" },
  { code: "hu", label: "Magyar" },
  { code: "el", label: "Ελληνικά" },
  { code: "he", label: "עברית" },
  { code: "sk", label: "Slovenčina" },
  { code: "bg", label: "Български" },
  { code: "hr", label: "Hrvatski" },
  { code: "lt", label: "Lietuvių" },
  { code: "lv", label: "Latviešu" },
  { code: "et", label: "Eesti" },
  { code: "sl", label: "Slovenščina" },
  { code: "sq", label: "Shqip" },
  { code: "sr", label: "Српски" },
  { code: "mk", label: "Македонски" },
  { code: "bs", label: "Bosanski" },
  { code: "af", label: "Afrikaans" },
  { code: "sw", label: "Kiswahili" },
  { code: "am", label: "አማርኛ" },
  { code: "yo", label: "Yorùbá" },
  { code: "ig", label: "Igbo" },
  { code: "ha", label: "Hausa" },
  { code: "zu", label: "isiZulu" },
  { code: "xh", label: "isiXhosa" },
  { code: "so", label: "Soomaali" },
  { code: "tl", label: "Filipino" },
  { code: "my", label: "မြန်မာဘာသာ" },
  { code: "km", label: "ភាសាខ្មែរ" },
  { code: "lo", label: "ລາວ" },
  { code: "ne", label: "नेपाली" },
  { code: "si", label: "සිංහල" },
  { code: "ta", label: "தமிழ்" },
  { code: "te", label: "తెలుగు" },
  { code: "ml", label: "മലയാളം" },
  { code: "kn", label: "ಕನ್ನಡ" },
  { code: "gu", label: "ગુજરાતી" },
  { code: "pa", label: "ਪੰਜਾਬੀ" },
  { code: "mr", label: "मराठी" },
  { code: "az", label: "Azərbaycan" },
  { code: "kk", label: "Қазақша" },
  { code: "uz", label: "O'zbek" },
  { code: "ky", label: "Кыргызча" },
  { code: "tk", label: "Türkmen" },
  { code: "mn", label: "Монгол" },
  { code: "ka", label: "ქართული" },
  { code: "hy", label: "Հայերեն" },
  { code: "be", label: "Беларуская" },
  { code: "is", label: "Íslenska" },
  { code: "ga", label: "Gaeilge" },
  { code: "cy", label: "Cymraeg" },
  { code: "eu", label: "Euskara" },
  { code: "gl", label: "Galego" },
  { code: "ca", label: "Català" },
  { code: "lb", label: "Lëtzebuergesch" },
  { code: "mt", label: "Malti" },
];

export default function Translator() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("en");
  const [search, setSearch] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Load Google Translate script
    const addScript = () => {
      if (document.getElementById("google-translate-script")) {
        setLoaded(true);
        return;
      }
      window.googleTranslateElementInit = () => setLoaded(true);
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    };

    addScript();
  }, []);

  useEffect(() => {
    if (!loaded) return;
    // Initialize hidden Google Translate element
    if (!document.getElementById("google_translate_element")) return;
    new window.google.translate.TranslateElement(
      {
        pageLanguage: "en",
        autoDisplay: false,
      },
      "google_translate_element"
    );
  }, [loaded]);

  const translateTo = (langCode) => {
    setSelected(langCode);
    setOpen(false);
    setSearch("");

    // Use Google Translate cookie method
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1);
    document.cookie = `googtrans=/en/${langCode}; expires=${expires.toUTCString()}; path=/`;
    document.cookie = `googtrans=/en/${langCode}; expires=${expires.toUTCString()}; path=/; domain=${window.location.hostname}`;

    window.location.reload();
  };

  const resetTranslation = () => {
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
    setSelected("en");
    setOpen(false);
    window.location.reload();
  };

  const filtered = LANGUAGES.filter((l) =>
    l.label.toLowerCase().includes(search.toLowerCase()) ||
    l.code.toLowerCase().includes(search.toLowerCase())
  );

  const currentLang = LANGUAGES.find((l) => l.code === selected);

  return (
    <>
      {/* Hidden Google Translate element */}
      <div id="google_translate_element" className="hidden" />

      {/* Translator button */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="relative">
          {/* Dropdown */}
          {open && (
            <div className="absolute bottom-14 right-0 w-64 rounded-2xl border border-white/10 bg-navy-800/95 backdrop-blur-xl shadow-gold overflow-hidden">
              <div className="p-3 border-b border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-ink">Select Language</p>
                  {selected !== "en" && (
                    <button
                      onClick={resetTranslation}
                      className="text-[10px] text-gold-400 hover:text-gold-300"
                    >
                      Reset to English
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Search language..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-white/10 bg-navy-900/60 px-3 py-2 text-xs text-ink outline-none placeholder:text-ink-faint focus:border-gold-500/50"
                  autoFocus
                />
              </div>
              <div className="max-h-64 overflow-y-auto">
                {filtered.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => translateTo(lang.code)}
                    className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-xs transition-colors hover:bg-navy-700/50 ${
                      selected === lang.code
                        ? "text-gold-400 bg-gold-500/5"
                        : "text-ink-muted"
                    }`}
                  >
                    {lang.label}
                    {selected === lang.code && (
                      <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                    )}
                  </button>
                ))}
                {filtered.length === 0 && (
                  <p className="px-4 py-6 text-center text-xs text-ink-faint">
                    No language found
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Toggle button */}
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-navy-800/95 px-4 py-2.5 text-sm font-medium text-ink-muted backdrop-blur-xl shadow-gold-sm transition-colors hover:border-gold-500/30 hover:text-gold-400"
          >
            <Globe size={16} />
            <span>{currentLang?.label || "English"}</span>
          </button>
        </div>
      </div>
    </>
  );
}