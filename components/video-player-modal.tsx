"use client";

import Image from "next/image";
import {
  Captions,
  FastForward,
  ListVideo,
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  Settings,
  SkipForward,
  Volume2,
  VolumeX,
  X
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import videojs from "video.js";
import type Player from "video.js/dist/types/player";
import { hlsDemoUrls, type SeasonItem, type TitleItem } from "@/lib/content";

type VideoPlayerModalProps = {
  item: TitleItem | null;
  onClose: () => void;
};

type SubtitleTrack = "off" | "en" | "es";
type QualityLevel = "Auto" | "480p" | "720p" | "1080p";

const subtitleOptions: Array<{ label: string; value: SubtitleTrack }> = [
  { label: "Off", value: "off" },
  { label: "English", value: "en" },
  { label: "Spanish", value: "es" }
];

const qualityOptions: Array<{ label: QualityLevel; url: string }> = [
  { label: "Auto", url: hlsDemoUrls[0] },
  { label: "480p", url: hlsDemoUrls[1] },
  { label: "720p", url: hlsDemoUrls[2] },
  { label: "1080p", url: hlsDemoUrls[3] }
];

const getEpisodeCount = (duration: string) => {
  const match = duration.match(/(\d+)\s+Episodes/i);
  return match ? Number(match[1]) : 0;
};

const buildSeasons = (item: TitleItem): SeasonItem[] => {
  if (item.contentType === "series" && item.seasons?.length) {
    return item.seasons;
  }

  const count = item.contentType === "series" ? getEpisodeCount(item.duration) : 0;

  if (!count) {
    return [];
  }

  return [
    {
      number: 1,
      title: "Season 1",
      episodes: Array.from({ length: Math.min(count, 6) }, (_, index) => ({
        id: `${item.id}-episode-${index + 1}`,
        number: index + 1,
        title:
          index === 0
            ? "Now Playing"
            : ["Signal Lost", "The Quiet Room", "False Dawn", "Blackout", "End Credits"][index - 1] ??
              `Episode ${index + 1}`,
        duration: index % 2 === 0 ? "48m" : "52m",
        videoUrl: hlsDemoUrls[index % hlsDemoUrls.length],
        description:
          index === 0
            ? item.description
            : "The story continues with a new lead, a sharper threat, and one choice that changes the season."
      }))
    }
  ];
};

const formatTime = (seconds: number) => {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return "0:00";
  }

  const totalSeconds = Math.floor(seconds);
  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export function VideoPlayerModal({ item, onClose }: VideoPlayerModalProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerRef = useRef<Player | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStartedPlayback, setHasStartedPlayback] = useState(false);
  const [hasPlaybackProgress, setHasPlaybackProgress] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [isEpisodesOpen, setIsEpisodesOpen] = useState(false);
  const [isChromeVisible, setIsChromeVisible] = useState(true);
  const [activeSubtitle, setActiveSubtitle] = useState<SubtitleTrack>("off");
  const [activeQuality, setActiveQuality] = useState<QualityLevel>("Auto");
  const [isSubtitleMenuOpen, setIsSubtitleMenuOpen] = useState(false);
  const [isQualityMenuOpen, setIsQualityMenuOpen] = useState(false);
  const [isVolumePanelOpen, setIsVolumePanelOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const seasons = useMemo(() => (item ? buildSeasons(item) : []), [item]);
  const activeSeason = seasons.find((season) => season.number === selectedSeason) ?? seasons[0];
  const episodes = activeSeason?.episodes ?? [];
  const hasEpisodes = episodes.length > 0;

  useEffect(() => {
    if (!item || !videoRef.current) return;

    const player = videojs(videoRef.current, {
      autoplay: true,
      controls: false,
      fill: true,
      muted: false,
      playbackRates: [0.75, 1, 1.25, 1.5, 2],
      poster: item.previewImage,
      preload: "auto",
      responsive: true,
      sources: [
        {
          src: item.videoUrl,
          type: "application/x-mpegURL"
        }
      ]
    });

    playerRef.current = player;

    const syncTime = () => {
      const nextTime = Number(player.currentTime() || 0);
      setCurrentTime(nextTime);
      if (nextTime > 0.25) {
        setHasPlaybackProgress(true);
      }
    };
    const syncDuration = () => setDuration(Number(player.duration() || 0));
    const syncPlaying = () => setIsPlaying(!player.paused());
    const markPlaying = () => {
      setIsPlaying(true);
      setIsBuffering(false);
      setHasStartedPlayback(true);
    };
    const markBuffering = () => setIsBuffering(true);
    const markReady = () => setIsBuffering(false);
    const syncVolume = () => {
      setIsMuted(Boolean(player.muted()));
      setVolume(Number(player.volume() || 0));
    };

    player.addRemoteTextTrack(
      {
        default: false,
        kind: "subtitles",
        label: "English",
        src: "/subtitles/en.vtt",
        srclang: "en"
      },
      false
    );
    player.addRemoteTextTrack(
      {
        default: false,
        kind: "subtitles",
        label: "Spanish",
        src: "/subtitles/es.vtt",
        srclang: "es"
      },
      false
    );

    player.on("timeupdate", syncTime);
    player.on("loadedmetadata", syncDuration);
    player.on("durationchange", syncDuration);
    player.on("play", syncPlaying);
    player.on("playing", markPlaying);
    player.on("waiting", markBuffering);
    player.on("stalled", markBuffering);
    player.on("canplay", markReady);
    player.on("pause", syncPlaying);
    player.on("volumechange", syncVolume);

    syncVolume();

    return () => {
      player.off("timeupdate", syncTime);
      player.off("loadedmetadata", syncDuration);
      player.off("durationchange", syncDuration);
      player.off("play", syncPlaying);
      player.off("playing", markPlaying);
      player.off("waiting", markBuffering);
      player.off("stalled", markBuffering);
      player.off("canplay", markReady);
      player.off("pause", syncPlaying);
      player.off("volumechange", syncVolume);
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
      }
      playerRef.current = null;
    };
  }, [item]);

  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
    setIsPlaying(false);
    setHasStartedPlayback(false);
    setHasPlaybackProgress(false);
    setIsBuffering(true);
    setIsMuted(false);
    setVolume(1);
    setSelectedSeason(1);
    setSelectedEpisode(1);
    setIsEpisodesOpen(false);
    setIsChromeVisible(true);
    setActiveSubtitle("off");
    setActiveQuality("Auto");
    setIsSubtitleMenuOpen(false);
    setIsQualityMenuOpen(false);
    setIsVolumePanelOpen(false);
  }, [item]);

  useEffect(() => {
    if (!item) return;

    const canAutoHide = isPlaying && hasStartedPlayback && hasPlaybackProgress && !isBuffering;

    if (!canAutoHide || isEpisodesOpen || isQualityMenuOpen || isSubtitleMenuOpen || isVolumePanelOpen) {
      setIsChromeVisible(true);
      return;
    }

    const hideTimer = window.setTimeout(() => {
      setIsChromeVisible(false);
    }, 3000);

    return () => window.clearTimeout(hideTimer);
  }, [
    isChromeVisible,
    isEpisodesOpen,
    hasStartedPlayback,
    hasPlaybackProgress,
    isBuffering,
    isPlaying,
    isQualityMenuOpen,
    isSubtitleMenuOpen,
    isVolumePanelOpen,
    item,
    selectedEpisode
  ]);

  useEffect(() => {
    if (!item) return;

    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target;
      const isTyping =
        target instanceof HTMLInputElement ||
        target instanceof HTMLSelectElement ||
        target instanceof HTMLTextAreaElement ||
        (target instanceof HTMLElement && target.isContentEditable);

      if (isTyping) {
        return;
      }

      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.code === "Space") {
        event.preventDefault();
        const player = playerRef.current;
        if (!player || player.isDisposed()) return;

        if (player.paused()) {
          void player.play();
        } else {
          player.pause();
        }
        return;
      }

      if (event.key.toLowerCase() === "m") {
        event.preventDefault();
        const player = playerRef.current;
        if (!player || player.isDisposed()) return;

        const nextMuted = !player.muted();
        player.muted(nextMuted);
        setIsMuted(nextMuted);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [item, onClose]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  if (!item) return null;

  const restart = () => {
    const player = playerRef.current;
    if (!player || player.isDisposed()) return;
    player.currentTime(0);
    void player.play();
  };

  const skipIntro = () => {
    const player = playerRef.current;
    if (!player || player.isDisposed()) return;
    player.currentTime(Math.min((player.currentTime() ?? 0) + 85, player.duration() || 85));
    void player.play();
  };

  const toggleMute = () => {
    const player = playerRef.current;
    if (!player || player.isDisposed()) return;
    const nextMuted = !player.muted();
    player.muted(nextMuted);
    setIsMuted(nextMuted);
  };

  const setPlayerVolume = (nextVolume: number) => {
    const player = playerRef.current;
    if (!player || player.isDisposed()) return;

    player.volume(nextVolume);
    player.muted(nextVolume === 0);
    setVolume(nextVolume);
    setIsMuted(nextVolume === 0);
  };

  const setSubtitleTrack = (track: SubtitleTrack) => {
    const player = playerRef.current;
    if (!player || player.isDisposed()) return;

    const tracks = player.textTracks();
    for (let index = 0; index < tracks.length; index += 1) {
      const textTrack = (tracks as unknown as ArrayLike<TextTrack>)[index];
      if (!textTrack) continue;
      textTrack.mode = track !== "off" && textTrack.language === track ? "showing" : "disabled";
    }

    setActiveSubtitle(track);
    setIsSubtitleMenuOpen(false);
  };

  const switchQuality = (quality: QualityLevel, url: string) => {
    const player = playerRef.current;
    if (!player || player.isDisposed()) return;

    const resumeAt = Number(player.currentTime() || 0);
    const wasPaused = player.paused();
    const muted = player.muted();

    setActiveQuality(quality);
    setIsQualityMenuOpen(false);
    setIsChromeVisible(true);
    setIsBuffering(true);
    player.src({
      src: url,
      type: "application/x-mpegURL"
    });
    player.muted(muted);
    player.one("loadedmetadata", () => {
      player.currentTime(resumeAt);
      if (!wasPaused) {
        void player.play();
      }
    });
  };

  const toggleFullscreen = async () => {
    const element = containerRef.current;
    if (!element) return;

    if (document.fullscreenElement) {
      await document.exitFullscreen();
    } else {
      await element.requestFullscreen();
    }
  };

  const togglePlay = () => {
    const player = playerRef.current;
    if (!player || player.isDisposed()) return;

    if (player.paused()) {
      void player.play();
    } else {
      player.pause();
    }
  };

  const seekTo = (value: number) => {
    const player = playerRef.current;
    if (!player || player.isDisposed()) return;
    player.currentTime(value);
    setCurrentTime(value);
  };

  const jumpBy = (seconds: number) => {
    const player = playerRef.current;
    if (!player || player.isDisposed()) return;
    const nextTime = Math.max(0, Math.min(Number(player.currentTime() || 0) + seconds, duration || seconds));
    player.currentTime(nextTime);
    setCurrentTime(nextTime);
  };

  const playEpisode = (episodeNumber: number) => {
    const player = playerRef.current;
    const episode = episodes.find((entry) => entry.number === episodeNumber);
    if (!player || player.isDisposed() || !episode) return;

    setSelectedEpisode(episodeNumber);
    setIsEpisodesOpen(false);
    setIsChromeVisible(true);
    setHasStartedPlayback(false);
    setHasPlaybackProgress(false);
    setIsBuffering(true);
    player.poster(item.previewImage);
    player.src({
      src: episode.videoUrl,
      type: "application/x-mpegURL"
    });
    player.currentTime(0);
    void player.play();
  };

  const revealChrome = () => {
    setIsChromeVisible(true);
  };

  const chromeVisibilityClass = isChromeVisible
    ? "translate-y-0 opacity-100"
    : "pointer-events-none translate-y-3 opacity-0";

  return (
    <div
      aria-label={`${item.title} video player`}
      aria-modal="true"
      className="fixed inset-0 z-[100] bg-black text-white"
      onMouseDown={onClose}
      role="dialog"
    >
      <div
        ref={containerRef}
        className="relative h-screen w-screen overflow-hidden bg-black"
        onMouseDown={(event) => event.stopPropagation()}
        onMouseMove={revealChrome}
        onTouchStart={revealChrome}
      >
        <button
          aria-label="Close player"
          className={`absolute right-3 top-3 z-30 grid h-10 w-10 place-items-center rounded-full bg-black/70 text-white ring-1 ring-white/15 transition-all duration-500 hover:bg-white hover:text-black sm:right-8 sm:top-6 sm:h-11 sm:w-11 ${chromeVisibilityClass}`}
          onClick={onClose}
        >
          <X size={24} />
        </button>
        <div
          className="absolute inset-0 cursor-pointer"
          onClick={togglePlay}
          role="presentation"
        >
          <video
            className="video-js vjs-big-play-centered vjs-fill stream-player"
            playsInline
            ref={videoRef}
          />
        </div>

        <div
          className={`pointer-events-none absolute inset-x-0 top-0 z-20 h-40 bg-gradient-to-b from-black/90 via-black/40 to-transparent transition-opacity duration-500 ${
            isChromeVisible ? "opacity-100" : "opacity-0"
          }`}
        />
        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[58vh] bg-gradient-to-t from-black via-black/70 to-transparent transition-opacity duration-500 ${
            isChromeVisible ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          className={`pointer-events-none absolute left-4 top-5 z-30 flex items-center gap-3 transition-all duration-500 sm:left-8 sm:top-7 ${chromeVisibilityClass}`}
        >
          <span className="text-lg font-black uppercase text-red-600 sm:text-2xl">StreamFlix</span>
          <span className="hidden text-sm font-semibold text-zinc-400 sm:inline">Now Playing</span>
        </div>

        <div
          className={`pointer-events-none absolute bottom-40 left-4 right-4 z-30 max-w-4xl transition-all duration-500 ease-out sm:bottom-32 sm:left-8 lg:left-12 ${
            isChromeVisible
              ? "translate-y-0 opacity-100"
              : "pointer-events-none translate-y-4 opacity-0"
          }`}
        >
          <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold text-zinc-200 sm:mb-3 sm:gap-3 sm:text-sm">
            <span className="text-emerald-400">{item.match}</span>
            <span>{item.year}</span>
            <span className="border border-zinc-500 px-1.5 py-0.5 text-xs">{item.rating}</span>
            <span>{item.duration}</span>
          </div>
          <h2 className="text-2xl font-black leading-none text-white xs:text-3xl sm:text-5xl lg:text-6xl">
            {item.title}
          </h2>
          {hasEpisodes ? (
            <p className="mt-2 text-xs font-semibold text-zinc-300 sm:text-sm">
              Season {selectedSeason} Episode {selectedEpisode}
            </p>
          ) : null}
          <p className="mt-3 line-clamp-2 max-w-2xl text-xs leading-5 text-zinc-200 sm:mt-4 sm:text-base sm:leading-6">
            {item.description}
          </p>
          <div className="mt-3 flex flex-wrap gap-x-2 gap-y-1 text-xs text-zinc-300 sm:mt-4 sm:text-sm">
            {item.genres.map((genre, index) => (
              <span key={genre}>
                {genre}
                {index < item.genres.length - 1 ? <span className="ml-2 text-zinc-600">•</span> : null}
              </span>
            ))}
          </div>
        </div>

        <div
          className={`absolute bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-black via-black/95 to-transparent px-3 pb-4 pt-10 transition-all duration-500 sm:px-8 sm:pb-5 sm:pt-12 lg:px-12 ${chromeVisibilityClass}`}
        >
          <div className="mb-3 flex items-center gap-2 sm:gap-3">
            <span className="w-10 text-right text-[11px] font-semibold text-zinc-300 sm:w-12 sm:text-xs">
              {formatTime(currentTime)}
            </span>
            <input
              aria-label="Seek video"
              className="stream-seekbar h-2 flex-1 cursor-pointer"
              max={duration || 0}
              min={0}
              onChange={(event) => seekTo(Number(event.target.value))}
              step={0.1}
              style={{
                background: `linear-gradient(to right, #e50914 ${
                  duration ? (currentTime / duration) * 100 : 0
                }%, rgba(255,255,255,.26) 0)`
              }}
              type="range"
              value={Math.min(currentTime, duration || currentTime)}
            />
            <span className="w-10 text-[11px] font-semibold text-zinc-300 sm:w-12 sm:text-xs">
              {formatTime(duration)}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 md:grid md:grid-cols-[1fr_auto_1fr] md:gap-4">
            <div className="hidden md:block" />
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
              <button
                aria-label={isPlaying ? "Pause" : "Play"}
                className="grid h-10 w-10 place-items-center rounded-full bg-white text-black transition hover:bg-zinc-200 sm:h-11 sm:w-11"
                onClick={togglePlay}
              >
                {isPlaying ? <Pause size={21} fill="currentColor" /> : <Play size={21} fill="currentColor" />}
              </button>
              <button
                aria-label="Rewind 10 seconds"
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/15 transition hover:bg-white/20 sm:h-10 sm:w-10"
                onClick={() => jumpBy(-10)}
              >
                <RotateCcw size={18} />
              </button>
              <button
                aria-label="Forward 10 seconds"
                className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/15 transition hover:bg-white/20 sm:h-10 sm:w-10"
                onClick={() => jumpBy(10)}
              >
                <FastForward size={18} />
              </button>
              <div className="relative">
                <button
                  aria-expanded={isVolumePanelOpen}
                  aria-label="Volume controls"
                  className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/15 transition hover:bg-white/20 sm:h-10 sm:w-10"
                  onClick={() => {
                    setIsVolumePanelOpen((isOpen) => !isOpen);
                    setIsSubtitleMenuOpen(false);
                    setIsQualityMenuOpen(false);
                    setIsEpisodesOpen(false);
                  }}
                >
                  {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                {isVolumePanelOpen ? (
                  <div className="absolute bottom-11 left-1/2 w-40 -translate-x-1/2 rounded-md border border-white/10 bg-[#181818]/95 p-3 shadow-2xl backdrop-blur sm:bottom-12 sm:w-44 sm:p-4">
                    <div className="mb-2 flex items-center justify-between text-xs font-bold text-zinc-300">
                      <span>Volume</span>
                      <span>{isMuted ? 0 : Math.round(volume * 100)}%</span>
                    </div>
                    <button
                      className="mb-3 inline-flex items-center gap-2 rounded bg-white/10 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-white/20"
                      onClick={toggleMute}
                    >
                      {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                      {isMuted ? "Unmute" : "Mute"}
                    </button>
                    <input
                      aria-label="Volume"
                      className="stream-seekbar h-2 w-full cursor-pointer"
                      max={1}
                      min={0}
                      onChange={(event) => setPlayerVolume(Number(event.target.value))}
                      step={0.01}
                      style={{
                        background: `linear-gradient(to right, #e50914 ${
                          isMuted ? 0 : volume * 100
                        }%, rgba(255,255,255,.26) 0)`
                      }}
                      type="range"
                      value={isMuted ? 0 : volume}
                    />
                  </div>
                ) : null}
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <button
                    aria-expanded={isSubtitleMenuOpen}
                    aria-label="Subtitle options"
                    className="inline-flex h-9 items-center gap-2 rounded bg-white/10 px-2 text-sm font-bold text-white ring-1 ring-white/15 transition hover:bg-white/20 sm:h-10 sm:px-3"
                    onClick={() => {
                      setIsSubtitleMenuOpen((isOpen) => !isOpen);
                      setIsQualityMenuOpen(false);
                      setIsEpisodesOpen(false);
                      setIsVolumePanelOpen(false);
                    }}
                  >
                    <Captions size={18} />
                    <span className="hidden sm:inline">
                      {activeSubtitle === "off" ? "Subtitles" : activeSubtitle.toUpperCase()}
                    </span>
                  </button>
                  {isSubtitleMenuOpen ? (
                    <div className="absolute bottom-11 right-0 w-40 overflow-hidden rounded-md border border-white/10 bg-[#181818]/95 p-1 shadow-2xl backdrop-blur sm:bottom-12 sm:w-44">
                      {subtitleOptions.map((option) => (
                        <button
                          className={`block w-full rounded px-3 py-2 text-left text-sm font-semibold transition hover:bg-white/10 ${
                            activeSubtitle === option.value ? "bg-red-600 text-white" : "text-zinc-200"
                          }`}
                          key={option.value}
                          onClick={() => setSubtitleTrack(option.value)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
                <div className="relative">
                  <button
                    aria-expanded={isQualityMenuOpen}
                    aria-label="Quality options"
                    className="inline-flex h-9 items-center gap-2 rounded bg-white/10 px-2 text-sm font-bold text-white ring-1 ring-white/15 transition hover:bg-white/20 sm:h-10 sm:px-3"
                    onClick={() => {
                      setIsQualityMenuOpen((isOpen) => !isOpen);
                      setIsSubtitleMenuOpen(false);
                      setIsEpisodesOpen(false);
                      setIsVolumePanelOpen(false);
                    }}
                  >
                    <Settings size={18} />
                    <span className="hidden sm:inline">{activeQuality}</span>
                  </button>
                  {isQualityMenuOpen ? (
                    <div className="absolute bottom-11 right-0 w-32 overflow-hidden rounded-md border border-white/10 bg-[#181818]/95 p-1 shadow-2xl backdrop-blur sm:bottom-12 sm:w-36">
                      {qualityOptions.map((option) => (
                        <button
                          className={`block w-full rounded px-3 py-2 text-left text-sm font-semibold transition hover:bg-white/10 ${
                            activeQuality === option.label ? "bg-red-600 text-white" : "text-zinc-200"
                          }`}
                          key={option.label}
                          onClick={() => switchQuality(option.label, option.url)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
                <button
                  aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                  className="grid h-9 w-9 place-items-center rounded-full bg-white/10 text-white ring-1 ring-white/15 transition hover:bg-white/20 sm:h-10 sm:w-10"
                  onClick={toggleFullscreen}
                >
                  {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
                </button>
              </div>
            </div>
            <div className="flex basis-full justify-center md:basis-auto md:justify-end">
              {hasEpisodes ? (
                <button
                  aria-expanded={isEpisodesOpen}
                  aria-label="Show episodes"
                  className="inline-flex h-9 items-center gap-2 rounded bg-white/10 px-3 text-sm font-bold text-white ring-1 ring-white/15 transition hover:bg-white/20 sm:h-10 sm:px-4"
                  onClick={() => {
                    setIsEpisodesOpen((isOpen) => !isOpen);
                    setIsSubtitleMenuOpen(false);
                    setIsQualityMenuOpen(false);
                    setIsVolumePanelOpen(false);
                  }}
                >
                  <ListVideo size={18} />
                  Episodes
                </button>
              ) : null}
            </div>
          </div>
        </div>

        {hasEpisodes && isEpisodesOpen ? (
          <aside className="absolute bottom-32 left-3 right-3 z-50 max-h-[48vh] overflow-y-auto rounded-lg border border-white/10 bg-[#111]/95 p-3 shadow-2xl backdrop-blur sm:bottom-28 sm:left-auto sm:right-8 sm:max-h-[52vh] sm:w-[460px] sm:p-5 lg:right-12">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-red-500">
                  <ListVideo size={16} />
                  {item.title}
                </div>
                <h3 className="mt-1 text-lg font-bold text-white">
                  Season {selectedSeason} Episodes
                </h3>
              </div>
              <button
                className="rounded bg-white/10 px-3 py-2 text-xs font-bold text-white transition hover:bg-white/20"
                onClick={() => setIsEpisodesOpen(false)}
              >
                Close
              </button>
            </div>
            {seasons.length > 1 && seasons.length <= 3 ? (
              <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
                {seasons.map((season) => (
                  <button
                    className={`shrink-0 rounded px-3 py-2 text-sm font-bold transition ${
                      selectedSeason === season.number
                        ? "bg-red-600 text-white"
                        : "bg-white/10 text-zinc-200 hover:bg-white/20"
                    }`}
                    key={season.number}
                    onClick={() => {
                      setSelectedSeason(season.number);
                      setSelectedEpisode(1);
                    }}
                  >
                    {season.title}
                  </button>
                ))}
              </div>
            ) : null}
            {seasons.length > 3 ? (
              <div className="mb-4">
                <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-zinc-400">
                  Season
                </label>
                <select
                  className="w-full rounded border border-white/10 bg-white/10 px-3 py-2 text-sm font-bold text-white outline-none transition focus:border-red-600"
                  onChange={(event) => {
                    setSelectedSeason(Number(event.target.value));
                    setSelectedEpisode(1);
                  }}
                  value={selectedSeason}
                >
                  {seasons.map((season) => (
                    <option className="bg-[#181818] text-white" key={season.number} value={season.number}>
                      {season.title}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
            <div className="space-y-3">
              {episodes.map((episode) => (
                <button
                  className={`group flex w-full gap-3 rounded p-2 text-left transition hover:bg-white/10 ${
                    selectedEpisode === episode.number ? "bg-white/10 ring-1 ring-red-600/60" : ""
                  }`}
                  key={episode.id}
                  onClick={() => playEpisode(episode.number)}
                >
                  <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded bg-zinc-900">
                    <Image
                      alt=""
                      className="object-cover opacity-80 transition group-hover:opacity-100"
                      fill
                      sizes="128px"
                      src={item.previewImage}
                    />
                    <div className="absolute inset-0 grid place-items-center bg-black/20">
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-black/70 text-sm font-black ring-1 ring-white/30">
                        {episode.number}
                      </span>
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="line-clamp-1 text-sm font-bold text-white">{episode.title}</p>
                      <span className="shrink-0 text-xs font-semibold text-zinc-400">
                        {episode.duration}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-400">
                      {episode.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </aside>
        ) : null}
      </div>
    </div>
  );
}
