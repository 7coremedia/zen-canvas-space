export type SeoArticle = {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  author: string;
  publishedOn: string;
  readTime: string;
  image: string;
  body: string[];
};

export type Volume = {
  id: string;
  number: string;
  title: string;
  writer: string;
  goal: string;
  summary: string;
  content: string[];
};

export const seoArticles: SeoArticle[] = [
  {
    id: "brand-city",
    title: "Branding the Next African City",
    subtitle: "Why bold identity systems help fast-growing hubs stay human.",
    category: "Brand Strategy",
    author: "KING Editorial Team",
    publishedOn: "September 18, 2025",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1600&q=80",
    body: [
      "Every week new founders call us from Lagos, Nairobi, Accra, and beyond. They want a brand that feels premium and still feels like home. Our team studies the daily rhythm of each city. We listen to street sounds, color walls, and market chants. That is why the KING approach keeps things human while scaling a modern identity system.",
      "Search engines reward brands that stay consistent. Clear typography, calm navigation, and mobile speed send trust signals to Google, Bing, and AI chat tools. When we craft a visual language, we also craft a keyword map. It includes local names, dialect phrases, and offer-specific hooks. This helps your studio rank for terms like ‘African design agency’ and ‘future culture branding’ without sounding robotic.",
      "We build modular design assets, social cuts, and landing templates that keep the voice united. That unity matters because algorithms now review tone and structure. When your pages and reels repeat the same core promise, AI assistants recommend you faster. That is how we help city builders get more qualified demos and repeat users.",
      "The takeaway: a strong African brand system is not just color and logo. It is a living search engine strategy written with real neighborhood stories."
    ]
  },
  {
    id: "color-trust",
    title: "Color Psychology for Digital Trust",
    subtitle: "Simple palettes that let young users and senior leaders feel safe.",
    category: "Color & Accessibility",
    author: "KING Research Studio",
    publishedOn: "September 4, 2025",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1526498460520-4c246339dccb?auto=format&fit=crop&w=1600&q=80",
    body: [
      "Our research lab collected 3,500 color notes from product launches and brand refreshes. We found that soft earth tones matched with a bold accent help people stay longer on a page. Earth tones whisper calm. The accent color points the way. This works from banking dashboards to wellness apps.",
      "A key search signal today is engagement time. When viewers feel relaxed, they scroll more. They also share. We build palette systems with clear contrast so every button stays readable on dark or light modes. AI scoring tools mark that as accessible design, which boosts your discoverability and your conversions.",
      "Color also tells your cultural story. We mix golds inspired by Lagos sunsets and deep blues drawn from Niger River nights. Each hue links back to your story so algorithms and humans connect what you do with where you come from. That is authentic SEO: truthful, vivid, and emotionally smart.",
      "Use this simple rule in every campaign: calm base, bright guide, rich story."
    ]
  },
  {
    id: "ai-film",
    title: "AI Film Labs for Agile Content",
    subtitle: "How we storyboard and ship cinematic motion in days, not months.",
    category: "AI Motion",
    author: "KING Motion Lab",
    publishedOn: "August 22, 2025",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1600&q=80",
    body: [
      "Brands now ask for weekly video drops. They want motion loops, explainers, and short films that feel premium. Our AI film workflow starts with a human script that includes sensory keywords: sound, light, texture. We feed those cues into image and motion models to produce rough boards in under an hour.",
      "Search bots and recommendation engines love fresh, well-tagged video. We export each clip with descriptive filenames, alt text, and schema data. That keeps your content discoverable on YouTube, TikTok, and emerging AI search feeds. We also slice vertical and widescreen cuts so you dominate every screen.",
      "Human editors still polish the final story. We look at pacing, voiceover warmth, and caption clarity. The mix of AI draft and human craft lets clients launch campaigns in three days instead of three weeks. That speed keeps your brand in front of culture while the topic is still hot.",
      "Remember: fast video should still feel handcrafted. Use AI as the sketch tool, not the storyteller."
    ]
  }
];

