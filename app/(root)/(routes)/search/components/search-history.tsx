"use client";

import { Variants, motion } from "framer-motion";

import { useServerStore } from "@/hooks/use-server-data";
import { SearchHistory } from "@/services/history";
import { useRouter } from "next/navigation";

const fade: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { when: "beforeChildren" },
  },
};

const stagger: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: "beforeChildren",
    },
  },
};

const slide: Variants = {
  hidden: { x: 60, opacity: 0 },
  visible: { x: 0, opacity: 1 },
};

export default function SearchHistory() {
  const history = useServerStore((state) => state.searchHistory);
  const router = useRouter();

  if (!history || !history.length) {
    return (
      <motion.div
        variants={fade}
        initial="hidden"
        animate="visible"
        className="mt-2"
      >
        <p className="text-lg text-center">Search...</p>
      </motion.div>
    );
  }

  return (
    <motion.div variants={fade} initial="hidden" animate="visible">
      <p className="text-center text-lg font-medium">Recent Search History</p>
      <motion.section
        className="flex flex-col md:flex-row gap-2 mt-2"
        variants={stagger}
      >
        {history.map((h) => (
          <motion.button
            type="button"
            key={h.id}
            className="bg-card-result rounded-md p-2 text-secondary"
            variants={slide}
            onClick={() => router.push(`./search/?q=${h.query}`)}
          >
            <p className="text-base items-center">{h.query}</p>
            <p className="text-sm items-center">See results</p>
          </motion.button>
        ))}
      </motion.section>
    </motion.div>
  );
}
