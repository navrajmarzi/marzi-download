// ─── Shared / Global ─────────────────────────────────────────────
export const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=marzi.app&hl=en_IN";

export const SOCIAL_LINKS = [
  {
    platform: "instagram" as const,
    href: "https://www.instagram.com/marzibyprimus/",
    label: "Instagram",
  },
  {
    platform: "linkedin" as const,
    href: "https://www.linkedin.com/company/marzibyprimus",
    label: "LinkedIn",
  },
];

export const LEGAL_LINKS = [
  { label: "Privacy", href: "https://www.marzi.life/privacy-policy" },
  { label: "Terms", href: "https://www.marzi.life/terms-and-conditions" },
];

export const LOGO = {
  src: "/assets/marzi_crop.png",
  alt: "Marzi",
};

// ─── Navbar ──────────────────────────────────────────────────────
export const NAVBAR = {
  ctaText: "Get the App",
};

// ─── Hero ────────────────────────────────────────────────────────
export const HERO = {
  headline: "Some songs were never meant to be",
  headlineAccent: "sung alone.",
  description:
    "Meet people who still remember the lyrics, the voices, and the magic of songs that defined an era.",
  rating: "4.8",
  memberCount: "50K+",
  ctaText: "Download on Play Store",
  heroImage: "/group_of_people.webp",
};

// ─── Moments With Marzi (storytelling section) ───────────────────
export const MOMENTS_COPY = {
  blocks: [
    {
      text: "No one around you quite gets your obsession with classic filmy music.",
      accent: "You mention a Rafi song, hum a Lata melody...",
    },
    {
      text: "The music still means something to you,",
      accent: "but the moment just passes.",
    },
  ],
};

// ─── Photo Fan (carousel) ────────────────────────────────────────
export const PHOTO_FAN = {
  badge: "Moments with Marzi",
  totalImages: 23,
  imagePathTemplate: "/moments/moment_{index}.jpg", // {index} = 01, 02, …
};

// ─── What Is Marzi (how it works) ────────────────────────────────
export const WHAT_IS_MARZI = {
  badge: "How it works",
  heading:
    "On Marzi, people who grew up with these songs",
  headingAccent:
    "find each other through their shared love for filmy music.",
  cards: {
    findTribe: {
      tag: "Meet Gen Evergreen",
      emoji: "🎶",
      description:
        "Lovers of classic Hindi film music — find your people.",
      image: "/community.webp",
    },
    joinEvents: {
      image: "/events.webp",
      alt: "Seniors having fun",
    },
    jabWeMet: {
      image: "/travel.webp",
      alt: "Jab We Met Marzi",
      label: "Jab We Met",
      labelAccent: "Marzi",
    },
    talkRediscover: {
      tag: "Talk & Rediscover",
      emoji: "🎤",
      description:
        "Talk about songs, singers, and the stories behind them.",
    },
    rediscoverMelodies: {
      text: "📻 Rediscover melodies that never really left.",
      avatars: [
        "https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?w=80&h=80&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=80&h=80&fit=crop&crop=face",
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&crop=face",
      ],
    },
  },
};

// ─── Testimonials ────────────────────────────────────────────────
export const TESTIMONIALS_SECTION = {
  heading: "Across Bangalore,\nmusic lovers are meeting.",
  subtitle:
    "Conversations begin with a song and end with a room full of people singing the same line.",
  items: [
    {
      image: "/manuel_anil_francis.jpg",
      quote:
        "The type of atmosphere and the crowd at Marzi events is mind blowing",
      name: "Manuel Anil Francis",
    },
    {
      image: "/preeta_bellari.jpg",
      quote:
        "Marzi has given me a lot of friends and it makes me feel confident",
      name: "Preetha Bellari",
    },
    {
      image: "/usha_narendran.jpg",
      quote:
        "Marzi is really wonderful, we got a chance to interact with others.",
      name: "Usha Narendran",
    },
  ],
};

// ─── CTA Banner / Footer ────────────────────────────────────────
export const CTA_BANNER = {
  heading: "Music sounds better\nwhen it's shared.",
  subtitle:
    "Come, find the people who still enjoy singing old songs just like you do.",
  ctaText: "Download on Play Store",
  ctaSubtext: "It's free to join · Takes 2 minutes",
  bgImage: "/footer_wall_no_bg.png",
  copyright: "Marzi. All rights reserved",
};

// ─── Backed By ───────────────────────────────────────────────────
export const BACKED_BY = {
  label: "Backed by the best in the industry",
  backers: [
    "Refractional",
    "Prometheus",
    "Watchtower",
    "Shutterframe",
  ],
};

// ─── Landing Footer ─────────────────────────────────────────────
export const LANDING_FOOTER = {
  tagline: "Your Life. Your Terms.",
  company: "PRIMUS",
  aboutText:
    "At Marzi, we're not just building a platform — we're creating a movement. A world where growing older means growing bolder. Where community isn't just a feature, it's the foundation.",
  ctaText: "Get the App at Play Store",
  copyright: "Marzi. All rights reserved",
};
