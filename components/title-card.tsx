import Image from "next/image";
import { Check, ChevronDown, Play, Plus, ThumbsUp } from "lucide-react";
import type { TitleItem } from "@/lib/content";

type TitleCardProps = {
  item: TitleItem;
  position: "left" | "center" | "right";
  onPlay: (item: TitleItem) => void;
};

const popoverPosition = {
  left: "left-0",
  center: "left-1/2 -translate-x-1/2",
  right: "right-0"
};

export function TitleCard({ item, onPlay, position }: TitleCardProps) {
  return (
    <article className="group/card relative z-0 h-28 min-w-[190px] snap-start transition-[z-index] delay-500 hover:z-50 focus-within:z-50 sm:h-32 sm:min-w-[230px] lg:h-36 lg:min-w-[260px]">
      <button className="relative h-full w-full overflow-hidden rounded bg-zinc-900 text-left shadow-lg outline-none ring-white/60 transition duration-500 ease-out group-hover/card:scale-105 focus-visible:ring-2">
        <Image
          alt={item.title}
          className="object-cover transition duration-300 group-hover/card:brightness-75"
          fill
          sizes="(max-width: 640px) 190px, (max-width: 1024px) 230px, 260px"
          src={item.image}
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-3">
          <h3 className="line-clamp-1 text-sm font-bold sm:text-base">{item.title}</h3>
        </div>
      </button>

      <div
        className={`pointer-events-none invisible absolute top-1/2 z-50 w-[310px] -translate-y-1/2 scale-90 overflow-hidden rounded-md bg-[#181818] opacity-0 shadow-popover ring-1 ring-white/10 transition-all delay-500 duration-500 ease-out group-hover/card:pointer-events-auto group-hover/card:visible group-hover/card:scale-100 group-hover/card:opacity-100 group-focus-within/card:pointer-events-auto group-focus-within/card:visible group-focus-within/card:scale-100 group-focus-within/card:opacity-100 sm:w-[360px] ${popoverPosition[position]}`}
      >
        <div className="relative h-44 w-full">
          <Image
            alt=""
            className="object-cover"
            fill
            sizes="360px"
            src={item.previewImage}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent" />
        </div>
        <div className="space-y-3 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                aria-label={`Play ${item.title}`}
                className="grid h-9 w-9 place-items-center rounded-full bg-white text-black"
                onClick={() => onPlay(item)}
              >
                <Play size={18} fill="currentColor" />
              </button>
              <button aria-label={`Add ${item.title}`} className="grid h-9 w-9 place-items-center rounded-full border border-zinc-400 text-white transition hover:border-white">
                <Plus size={18} />
              </button>
              <button aria-label={`Like ${item.title}`} className="grid h-9 w-9 place-items-center rounded-full border border-zinc-400 text-white transition hover:border-white">
                <ThumbsUp size={17} />
              </button>
              <button aria-label={`${item.title} added`} className="grid h-9 w-9 place-items-center rounded-full border border-zinc-400 text-white transition hover:border-white">
                <Check size={17} />
              </button>
            </div>
            <button aria-label={`More about ${item.title}`} className="grid h-9 w-9 place-items-center rounded-full border border-zinc-400 text-white transition hover:border-white">
              <ChevronDown size={19} />
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm font-semibold">
            <span className="text-emerald-400">{item.match}</span>
            <span className="border border-zinc-500 px-1.5 py-0.5 text-xs">{item.rating}</span>
            <span>{item.duration}</span>
            <span className="text-zinc-400">{item.year}</span>
          </div>
          <p className="line-clamp-2 text-sm leading-5 text-zinc-200">{item.description}</p>
          <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-zinc-300">
            {item.genres.map((genre, index) => (
              <span key={genre}>
                {genre}
                {index < item.genres.length - 1 ? <span className="ml-2 text-zinc-600">•</span> : null}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
