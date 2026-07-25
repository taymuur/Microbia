// The microbe cast and species-card content.
// Every claim is grounded in the "Meet the Microbe" fact sheets or CLAUDE.md's
// Content section. No invented research findings, names or statistics.
// `color` is each microbe's authentic fact-sheet colour (used for its artwork);
// `glow` is the habitat accent used for the surrounding UI.

export type MicrobeGroup = 'Bacteria' | 'Virus' | 'Fungi' | 'Algae / protist';
export type ZoneId = 'soil' | 'cafe' | 'mouth' | 'gut' | 'poo' | 'waterways';
export type GlowKey = 'teal' | 'cyan' | 'magenta' | 'violet' | 'amber' | 'lime';

export interface Microbe {
  id: string;
  name: string;
  meaning?: string;
  group: MicrobeGroup;
  zone: ZoneId;
  tagline: string;
  blurb: string;
  glow: GlowKey;
  color: string;
}

export const GROUP_GLOW: Record<MicrobeGroup, GlowKey> = {
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
      'Found in dry, non-acidic soil, Streptomyces secrete enzymes to break down organic waste and produce a compound called geosmin, the earthy smell you notice after it rains. Streptomyces griseus is important for antibiotic production; it makes streptomycin, which was used as the first treatment against tuberculosis.',
    glow: 'lime',
    color: '#3aa0d8',
  },
  {
    id: 'pseudomonas',
    name: 'Pseudomonas',
    meaning: 'pseudo = false · monas = unit',
    group: 'Bacteria',
    zone: 'soil',
    tagline: 'A rod with a tuft of tails that can defend plants.',
    blurb:
      'Found in fresh water and moist soil, Pseudomonas form biofilms, a sticky layer that raises their antibiotic resistance. Some naturally occurring strains protect plants against disease and promote their growth, which could reduce our reliance on environmentally harmful agrochemicals.',
    glow: 'lime',
    color: '#2fae8f',
  },
  {
    id: 'rhizobia',
    name: 'Rhizobia',
    meaning: 'rhiza = root · bios = life',
    group: 'Bacteria',
    zone: 'soil',
    tagline: 'Lives in plant roots and feeds them nitrogen.',
    blurb:
      'Found in soil and inside the root nodules of leguminous plants like peas, beans and clover. Through nitrogen fixation, rhizobia convert nitrogen gas from the air into a form plants can use to grow; in exchange they gain energy and nutrients from the plant. It is a symbiotic relationship.',
    glow: 'lime',
    color: '#ef8fbf',
  },

  // ---- Café ----
  {
    id: 'saccharomyces',
    name: 'Saccharomyces',
    meaning: 'saccharo = sugar · myces = fungi',
    group: 'Fungi',
    zone: 'cafe',
    tagline: 'The worker yeast that buds to make bread and beer.',
    blurb:
      'Found on virtually every surface and a harmless commensal in the gut, Saccharomyces reproduces by budding, where a small cell grows off the parent. Saccharomyces cerevisiae was the first eukaryote to have its full genome sequenced, and is used to make wine, beer and bread.',
    glow: 'amber',
    color: '#ef8a3a',
  },

  // ---- Gut ----
  {
    id: 'bifidobacterium',
    name: 'Bifidobacterium',
    meaning: 'bifidus = in two parts (a branched V or Y shape)',
    group: 'Bacteria',
    zone: 'gut',
    tagline: 'A branched Y-shaped friend of the gut.',
    blurb:
      'Found in the gut, Bifidobacterium can make up 60 to 70 per cent of a baby’s gut microbiota and about 10 per cent in healthy adults. Strains like Bifidobacterium bifidum are beneficial for gut health, found in fermented foods like yoghurt and cheese, and used to treat ulcerative colitis and IBS.',
    glow: 'magenta',
    color: '#9b6fc0',
  },
  {
    id: 'ecoli',
    name: 'E. coli',
    meaning: 'named after scientist Theodor Escherich',
    group: 'Bacteria',
    zone: 'gut',
    tagline: 'A rod fringed with tails; a normal gut resident.',
    blurb:
      'Escherichia coli is usually harmless and lives as part of the gut microbiome in the lower intestine and colon. Certain strains found in raw or undercooked food produce a powerful Shiga toxin, so contaminated food can cause food poisoning.',
    glow: 'magenta',
    color: '#9aa0a6',
  },
  {
    id: 'bacteriophage',
    name: 'Bacteriophage',
    meaning: 'bacterio = bacteria · phage = to devour',
    group: 'Virus',
    zone: 'gut',
    tagline: 'A lander-shaped virus that eats bacteria, not you.',
    blurb:
      'Up to 100 times smaller than a bacterium, each type of phage kills different bacteria without affecting humans. Its genetic material sits inside a protein capsid shaped like an elongated icosahedron (20 triangular faces). There are more phages in the gut than bacteria; researchers Revathy and Arezoo at the Quadram Institute study phage therapy as a possible replacement for antibiotics.',
    glow: 'magenta',
    color: '#ec3f8f',
  },

  // ---- Waterways ----
  {
    id: 'euglena',
    name: 'Euglena',
    meaning: 'eu = good · glena = eye',
    group: 'Algae / protist',
    zone: 'waterways',
    tagline: 'A green swimmer with a light-sensing red eyespot.',
    blurb:
      'Found in fresh and salty water, Euglena has a distinct red eyespot (a stigma) that detects light, and uses chloroplasts to photosynthesise, removing CO₂ from the environment. Euglena gracilis is approved as a food supplement, high in vitamins and carbohydrates.',
    glow: 'cyan',
    color: '#7cbf3f',
  },
  {
    id: 'prymnesium',
    name: 'Prymnesium',
    meaning: 'also known as golden algae',
    group: 'Algae / protist',
    zone: 'waterways',
    tagline: 'A golden ovoid with two long swimming tails.',
    blurb:
      'A golden alga found in fresh or salt water, propelled by two long flagella. In Norfolk, Prymnesium parvum lives in the Hickling Broads; occasionally it blooms, which can threaten the ecosystem by producing prymnesin, a compound toxic to fish.',
    glow: 'cyan',
    color: '#f5b912',
  },
  {
    id: 'shewanella',
    name: 'Shewanella',
    meaning: 'named after scientist James Shewan',
    group: 'Bacteria',
    zone: 'waterways',
    tagline: 'A rod with one whip-like tail that cleans up metals.',
    blurb:
      'Found in aquatic habitats including salt water, Shewanella can also survive extreme heat and pressure. Shewanella oneidensis MR-1 helps clean biohazardous sites by recycling iron, manganese and trace metals, a process called bioremediation.',
    glow: 'cyan',
    color: '#e0392f',
  },
];

export const microbesByZone = (zone: ZoneId): Microbe[] =>
  MICROBES.filter((m) => m.zone === zone);

export const TOTAL_MICROBES = MICROBES.length;
