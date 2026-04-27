"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, Info, Play } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import type { HeroSlide, TitleItem } from "@/lib/content";

type HeroCarouselProps = {
  slides: HeroSlide[];
  onPlay: (item: TitleItem) => void;
};

export function HeroCarousel({ onPlay, slides }: HeroCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex];

  const goTo = useCallback(
    (direction: 1 | -1) => {
      setActiveIndex((current) => (current + direction + slides.length) % slides.length);
    },
    [slides.length]
  );

  useEffect(() => {
    const interval = window.setInterval(() => goTo(1), 6500);
    return () => window.clearInterval(interval);
  }, [goTo]);

  return (
    <section className="relative h-[78vh] min-h-[560px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          aria-hidden={index !== activeIndex}
          className={`absolute inset-0 transition-opacity duration-700 ${
            index === activeIndex ? "opacity-100" : "opacity-0"
          }`}
          key={slide.id}
        >
          <Image
            alt=""
            className="object-cover"
            fill
            priority={index === 0}
            sizes="100vw"
            src={slide.image}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/55 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/45" />

      <div className="relative z-10 flex h-full max-w-3xl flex-col justify-center px-4 pt-16 sm:px-8 lg:px-12">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-red-500">
          {activeSlide.eyebrow}
        </p>
        <h1 className="text-balance text-5xl font-black leading-none text-white sm:text-6xl lg:text-7xl">
          {activeSlide.title}
        </h1>
        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm font-semibold text-zinc-100">
          <span className="text-emerald-400">{activeSlide.match}</span>
          <span>{activeSlide.year}</span>
          <span className="border border-white/45 px-1.5 py-0.5 text-xs">{activeSlide.rating}</span>
          <span>{activeSlide.duration}</span>
          <span>{activeSlide.rank}</span>
        </div>
        <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-100 sm:text-lg">
          {activeSlide.description}
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <button
            className="inline-flex items-center gap-2 rounded bg-white px-6 py-3 font-bold text-black transition hover:bg-zinc-200"
            onClick={() => onPlay(activeSlide)}
          >
            <Play size={21} fill="currentColor" />
            Play
          </button>
          <button className="inline-flex items-center gap-2 rounded bg-zinc-500/70 px-6 py-3 font-bold text-white transition hover:bg-zinc-500">
            <Info size={21} />
            More Info
          </button>
        </div>
      </div>

      <div className="absolute bottom-28 right-4 z-20 flex items-center gap-3 sm:right-8 lg:right-12">
        <button
          aria-label="Previous hero"
          className="grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-black/35 transition hover:bg-black/70"
          onClick={() => goTo(-1)}
        >
          <ChevronLeft size={24} />
        </button>
        <button
          aria-label="Next hero"
          className="grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-black/35 transition hover:bg-black/70"
          onClick={() => goTo(1)}
        >
          <ChevronRight size={24} />
        </button>
      </div>
      <div className="absolute bottom-20 left-4 z-20 flex gap-2 sm:left-8 lg:left-12">
        {slides.map((slide, index) => (
          <button
            aria-label={`Show ${slide.title}`}
            className={`h-1.5 rounded-full transition-all ${
              activeIndex === index ? "w-9 bg-white" : "w-4 bg-white/35"
            }`}
            key={slide.id}
            onClick={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </section>
  );
}
