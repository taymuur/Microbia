// Zone configuration for the six-part journey (scroll order).
// Copy is adapted from CLAUDE.md's Content section — plain, British English, factual.
import type { ZoneId } from './microbes';

export type GlowKey = 'teal' | 'cyan' | 'magenta' | 'violet' | 'amber' | 'lime';

export interface ZoneConfig {
  id: ZoneId | 'entrance' | 'keepers';
  index: number;
  eyebrow: string;
  title: string;
  lede: string;
  body: string[];
  /** Research credit line shown as a quiet footnote in the zone. */
  research?: string;
  accent: GlowKey;
  hasSpecies: boolean;
}

export const ZONES: ZoneConfig[] = [
  {
    id: 'soil',
    index: 1,
    eyebrow: 'Zone 01 — underground',
    title: 'The Soil Tunnel',
    lede: 'A journey beneath your feet, where plants and microbes strike deals.',
    body: [
      'Plants communicate with microbes to enlist their help accessing the nutrients they need to grow and produce our food. A single teaspoon of soil holds more microbes than there are people on Earth.',
    ],
    research:
      'John Innes Centre scientists study naturally occurring soil bacteria that protect plants against disease and promote growth. Harnessing the soil microbiome could reduce environmentally harmful agrochemicals and cut greenhouse gases like nitrous oxide (N₂O).',
    accent: 'lime',
    hasSpecies: true,
  },
  {
    id: 'gut',
    index: 2,
    eyebrow: 'Zone 02 — inside you',
    title: 'The Gut Tunnel',
    lede: 'Follow the food inward to meet the microbiome that keeps you well.',
    body: [
      'Fibre and a diet rich in vegetables support the microbial population of the human gut, which in turn helps keep us healthy. It is one of the most crowded microbial habitats on the planet — and it is inside every one of us.',
    ],
    research:
      'Two threads run through the gut: phage research at the Quadram Institute (Revathy and Arezoo), and work by Dr David Vazour at UEA’s Norwich Medical School, who found that subtle changes in the blood — caused by chemicals made by gut bacteria — may reveal the earliest signs of cognitive decline, long before symptoms show. This could lead to a blood test identifying people at higher risk of dementia.',
    accent: 'magenta',
    hasSpecies: true,
  },
  {
    id: 'waterways',
    index: 3,
    eyebrow: 'Zone 03 — rivers & seas',
    title: 'The Waterways',
    lede: 'Dive into water, where microbes help balance the climate.',
    body: [
      'Our rivers and seas face real pressures — sewage, and runoff from landfill and agriculture. Microbial research could help build a more sustainable ecological balance.',
    ],
    research:
      'UEA researchers found that a common ocean alga produces an abundance of a compound called DMSP (dimethylsulfoniopropionate). It breaks down into a gas that creates the characteristic smell of the sea — and plays a vital role in balancing the planet’s climate.',
    accent: 'cyan',
    hasSpecies: true,
  },
  {
    id: 'cafe',
    index: 4,
    eyebrow: 'Zone 04 — the café & gift shop',
    title: 'The Café & Gift Shop',
    lede: 'A pause for breath. Half the menu was made by microbes.',
    body: [
      'Bread, cheese, yoghurt, beer — many everyday foods and household products are made by microbes. Before you leave, take home a free activity book of experiments to try at home.',
    ],
    accent: 'amber',
    hasSpecies: true,
  },
];

export const ENTRANCE = {
  eyebrow: 'You are about to get very, very small',
  title: 'MICROBIA',
  subtitle: 'The digital Microbe Zoo',
  lede: 'Everywhere on Earth has its own population of microbes. We usually cannot see them — yet they supply our food, keep us healthy, and shape the environment and climate. Step into the shrink ray and meet them.',
  cta: 'Shrink me',
  skip: 'Skip the tour',
};
