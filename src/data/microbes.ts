// The microbe cast + species-card content.
// Every claim here is grounded in CLAUDE.md's Content section or the sourced
// "Meet the Microbe" fact sheets. No invented research findings, names or stats.
// Where a specific fact is not sourced, the copy is written generically.

export type MicrobeGroup = 'Bacteria' | 'Virus' | 'Fungi' | 'Algae / protist';
export type ZoneId = 'soil' | 'gut' | 'waterways' | 'cafe';

export interface Microbe {
  id: string;
  name: string;
  /** Optional sourced etymology, e.g. Streptomyces. */
  meaning?: string;
  group: MicrobeGroup;
  zone: ZoneId;
  /** One-line "what it does" for the card front. */
  tagline: string;
  /** Short factual body for the opened card. */
  blurb: string;
  /** Which bioluminescent hue the card glows with (mapped to group). */
  glow: 'teal' | 'cyan' | 'magenta' | 'violet' | 'amber' | 'lime';
}

// Glow-by-group, per the design system (four groups = four kinds of light).
export const GROUP_GLOW: Record<MicrobeGroup, Microbe['glow']> = {
  Bacteria: 'teal',
  Virus: 'violet',
  Fungi: 'amber',
  'Algae / protist': 'cyan',
};

export const MICROBES: Microbe[] = [
  // ---- Soil ----
  {
    id: 'streptomyces',
    name: 'Streptomyces',
    meaning: 'streptos = twisted · myces = fungus',
    group: 'Bacteria',
    zone: 'soil',
    tagline: 'Makes the smell of rain, and the first TB antibiotic.',
    blurb:
      'Found in dry, non-acidic soil, Streptomyces secrete enzymes to break down organic waste and produce a compound called geosmin — the earthy smell you notice after it rains. Streptomyces griseus is important for antibiotic production: it makes streptomycin, which was used as the first treatment against tuberculosis.',
    glow: 'teal',
  },
  {
    id: 'pseudomonas',
    name: 'Pseudomonas',
    group: 'Bacteria',
    zone: 'soil',
    tagline: 'A soil bacterium that can defend plants.',
    blurb:
      'Some naturally occurring soil bacteria protect plants against disease and promote their growth. Harnessing the soil microbiome this way could reduce our reliance on environmentally harmful agrochemicals.',
    glow: 'teal',
  },
  {
    id: 'rhizobia',
    name: 'Rhizobia',
    group: 'Bacteria',
    zone: 'soil',
    tagline: 'Partners with plant roots underground.',
    blurb:
      'Plants communicate with soil microbes to enlist their help accessing the nutrients they need to grow and produce food. Root-partnering bacteria like these are part of that hidden exchange.',
    glow: 'teal',
  },

  // ---- Gut ----
  {
    id: 'bifidobacterium',
    name: 'Bifidobacterium',
    group: 'Bacteria',
    zone: 'gut',
    tagline: 'A friendly resident of the gut microbiome.',
    blurb:
      'Fibre and a diet rich in vegetables support the gut’s microbial population, which in turn helps keep us healthy. Bifidobacteria are among the community of microbes that thrive on that fibre.',
    glow: 'teal',
  },
  {
    id: 'ecoli',
    name: 'E. coli',
    group: 'Bacteria',
    zone: 'gut',
    tagline: 'A common member of the gut community.',
    blurb:
      'Escherichia coli is one of the best-studied bacteria on Earth and a normal, mostly harmless resident of the healthy gut microbiome.',
    glow: 'teal',
  },
  {
    id: 'bacteriophage',
    name: 'Bacteriophage',
    group: 'Virus',
    zone: 'gut',
    tagline: 'A virus that infects bacteria — not you.',
    blurb:
      'There are more phages in the gut microbiome than bacteria. Researchers Revathy and Arezoo at the Quadram Institute study whether we can harness the way phages infect bacteria to combat antibiotic-resistant, disease-causing bacteria — a possible replacement for antibiotics.',
    glow: 'violet',
  },

  // ---- Waterways ----
  {
    id: 'euglena',
    name: 'Euglena',
    group: 'Algae / protist',
    zone: 'waterways',
    tagline: 'Part plant, part animal — and a tiny factory.',
    blurb:
      'Protists are a huge, poorly understood group of microbes found everywhere. Some, like Euglena, can produce high-value compounds such as pharmaceuticals. Scientists at the Earlham Institute use single-cell genomics to decode them.',
    glow: 'cyan',
  },
  {
    id: 'prymnesium',
    name: 'Prymnesium',
    group: 'Algae / protist',
    zone: 'waterways',
    tagline: 'A single-celled alga of rivers and seas.',
    blurb:
      'One of the countless microscopic algae that live in our waterways — part of the vast, largely hidden microbial life that shapes rivers and seas.',
    glow: 'cyan',
  },
  {
    id: 'shewanella',
    name: 'Shewanella',
    group: 'Bacteria',
    zone: 'waterways',
    tagline: 'A water-dwelling bacterium.',
    blurb:
      'Part of the microbial life of rivers and seas. Microbial research could help build a sustainable ecological balance in waterways challenged by sewage and runoff.',
    glow: 'teal',
  },

  // ---- Café ----
  {
    id: 'saccharomyces',
    name: 'Saccharomyces',
    group: 'Fungi',
    zone: 'cafe',
    tagline: 'Baker’s and brewer’s yeast.',
    blurb:
      'Many everyday foods are made by microbes. This yeast makes bread rise and ferments beer and wine — a microbe you have almost certainly eaten today.',
    glow: 'amber',
  },
];

export const microbesByZone = (zone: ZoneId): Microbe[] =>
  MICROBES.filter((m) => m.zone === zone);

export const TOTAL_MICROBES = MICROBES.length;
