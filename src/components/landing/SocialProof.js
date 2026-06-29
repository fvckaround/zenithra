"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EVENTS = [
  { name: "James K.", action: "deposited", amount: "$5,000", coin: "Bitcoin" },
  { name: "Sophie T.", action: "invested in", amount: "Growth Plan", coin: "" },
  { name: "Daniel R.", action: "withdrew", amount: "$2,800", coin: "USDT" },
  { name: "Elena V.", action: "deposited", amount: "$12,500", coin: "Ethereum" },
  { name: "Marcus T.", action: "invested in", amount: "Elite Plan", coin: "" },
  { name: "Claire D.", action: "deposited", amount: "$1,000", coin: "Bitcoin" },
  { name: "Robert H.", action: "withdrew", amount: "$8,400", coin: "Bitcoin" },
  { name: "Natalie W.", action: "invested in", amount: "Starter Plan", coin: "" },
  { name: "Lucas B.", action: "deposited", amount: "$25,000", coin: "USDT" },
  { name: "Isabelle M.", action: "withdrew", amount: "$4,200", coin: "Ethereum" },
  { name: "Oliver S.", action: "deposited", amount: "$3,500", coin: "Bitcoin" },
  { name: "Emma R.", action: "invested in", amount: "Growth Plan", coin: "" },
  { name: "William H.", action: "deposited", amount: "$50,000", coin: "USDT" },
  { name: "Ava M.", action: "withdrew", amount: "$1,500", coin: "Bitcoin" },
  { name: "Thomas B.", action: "invested in", amount: "Elite Plan", coin: "" },
  { name: "Grace L.", action: "deposited", amount: "$7,200", coin: "Ethereum" },
  { name: "Henry P.", action: "withdrew", amount: "$3,100", coin: "USDT" },
  { name: "Mia C.", action: "deposited", amount: "$9,800", coin: "Bitcoin" },
  { name: "Jack W.", action: "invested in", amount: "Growth Plan", coin: "" },
  { name: "Lily A.", action: "deposited", amount: "$2,200", coin: "USDT" },
  { name: "Noah F.", action: "withdrew", amount: "$6,700", coin: "Bitcoin" },
  { name: "Chloe M.", action: "invested in", amount: "Starter Plan", coin: "" },
  { name: "Ethan D.", action: "deposited", amount: "$15,000", coin: "Ethereum" },
  { name: "Zoe B.", action: "withdrew", amount: "$900", coin: "USDT" },
  { name: "Liam R.", action: "invested in", amount: "Elite Plan", coin: "" },
  { name: "Hannah S.", action: "deposited", amount: "$4,500", coin: "Bitcoin" },
  { name: "Mason T.", action: "withdrew", amount: "$11,200", coin: "Ethereum" },
  { name: "Ella K.", action: "deposited", amount: "$8,000", coin: "USDT" },
  { name: "Logan P.", action: "invested in", amount: "Growth Plan", coin: "" },
  { name: "Aria N.", action: "deposited", amount: "$30,000", coin: "Bitcoin" },
  { name: "Aiden C.", action: "withdrew", amount: "$5,500", coin: "USDT" },
  { name: "Scarlett J.", action: "invested in", amount: "Starter Plan", coin: "" },
  { name: "Carter L.", action: "deposited", amount: "$6,300", coin: "Ethereum" },
  { name: "Penelope H.", action: "withdrew", amount: "$2,400", coin: "Bitcoin" },
  { name: "Jackson M.", action: "invested in", amount: "Elite Plan", coin: "" },
  { name: "Riley G.", action: "deposited", amount: "$18,500", coin: "USDT" },
  { name: "Sebastian F.", action: "withdrew", amount: "$7,800", coin: "Ethereum" },
  { name: "Layla W.", action: "deposited", amount: "$3,200", coin: "Bitcoin" },
  { name: "Owen B.", action: "invested in", amount: "Growth Plan", coin: "" },
  { name: "Victoria R.", action: "deposited", amount: "$45,000", coin: "USDT" },
  { name: "Elijah S.", action: "withdrew", amount: "$1,800", coin: "Bitcoin" },
  { name: "Aurora T.", action: "invested in", amount: "Elite Plan", coin: "" },
  { name: "Jayden K.", action: "deposited", amount: "$5,700", coin: "Ethereum" },
  { name: "Bella A.", action: "withdrew", amount: "$9,300", coin: "USDT" },
  { name: "Luke D.", action: "invested in", amount: "Starter Plan", coin: "" },
  { name: "Stella P.", action: "deposited", amount: "$11,000", coin: "Bitcoin" },
  { name: "Gabriel N.", action: "withdrew", amount: "$4,600", coin: "Ethereum" },
  { name: "Hazel C.", action: "deposited", amount: "$22,000", coin: "USDT" },
  { name: "Isaac L.", action: "invested in", amount: "Growth Plan", coin: "" },
  { name: "Violet M.", action: "deposited", amount: "$8,800", coin: "Bitcoin" },
  { name: "Christopher W.", action: "withdrew", amount: "$3,900", coin: "USDT" },
  { name: "Savannah R.", action: "invested in", amount: "Elite Plan", coin: "" },
  { name: "Andrew F.", action: "deposited", amount: "$14,200", coin: "Ethereum" },
  { name: "Ellie B.", action: "withdrew", amount: "$6,100", coin: "Bitcoin" },
  { name: "Joshua T.", action: "invested in", amount: "Growth Plan", coin: "" },
  { name: "Addison S.", action: "deposited", amount: "$2,900", coin: "USDT" },
  { name: "Ryan K.", action: "withdrew", amount: "$13,500", coin: "Ethereum" },
  { name: "Nora H.", action: "invested in", amount: "Starter Plan", coin: "" },
  { name: "Nathan G.", action: "deposited", amount: "$35,000", coin: "Bitcoin" },
  { name: "Leah P.", action: "withdrew", amount: "$2,100", coin: "USDT" },
  { name: "Dylan C.", action: "invested in", amount: "Elite Plan", coin: "" },
  { name: "Paisley N.", action: "deposited", amount: "$6,800", coin: "Ethereum" },
  { name: "Caleb M.", action: "withdrew", amount: "$4,300", coin: "Bitcoin" },
  { name: "Lillian W.", action: "invested in", amount: "Growth Plan", coin: "" },
  { name: "Hunter R.", action: "deposited", amount: "$9,100", coin: "USDT" },
  { name: "Eleanor F.", action: "withdrew", amount: "$7,400", coin: "Ethereum" },
  { name: "Connor B.", action: "deposited", amount: "$16,500", coin: "Bitcoin" },
  { name: "Naomi T.", action: "invested in", amount: "Elite Plan", coin: "" },
  { name: "Anthony S.", action: "deposited", amount: "$3,700", coin: "USDT" },
  { name: "Aubrey K.", action: "withdrew", amount: "$5,200", coin: "Bitcoin" },
  { name: "Eli P.", action: "invested in", amount: "Starter Plan", coin: "" },
  { name: "Brooklyn H.", action: "deposited", amount: "$27,000", coin: "Ethereum" },
  { name: "Charles G.", action: "withdrew", amount: "$1,200", coin: "USDT" },
  { name: "Zoey C.", action: "invested in", amount: "Growth Plan", coin: "" },
  { name: "Colton N.", action: "deposited", amount: "$7,600", coin: "Bitcoin" },
  { name: "Lucy M.", action: "withdrew", amount: "$8,900", coin: "Ethereum" },
  { name: "Jeremiah W.", action: "invested in", amount: "Elite Plan", coin: "" },
  { name: "Anna R.", action: "deposited", amount: "$4,100", coin: "USDT" },
  { name: "Easton F.", action: "withdrew", amount: "$3,300", coin: "Bitcoin" },
  { name: "Caroline B.", action: "invested in", amount: "Growth Plan", coin: "" },
  { name: "Jordan T.", action: "deposited", amount: "$20,000", coin: "Ethereum" },
  { name: "Sadie S.", action: "withdrew", amount: "$6,400", coin: "USDT" },
  { name: "Brayden K.", action: "invested in", amount: "Starter Plan", coin: "" },
  { name: "Madelyn P.", action: "deposited", amount: "$5,300", coin: "Bitcoin" },
  { name: "Lincoln H.", action: "withdrew", amount: "$10,700", coin: "Ethereum" },
  { name: "Eva G.", action: "deposited", amount: "$40,000", coin: "USDT" },
  { name: "Landon C.", action: "invested in", amount: "Elite Plan", coin: "" },
  { name: "Piper N.", action: "deposited", amount: "$8,200", coin: "Bitcoin" },
  { name: "Roman M.", action: "withdrew", amount: "$2,700", coin: "USDT" },
  { name: "Lydia W.", action: "invested in", amount: "Growth Plan", coin: "" },
  { name: "Camden R.", action: "deposited", amount: "$13,800", coin: "Ethereum" },
  { name: "Peyton F.", action: "withdrew", amount: "$4,800", coin: "Bitcoin" },
  { name: "Axel B.", action: "invested in", amount: "Elite Plan", coin: "" },
  { name: "Clara T.", action: "deposited", amount: "$6,600", coin: "USDT" },
  { name: "Ryker S.", action: "withdrew", amount: "$9,600", coin: "Ethereum" },
  { name: "Autumn K.", action: "invested in", amount: "Starter Plan", coin: "" },
  { name: "Everett P.", action: "deposited", amount: "$3,000", coin: "Bitcoin" },
  { name: "Hailey H.", action: "withdrew", amount: "$5,900", coin: "USDT" },
  { name: "Jaxon G.", action: "invested in", amount: "Growth Plan", coin: "" },
];

