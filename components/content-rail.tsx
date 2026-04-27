"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import type { ContentRow, TitleItem } from "@/lib/content";
import { TitleCard } from "@/components/title-card";

type ContentRailProps = {
  row: ContentRow;
  onPlay: (item: TitleItem) => void;
};

export function ContentRail({ onPlay, row }: ContentRailProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByPage = (direction: 1 | -1) => {
    const node = scrollerRef.current;
    if (!node) return;
    node.scrollBy({ left: direction * node.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <section className="group/rail relative z-20 px-4 sm:px-8 lg:px-12">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-bold text-white sm:text-2xl">{row.title}</h2>
        <div className="hidden gap-2 opacity-0 transition group-hover/rail:opacity-100 md:flex">
          <button
            aria-label={`Scroll ${row.title} left`}
            className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
            onClick={() => scrollByPage(-1)}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            aria-label={`Scroll ${row.title} right`}
            className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
            onClick={() => scrollByPage(1)}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
      <div
        className="hide-scrollbar -mb-24 -mt-20 flex snap-x gap-3 overflow-x-auto scroll-smooth pb-28 pt-28"
        ref={scrollerRef}
      >
        {row.items.map((item, index) => (
          <TitleCard
            item={item}
            key={`${row.title}-${item.id}`}
            onPlay={onPlay}
            position={index < 2 ? "left" : index > row.items.length - 3 ? "right" : "center"}
          />
        ))}
      </div>
    </section>
  );
}
