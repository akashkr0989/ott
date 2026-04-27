export type EpisodeItem = {
  id: string;
  number: number;
  title: string;
  duration: string;
  videoUrl: string;
  description: string;
};

export type SeasonItem = {
  number: number;
  title: string;
  episodes: EpisodeItem[];
};

export type TitleItem = {
  id: string;
  title: string;
  contentType?: "movie" | "series";
  seasons?: SeasonItem[];
  image: string;
  previewImage: string;
  videoUrl: string;
  year: string;
  rating: string;
  duration: string;
  match: string;
  genres: string[];
  description: string;
};

export type HeroSlide = TitleItem & {
  eyebrow: string;
  rank: string;
};

export type ContentRow = {
  title: string;
  items: TitleItem[];
};

const image = (id: string, w = 1200, h = 720) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

export const hlsDemoUrls = [
  "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
  "https://test-streams.mux.dev/pts_shift/master.m3u8",
  "https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8",
  "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
  "https://cph-p2p-msl.akamaized.net/hls/live/2000341/test/master.m3u8"
] as const;

const video = (index: number) => hlsDemoUrls[index % hlsDemoUrls.length];

const makeSeason = (
  showId: string,
  seasonNumber: number,
  episodeTitles: string[],
  startVideoIndex: number
): SeasonItem => ({
  number: seasonNumber,
  title: `Season ${seasonNumber}`,
  episodes: episodeTitles.map((title, index) => ({
    id: `${showId}-s${seasonNumber}-e${index + 1}`,
    number: index + 1,
    title,
    duration: index % 2 === 0 ? "48m" : "52m",
    videoUrl: video(startVideoIndex + index),
    description:
      index === 0
        ? "The season opens with a dangerous discovery and a choice that pulls everyone deeper."
        : "A new lead sharpens the mystery while the pressure closes in from every side."
  }))
});

const makeSeasons = (
  showId: string,
  seasonCount: number,
  episodesPerSeason: number,
  startVideoIndex: number
): SeasonItem[] =>
  Array.from({ length: seasonCount }, (_, seasonIndex) =>
    makeSeason(showId, seasonIndex + 1, Array.from({ length: episodesPerSeason }, (_, episodeIndex) => {
      const episodeNames = [
        ["Pilot Signal", "Ghost Login", "Dark Fiber", "Zero Trace"],
        ["Root Access", "Silent Patch", "Dead Switch", "Dawn Protocol"],
        ["Mirror Node", "Packet Storm", "False Admin", "Clean Exit"],
        ["Backdoor", "Signal Burn", "Cold Wallet", "Red Team"],
        ["Night Deploy", "Proxy War", "Kill Chain", "Blue Screen"],
        ["Handshake", "Access Denied", "Ghost Key", "Kernel Panic"],
        ["Payload", "Sandbox", "Trace Route", "Hard Fork"],
        ["Black Box", "Shadow Copy", "Deep Link", "Failover"],
        ["Dark Mode", "Zero Day", "Dead Drop", "Root Cause"],
        ["Final Build", "System Lock", "Last Login", "Midnight Run"]
      ];

      return episodeNames[seasonIndex]?.[episodeIndex] ?? `Episode ${episodeIndex + 1}`;
    }), startVideoIndex + seasonIndex * episodesPerSeason)
  );

export const heroSlides: HeroSlide[] = [
  {
    id: "hero-1",
    title: "Midnight Protocol",
    contentType: "series",
    seasons: makeSeasons("midnight-protocol", 10, 4, 0),
    eyebrow: "New Original Series",
    rank: "#1 in shows today",
    image: image("photo-1524985069026-dd778a71c7b4", 1800, 1000),
    previewImage: image("photo-1524985069026-dd778a71c7b4", 1200, 720),
    videoUrl: video(0),
    year: "2026",
    rating: "16+",
    duration: "8 Episodes",
    match: "98% Match",
    genres: ["Thriller", "Mystery", "Cyber"],
    description:
      "A rogue analyst discovers a citywide surveillance plot and races through neon streets to expose the truth before dawn."
  },
  {
    id: "hero-2",
    title: "The Last Horizon",
    contentType: "movie",
    eyebrow: "Featured Film",
    rank: "Trending worldwide",
    image: image("photo-1536440136628-849c177e76a1", 1800, 1000),
    previewImage: image("photo-1536440136628-849c177e76a1", 1200, 720),
    videoUrl: video(1),
    year: "2025",
    rating: "13+",
    duration: "2h 14m",
    match: "95% Match",
    genres: ["Adventure", "Drama", "Epic"],
    description:
      "When a distant colony goes silent, a pilot and her crew cross dangerous terrain to bring back the only signal that matters."
  },
  {
    id: "hero-3",
    title: "Redline District",
    contentType: "series",
    seasons: [
      makeSeason("redline-district", 1, ["Start Line", "Blind Corner", "Underpass", "Heat Map", "No Brakes"], 8),
      makeSeason("redline-district", 2, ["New Engine", "Night Run", "False Flag", "Final Lap", "Finish Line"], 13)
    ],
    eyebrow: "Watch Now",
    rank: "Top 10 this week",
    image: image("photo-1485846234645-a62644f84728", 1800, 1000),
    previewImage: image("photo-1485846234645-a62644f84728", 1200, 720),
    videoUrl: video(2),
    year: "2026",
    rating: "18+",
    duration: "10 Episodes",
    match: "92% Match",
    genres: ["Crime", "Action", "Noir"],
    description:
      "A detective follows one impossible lead into an underground racing syndicate where every win has a hidden price."
  }
];