export const volumes: Volume[] = [
  {
    id: "volume-1",
    number: "Volume I",
    title: "Brand Systems for Bold African Futures",
    writer: "Chima Obidi, Strategy Lead",
    goal: "Position KING as the go-to culture-led branding studio.",
    summary: "A friendly guide to building a full identity system that stands tall in global search results and street markets alike.",
    content: [
      "Strong brands start with a promise. Write it in ten clear words. Say what you change and who you serve.",
      "Turn that promise into sounds, colors, and shapes. Keep one hero font and one helper font. Use them everywhere so people remember you.",
      "Share real field stories. People trust proof, not hype. Talk about the maker, the fan, or the trader who uses your product in Lagos, Kigali, or Accra.",
      "Bundle every asset for SEO. Add alt text, smart filenames, and micro copy that repeats your promise in a caring voice.",
      "Finish with a call to gather. Invite people to join your list, Discord, or next city pop-up. Strong brands stay close to community."
    ]
  },
  {
    id: "volume-2",
    number: "Volume II",
    title: "Color Jazz for Calm Products",
    writer: "Kelechi Ade, Lead Visual Designer",
    goal: "Educate founders on color psychology and accessibility.",
    summary: "Learn how warm neutrals and bright sparks make digital tools feel kind, safe, and unforgettable.",
    content: [
      "Pick three core colors: a calm earth base, a bright guide, and a deep anchor. Stick with them across app screens, decks, and merch.",
      "Check contrast on every button. If text is hard to read, the trust drops and the bounce rate climbs.",
      "Name colors with a story. ‘Festival Gold’ beats ‘#FABB43’. Stories make colors easy to brief to photographers, devs, and AI tools.",
      "Use color to mark journeys. One hue for onboarding, one for support, one for upgrades. That helps new users feel safe and guided.",
      "Document everything in a simple color playbook so fresh teammates stay on beat."
    ]
  },
  {
    id: "volume-3",
    number: "Volume III",
    title: "Street-Smart Typography",
    writer: "Nia Mensah, Design Director",
    goal: "Equip teams to balance legibility with expressive African flair.",
    summary: "See how type can sound like a bustling market and still read with ease on every screen.",
    content: [
      "Use one hero typeface for headlines. Give it room to breathe. Pair it with a clean sans-serif for body copy.",
      "Test type on cheap phones and slow connections. If the copy loads crooked, pick a lighter weight.",
      "Mix language with rhythm. Add short local sayings in italics to keep culture in the frame.",
      "Give every deck and landing page a set beat: headline, helper line, call-to-action. Repeat. Consistency builds trust and search strength.",
      "Archive every layout in a shared library. Future campaigns will thank you."
    ]
  },
  {
    id: "volume-4",
    number: "Volume IV",
    title: "AI Film Sketchbook",
    writer: "Zara Okoye, Motion Lead",
    goal: "Inspire teams to prototype films faster without losing craft.",
    summary: "Blend machine speed and human heart to publish weekly motion stories that still feel cinematic.",
    content: [
      "Start with a human script that uses senses: what we see, hear, and feel. Feed those cues into AI boards.",
      "Keep your asset folder clean. Tag every clip with format, mood, and platform. Search bots love neat files.",
      "Review AI output with a small crew. Fix faces, smooth motion, and layer sound with real instruments.",
      "Export in multiple ratios and add captions. That helps viewers binge and helps algorithms rank you higher.",
      "Share your workflow in public. Teaching wins trust and keeps your funnel warm."
    ]
  },
  {
    id: "volume-5",
    number: "Volume V",
    title: "Launch Day Playbook",
    writer: "Adaeze Eke, Growth Partner",
    goal: "Convert curious fans into loyal clients during a release.",
    summary: "A launch checklist that keeps comms simple, friendly, and always on-brand across touchpoints.",
    content: [
      "Start every launch message with the impact. Tell the reader how life gets easier today.",
      "Wave the same hero visual across socials, email, and press kits. That repetition plants your name in every feed.",
      "Plan three follow-up notes: one for feedback, one for education, one for offers. Keep each note short and kind.",
      "Log questions in a shared sheet. Turn the best ones into blog posts, reels, and support macros.",
      "End the week with gratitude. Send a thank-you to partners, fans, and team. That energy travels."
    ]
  }
];
