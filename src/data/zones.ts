// Habitat configuration for the journey. Order: Soil → Café → Gut → Waterways,
// then Meet the Zookeepers. Copy adapted from CLAUDE.md's Content section —
// plain, British English, factual.
import type { ZoneId } from './microbes';

export type GlowKey = 'teal' | 'cyan' | 'magenta' | 'violet' | 'amber' | 'lime';

export interface ZoneConfig {
  id: ZoneId | 'entrance' | 'keepers';
  index: number;
  eyebrow: string;
  title: string;
  /** Tiny label for the map/navigator. */
  short: string;
  lede: string;
  body: string[];
  research?: string;
  accent: GlowKey;
  hasSpecies: boolean;
}

export const ZONES: ZoneConfig[] = [
  {
    id: 'soil',
    index: 1,
    eyebrow: 'Habitat 01 — underground',
    title: 'The Soil Tunnel',
    short: 'Soil',
    lede: 'A journey beneath your feet, where plants and microbes strike deals.',
    body: [
      'Plants talk to microbes to get help reaching the nutrients they need to grow — and to make our food. One teaspoon of soil holds more microbes than there are people on Earth.',
    ],
    research:
      'John Innes Centre scientists study naturally occurring soil bacteria that protect plants against disease and promote growth. Harnessing the soil microbiome could reduce environmentally harmful agrochemicals and cut greenhouse gases like nitrous oxide (N₂O).',
    accent: 'lime',
    hasSpecies: true,
  },
  {
    id: 'cafe',
    index: 2,
    eyebrow: 'Habitat 02 — the café & gift shop',
    title: 'The Café & Gift Shop',
    short: 'Café',
    lede: 'Food grown in the soil arrives here — and a lot of it was made by microbes.',
    body: [
      'Bread, cheese, yoghurt, beer — many everyday foods and household products are made by microbes. Grab a bite before you follow the food inward. On your way out, take home a free activity book of experiments to try.',
    ],
    accent: 'amber',
    hasSpecies: true,
  },
  {
    id: 'gut',
    index: 3,
    eyebrow: 'Habitat 03 — inside you',
    title: 'The Gut Tunnel',
    short: 'Gut',
    lede: 'Follow the food inward to meet the microbiome that keeps you well.',
    body: [
      'Fibre and a diet rich in vegetables feed the microbes of the human gut, and in turn they help keep us healthy. It is one of the most crowded microbial habitats on the planet — and it is inside every one of us.',
    ],
    research:
      'Two threads run through the gut: phage research at the Quadram Institute (Revathy and Arezoo), and work by Dr David Vazour at UEA’s Norwich Medical School, who found that subtle changes in the blood — caused by chemicals made by gut bacteria — may reveal the earliest signs of cognitive decline, long before symptoms show. This could lead to a blood test identifying people at higher risk of dementia.',
    accent: 'magenta',
    hasSpecies: true,
  },
  {
    id: 'waterways',
    index: 4,
    eyebrow: 'Habitat 04 — rivers & seas',
    title: 'The Waterways',
    short: 'Water',
    lede: 'Dive into water, where microbes help balance the climate.',
    body: [
      'Our rivers and seas face real pressures — sewage, and runoff from landfill and agriculture. Microbial research could help build a more sustainable ecological balance.',
    ],
    research:
      'UEA researchers found that a common ocean alga produces an abundance of a compound called DMSP (dimethylsulfoniopropionate). It breaks down into a gas that creates the characteristic smell of the sea — and plays a vital role in balancing the planet’s climate.',
    accent: 'cyan',
    hasSpecies: true,
  },
];

export const ENTRANCE = {
  eyebrow: 'You are about to get very, very small',
  title: 'MICROBIA',
  subtitle: 'The digital Microbe Zoo',
  lede: 'Everywhere on Earth has its own crowd of microbes. We usually cannot see them — yet they grow our food, keep us healthy, and shape the planet. Step into the shrink ray and go and meet them.',
  cta: 'Shrink me!',
  skip: 'Skip the shrink ray',
};