const titles: TitleItem[] = [
  {
    id: "t-1",
    title: "Shadow Harbor",
    contentType: "movie",
    image: image("photo-1485846234645-a62644f84728", 800, 450),
    previewImage: image("photo-1485846234645-a62644f84728", 900, 520),
    videoUrl: video(3),
    year: "2026",
    rating: "16+",
    duration: "1h 48m",
    match: "97% Match",
    genres: ["Mystery", "Drama"],
    description: "A coastal town hides a conspiracy under every lighthouse beam."
  },
  {
    id: "t-2",
    title: "Signal Nine",
    contentType: "series",
    seasons: [
      makeSeason("signal-nine", 1, ["The First Ping", "Low Orbit", "Broken Array"], 18),
      makeSeason("signal-nine", 2, ["Return Window", "Static Bloom", "The Ninth Signal"], 21)
    ],
    image: image("photo-1517604931442-7e0c8ed2963c", 800, 450),
    previewImage: image("photo-1517604931442-7e0c8ed2963c", 900, 520),
    videoUrl: video(4),
    year: "2025",
    rating: "13+",
    duration: "6 Episodes",
    match: "94% Match",
    genres: ["Sci-Fi", "Suspense"],
    description: "A coded broadcast from deep space rewrites one engineer's life."
  },
  {
    id: "t-3",
    title: "Afterglow",
    contentType: "movie",
    image: image("photo-1478720568477-152d9b164e26", 800, 450),
    previewImage: image("photo-1478720568477-152d9b164e26", 900, 520),
    videoUrl: video(5),
    year: "2024",
    rating: "13+",
    duration: "2h 02m",
    match: "91% Match",
    genres: ["Romance", "Drama"],
    description: "Two strangers reconnect across a summer of music, loss, and second chances."
  },
  {
    id: "t-4",
    title: "Cold Circuit",
    contentType: "series",
    seasons: [
      makeSeason("cold-circuit", 1, ["Boot Sequence", "Thermal Runaway", "The Fault Line", "Hard Reset"], 24),
      makeSeason("cold-circuit", 2, ["Power Cycle", "Root Cause", "Signal Burn", "Cold Start", "Shutdown"], 28)
    ],
    image: image("photo-1524985069026-dd778a71c7b4", 800, 450),
    previewImage: image("photo-1524985069026-dd778a71c7b4", 900, 520),
    videoUrl: video(6),
    year: "2026",
    rating: "16+",
    duration: "9 Episodes",
    match: "96% Match",
    genres: ["Tech", "Thriller"],
    description: "A hardware failure becomes the first clue in a global sabotage case."
  },
  {
    id: "t-5",
    title: "Northbound",
    contentType: "movie",
    image: image("photo-1536440136628-849c177e76a1", 800, 450),
    previewImage: image("photo-1536440136628-849c177e76a1", 900, 520),
    videoUrl: video(7),
    year: "2023",
    rating: "7+",
    duration: "1h 36m",
    match: "89% Match",
    genres: ["Family", "Adventure"],
    description: "A brother and sister follow an old map into the mountains."
  },
  {
    id: "t-6",
    title: "Glass City",
    contentType: "series",
    image: image("photo-1598899134739-24c46f58b8c0", 800, 450),
    previewImage: image("photo-1598899134739-24c46f58b8c0", 900, 520),
    videoUrl: video(8),
    year: "2025",
    rating: "16+",
    duration: "7 Episodes",
    match: "93% Match",
    genres: ["Crime", "Drama"],
    description: "An architect discovers the skyline she designed is built on secrets."
  },
  {
    id: "t-7",
    title: "Rush Hour Zero",
    contentType: "movie",
    image: image("photo-1492144534655-ae79c964c9d7", 800, 450),
    previewImage: image("photo-1492144534655-ae79c964c9d7", 900, 520),
    videoUrl: video(9),
    year: "2026",
    rating: "13+",
    duration: "1h 58m",
    match: "90% Match",
    genres: ["Action", "Comedy"],
    description: "A courier has one night to deliver a package everyone wants."
  },
  {
    id: "t-8",
    title: "Backlot Secrets",
    contentType: "series",
    image: image("photo-1505686994434-e3cc5abf1330", 800, 450),
    previewImage: image("photo-1505686994434-e3cc5abf1330", 900, 520),
    videoUrl: video(10),
    year: "2024",
    rating: "All",
    duration: "12 Episodes",
    match: "88% Match",
    genres: ["Docuseries", "Cinema"],
    description: "Directors reveal the sets, shots, and risks behind unforgettable scenes."
  },
  {
    id: "t-9",
    title: "Opening Night",
    contentType: "series",
    image: image("photo-1489599849927-2ee91cede3ba", 800, 450),
    previewImage: image("photo-1489599849927-2ee91cede3ba", 900, 520),
    videoUrl: video(11),
    year: "2025",
    rating: "7+",
    duration: "5 Episodes",
    match: "92% Match",
    genres: ["Comedy", "Drama"],
    description: "An understudy gets one impossible shot to save a sold-out premiere."
  },
  {
    id: "t-10",
    title: "Final Frame",
    contentType: "movie",
    image: image("photo-1518676590629-3dcbd9c5a5c9", 800, 450),
    previewImage: image("photo-1518676590629-3dcbd9c5a5c9", 900, 520),
    videoUrl: video(12),
    year: "2026",
    rating: "16+",
    duration: "1h 42m",
    match: "95% Match",
    genres: ["Horror", "Mystery"],
    description: "A film editor finds missing footage that should never have existed."
  },
  {
    id: "t-11",
    title: "Cinema 12",
    contentType: "movie",
    image: image("photo-1535016120720-40c646be5580", 800, 450),
    previewImage: image("photo-1535016120720-40c646be5580", 900, 520),
    videoUrl: video(13),
    year: "2025",
    rating: "13+",
    duration: "1h 54m",
    match: "93% Match",
    genres: ["Mystery", "Indie"],
    description: "A midnight screening turns into a hunt for the person changing the film."
  },
  {
    id: "t-12",
    title: "Neon Cut",
    contentType: "series",
    image: image("photo-1506157786151-b8491531f063", 800, 450),
    previewImage: image("photo-1506157786151-b8491531f063", 900, 520),
    videoUrl: video(14),
    year: "2026",
    rating: "16+",
    duration: "8 Episodes",
    match: "96% Match",
    genres: ["Music", "Drama"],
    description: "A rising composer gets pulled into the politics of a ruthless studio."
  },
  {
    id: "t-13",
    title: "Take Two",
    contentType: "series",
    image: image("photo-1516280440614-37939bbacd81", 800, 450),
    previewImage: image("photo-1516280440614-37939bbacd81", 900, 520),
    videoUrl: video(15),
    year: "2024",
    rating: "All",
    duration: "10 Episodes",
    match: "89% Match",
    genres: ["Reality", "Feel-Good"],
    description: "Actors revisit the auditions, mistakes, and tiny choices that changed everything."
  },
  {
    id: "t-14",
    title: "Darkroom",
    contentType: "movie",
    image: image("photo-1492691527719-9d1e07e534b4", 800, 450),
    previewImage: image("photo-1492691527719-9d1e07e534b4", 900, 520),
    videoUrl: video(16),
    year: "2026",
    rating: "18+",
    duration: "2h 06m",
    match: "94% Match",
    genres: ["Crime", "Thriller"],
    description: "A photographer sees evidence of a crime hidden inside one perfect negative."
  },
  {
    id: "t-15",
    title: "Premiere Club",
    contentType: "series",
    image: image("photo-1521737604893-d14cc237f11d", 800, 450),
    previewImage: image("photo-1521737604893-d14cc237f11d", 900, 520),
    videoUrl: video(17),
    year: "2025",
    rating: "13+",
    duration: "6 Episodes",
    match: "91% Match",
    genres: ["Drama", "Satire"],
    description: "Publicists, stars, and critics collide during one chaotic awards season."
  },
  {
    id: "t-16",
    title: "Wide Shot",
    contentType: "movie",
    image: image("photo-1500530855697-b586d89ba3ee", 800, 450),
    previewImage: image("photo-1500530855697-b586d89ba3ee", 900, 520),
    videoUrl: video(18),
    year: "2023",
    rating: "7+",
    duration: "1h 41m",
    match: "87% Match",
    genres: ["Adventure", "Family"],
    description: "A location scout finds the perfect place and the family story buried inside it."
  }
];

