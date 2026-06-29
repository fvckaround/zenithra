"use client";

import { useEffect, useState, useRef } from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import Container from "@/components/ui/Container";
import ScrollReveal from "@/components/ui/ScrollReveal";

const COINS = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum" },
  { id: "tether", symbol: "USDT", name: "Tether" },
  { id: "binancecoin", symbol: "BNB", name: "BNB" },
  { id: "solana", symbol: "SOL", name: "Solana" },
  { id: "ripple", symbol: "XRP", name: "XRP" },
  { id: "usd-coin", symbol: "USDC", name: "USD Coin" },
  { id: "cardano", symbol: "ADA", name: "Cardano" },
  { id: "avalanche-2", symbol: "AVAX", name: "Avalanche" },
  { id: "dogecoin", symbol: "DOGE", name: "Dogecoin" },
  { id: "polkadot", symbol: "DOT", name: "Polkadot" },
  { id: "chainlink", symbol: "LINK", name: "Chainlink" },
  { id: "tron", symbol: "TRX", name: "TRON" },
  { id: "shiba-inu", symbol: "SHIB", name: "Shiba Inu" },
  { id: "matic-network", symbol: "MATIC", name: "Polygon" },
  { id: "litecoin", symbol: "LTC", name: "Litecoin" },
  { id: "bitcoin-cash", symbol: "BCH", name: "Bitcoin Cash" },
  { id: "uniswap", symbol: "UNI", name: "Uniswap" },
  { id: "stellar", symbol: "XLM", name: "Stellar" },
  { id: "monero", symbol: "XMR", name: "Monero" },
  { id: "ethereum-classic", symbol: "ETC", name: "Ethereum Classic" },
  { id: "filecoin", symbol: "FIL", name: "Filecoin" },
  { id: "vechain", symbol: "VET", name: "VeChain" },
  { id: "cosmos", symbol: "ATOM", name: "Cosmos" },
  { id: "hedera-hashgraph", symbol: "HBAR", name: "Hedera" },
  { id: "aptos", symbol: "APT", name: "Aptos" },
  { id: "arbitrum", symbol: "ARB", name: "Arbitrum" },
  { id: "optimism", symbol: "OP", name: "Optimism" },
  { id: "near", symbol: "NEAR", name: "NEAR Protocol" },
  { id: "internet-computer", symbol: "ICP", name: "Internet Computer" },
  { id: "injective-protocol", symbol: "INJ", name: "Injective" },
  { id: "sei-network", symbol: "SEI", name: "Sei" },
  { id: "the-sandbox", symbol: "SAND", name: "The Sandbox" },
  { id: "decentraland", symbol: "MANA", name: "Decentraland" },
  { id: "aave", symbol: "AAVE", name: "Aave" },
  { id: "maker", symbol: "MKR", name: "Maker" },
  { id: "the-graph", symbol: "GRT", name: "The Graph" },
  { id: "quant-network", symbol: "QNT", name: "Quant" },
  { id: "algorand", symbol: "ALGO", name: "Algorand" },
  { id: "flow", symbol: "FLOW", name: "Flow" },
];

export default function CryptoPrices() {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef(null);

  const fetchPrices = async () => {
    try {
      const ids = COINS.map((c) => c.id).join(",");
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true&include_market_cap=true`,
        { cache: "no-store" }
      );
      const data = await res.json();
      const merged = COINS.map((coin) => ({
        ...coin,
        price: data[coin.id]?.usd || 0,
        change24h: data[coin.id]?.usd_24h_change || 0,
        marketCap: data[coin.id]?.usd_market_cap || 0,
      }));
      setPrices(merged);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Failed to fetch prices:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  // Duplicate prices for seamless infinite loop
  const displayPrices = [...prices, ...prices];

  return (
    <section className="border-t border-white/5 bg-navy-900 py-16 sm:py-20">
      <Container>
        <ScrollReveal>
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gold-500">
                Live Market
              </p>
              <h2 className="font-display text-3xl font-medium text-ink sm:text-4xl">
                Crypto <span className="italic text-gold-400">Prices</span>
              </h2>
              <p className="mt-2 text-sm text-ink-muted">
                Real-time prices across {COINS.length} assets
              </p>
            </div>
            {lastUpdated && (
              <p className="text-xs text-ink-faint">
                Updated {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
        </ScrollReveal>
      </Container>

      {/* Ticker */}
      <div
        className="relative overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Left fade */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-navy-900 to-transparent" />
        {/* Right fade */}
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-navy-900 to-transparent" />

        {loading ? (
          <div className="flex gap-4 px-6 py-4">
            {Array(8).fill(0).map((_, i) => (
              <div
                key={i}
                className="h-24 w-44 flex-shrink-0 animate-pulse rounded-2xl border border-white/5 bg-navy-800/40"
              />
            ))}
          </div>
        ) : (
          <div
            ref={trackRef}
            className="flex gap-4 px-6 py-4"
            style={{
              animation: isPaused
                ? "none"
                : "ticker-slide 60s linear infinite",
              width: "max-content",
            }}
          >
            {displayPrices.map((coin, i) => (
              <CoinCard key={`${coin.id}-${i}`} coin={coin} />
            ))}
          </div>
        )}
      </div>

      <Container>
        <p className="mt-6 text-center text-xs text-ink-faint">
          Prices powered by CoinGecko · Updates every 60 seconds · Hover to pause
        </p>
      </Container>

      <style jsx global>{`
        @keyframes ticker-slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}

function CoinCard({ coin }) {
  const positive = coin.change24h >= 0;

  const formatPrice = (price) => {
    if (price === 0) return "$0.00";
    if (price < 0.001) return `$${price.toFixed(6)}`;
    if (price < 0.01) return `$${price.toFixed(5)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    if (price < 10) return `$${price.toFixed(3)}`;
    return `$${price.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatMarketCap = (mc) => {
    if (mc >= 1_000_000_000_000) return `$${(mc / 1_000_000_000_000).toFixed(2)}T`;
    if (mc >= 1_000_000_000) return `$${(mc / 1_000_000_000).toFixed(1)}B`;
    if (mc >= 1_000_000) return `$${(mc / 1_000_000).toFixed(1)}M`;
    return `$${mc.toLocaleString()}`;
  };

  return (
    <div className="w-44 flex-shrink-0 cursor-default rounded-2xl border border-white/5 bg-navy-800/60 p-4 transition-all hover:border-gold-500/20 hover:bg-navy-800 hover:shadow-gold-sm">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-500/10 text-[9px] font-bold text-gold-400">
            {coin.symbol.slice(0, 4)}
          </div>
          <div>
            <p className="text-xs font-semibold text-ink">{coin.symbol}</p>
            <p className="max-w-[60px] truncate text-[9px] text-ink-faint">
              {coin.name}
            </p>
          </div>
        </div>
      </div>

      <p className="font-display text-base text-ink">{formatPrice(coin.price)}</p>

      <div className="mt-2 flex items-center justify-between">
        <p className="text-[9px] text-ink-faint">
          {formatMarketCap(coin.marketCap)}
        </p>
        <div
          className={`flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[9px] font-medium ${
            positive
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {positive ? <TrendingUp size={8} /> : <TrendingDown size={8} />}
          {Math.abs(coin.change24h).toFixed(2)}%
        </div>
      </div>
    </div>
  );
}