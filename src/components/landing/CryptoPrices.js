"use client";

import { useEffect, useState } from "react";
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
  const [search, setSearch] = useState("");

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

  const filtered = prices.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.symbol.toLowerCase().includes(search.toLowerCase())
  );

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
            </div>
            <div className="flex flex-col items-end gap-2">
              <input
                type="text"
                placeholder="Search coin..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-48 rounded-lg border border-white/10 bg-navy-800/60 px-4 py-2 text-sm text-ink outline-none placeholder:text-ink-faint focus:border-gold-500/50"
              />
              {lastUpdated && (
                <p className="text-xs text-ink-faint">
                  Updated {lastUpdated.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
        </ScrollReveal>

        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {Array(20).fill(0).map((_, i) => (
              <div
                key={i}
                className="h-28 animate-pulse rounded-2xl border border-white/5 bg-navy-800/40"
              />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              {filtered.map((coin, i) => (
                <ScrollReveal key={coin.id} delay={i * 0.02}>
                  <CoinCard coin={coin} />
                </ScrollReveal>
              ))}
            </div>
            {filtered.length === 0 && (
              <p className="mt-10 text-center text-sm text-ink-faint">
                No coins found for &quot;{search}&quot;
              </p>
            )}
          </>
        )}

        <p className="mt-8 text-center text-xs text-ink-faint">
          Prices powered by CoinGecko · Updates every 60 seconds
        </p>
      </Container>
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
    <div className="group rounded-2xl border border-white/5 bg-navy-800/60 p-5 transition-colors hover:border-gold-500/20 hover:bg-navy-800">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold-500/10 text-[10px] font-bold text-gold-400">
            {coin.symbol.slice(0, 4)}
          </div>
          <div>
            <p className="text-sm font-medium text-ink">{coin.symbol}</p>
            <p className="text-[10px] text-ink-faint truncate max-w-[80px]">{coin.name}</p>
          </div>
        </div>
        <div
          className={`flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium ${
            positive
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-red-500/10 text-red-400"
          }`}
        >
          {positive ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {Math.abs(coin.change24h).toFixed(2)}%
        </div>
      </div>

      <p className="font-display text-lg text-ink">{formatPrice(coin.price)}</p>
      <p className="mt-1 text-[10px] text-ink-faint">
        MCap: {formatMarketCap(coin.marketCap)}
      </p>
    </div>
  );
}