export const contentRows: ContentRow[] = [
  {
    title: "Trending Now",
    items: [titles[0], titles[1], titles[2], titles[3], titles[4], titles[5], titles[6], titles[7], titles[8], titles[9], titles[10], titles[11]]
  },
  {
    title: "Top Picks For You",
    items: [titles[12], titles[13], titles[14], titles[15], titles[0], titles[2], titles[4], titles[6], titles[8], titles[10], titles[1], titles[3]]
  },
  {
    title: "Binge-Worthy Series",
    items: [titles[1], titles[3], titles[5], titles[11], titles[14], titles[12], titles[9], titles[4], titles[7], titles[10], titles[2], titles[0]]
  },
  {
    title: "New Releases",
    items: [titles[9], titles[6], titles[4], titles[7], titles[3], titles[1], titles[13], titles[15], titles[8], titles[5], titles[11], titles[12]]
  },
  {
    title: "Movies Night",
    items: [titles[10], titles[2], titles[6], titles[13], titles[15], titles[9], titles[0], titles[8], titles[4], titles[14], titles[3], titles[7]]
  },
  {
    title: "Original Series",
    items: [titles[11], titles[1], titles[3], titles[5], titles[12], titles[14], titles[7], titles[0], titles[10], titles[6], titles[9], titles[2]]
  }
];