const TIMES = [
  "just now", "1 min ago", "2 mins ago", "3 mins ago", "4 mins ago",
  "5 mins ago", "6 mins ago", "7 mins ago", "8 mins ago", "9 mins ago",
  "10 mins ago", "12 mins ago", "14 mins ago", "16 mins ago", "18 mins ago",
  "20 mins ago", "23 mins ago", "25 mins ago", "28 mins ago", "30 mins ago",
];

const TYPE_EMOJI = {
  deposited: "💰",
  withdrew: "💸",
  "invested in": "📈",
};

const TYPE_COLOR = {
  deposited: "bg-emerald-500/20 text-emerald-400",
  withdrew: "bg-red-500/20 text-red-400",
  "invested in": "bg-gold-500/20 text-gold-400",
};

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function randomTime() {
  return TIMES[Math.floor(Math.random() * TIMES.length)];
}

export default function SocialProof() {
  const [visible, setVisible] = useState(null);
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    setQueue(shuffle(EVENTS));
  }, []);

  useEffect(() => {
    if (queue.length === 0) return;

    let currentIndex = 0;
    let hideTimer;
    let nextTimer;

    const showNext = () => {
      const event = queue[currentIndex % queue.length];
      setVisible({ ...event, time: randomTime() });
      currentIndex++;

      hideTimer = setTimeout(() => setVisible(null), 4500);
      nextTimer = setTimeout(showNext, 7500);
    };

    const startTimer = setTimeout(showNext, 3000);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(hideTimer);
      clearTimeout(nextTimer);
    };
  }, [queue]);

  return (
    <div className="fixed top-24 right-6 z-50 w-72">
      <AnimatePresence>
        {visible && (
          <motion.div
            key={visible.name + visible.time}
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-navy-800/95 px-4 py-3 shadow-gold-sm backdrop-blur-xl"
          >
            <div className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-base ${TYPE_COLOR[visible.action] || "bg-navy-700 text-ink-muted"}`}>
              {TYPE_EMOJI[visible.action]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium leading-snug text-ink">
                <span className="text-gold-400">{visible.name}</span>{" "}
                {visible.action}{" "}
                <span className="font-semibold text-ink">
                  {visible.amount}
                  {visible.coin ? ` (${visible.coin})` : ""}
                </span>
              </p>
              <p className="mt-0.5 text-[10px] text-ink-faint">{visible.time}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}