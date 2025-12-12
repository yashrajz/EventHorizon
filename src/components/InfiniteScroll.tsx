import { motion } from "framer-motion";

interface InfiniteScrollProps {
  items: string[];
  direction?: "left" | "right";
  speed?: number;
}

export const InfiniteScroll = ({ 
  items, 
  direction = "left",
  speed = 50 
}: InfiniteScrollProps) => {
  const duplicatedItems = [...items, ...items];

  return (
    <div className="relative overflow-hidden">
      <motion.div
        className="flex gap-8 py-4"
        animate={{
          x: direction === "left" ? [0, -1920] : [-1920, 0],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: speed,
            ease: "linear",
          },
        }}
      >
        {duplicatedItems.map((item, index) => (
          <div
            key={index}
            className="flex-shrink-0 rounded-full border border-glass-border bg-glass/30 px-6 py-2 text-sm font-medium text-foreground backdrop-blur-sm hover:bg-glass/50 transition-colors"
          >
            {item}
          </div>
        ))}
      </motion.div>
    </div>
  );
};
