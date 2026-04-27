"use client";

import { useState } from "react";
import { ContentRail } from "@/components/content-rail";
import { HeroCarousel } from "@/components/hero-carousel";
import { Navbar } from "@/components/navbar";
import { VideoPlayerModal } from "@/components/video-player-modal";
import type { ContentRow, HeroSlide, TitleItem } from "@/lib/content";

type HomeExperienceProps = {
  heroSlides: HeroSlide[];
  contentRows: ContentRow[];
};

export function HomeExperience({ heroSlides, contentRows }: HomeExperienceProps) {
  const [selectedTitle, setSelectedTitle] = useState<TitleItem | null>(null);

  return (
    <main className="min-h-screen overflow-hidden bg-[#050505] text-white">
      <Navbar />
      <HeroCarousel onPlay={setSelectedTitle} slides={heroSlides} />
      <section className="-mt-20 space-y-0 pb-16 sm:-mt-24 lg:-mt-28">
        {contentRows.map((row) => (
          <ContentRail key={row.title} onPlay={setSelectedTitle} row={row} />
        ))}
      </section>
      <VideoPlayerModal item={selectedTitle} onClose={() => setSelectedTitle(null)} />
    </main>
  );
}
