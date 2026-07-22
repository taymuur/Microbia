// Stage configuration for the journey.
// Order: Soil, Café, Mouth, Gut, Poo, Waterways, then Meet the Scientists.
// Copy is adapted from CLAUDE.md's Content section; plain, British English,
// factual, and free of em dashes.
import type { ZoneId } from './microbes';

export type GlowKey = 'teal' | 'cyan' | 'magenta' | 'violet' | 'amber' | 'lime';

export interface ZoneConfig {
  id: ZoneId | 'entrance' | 'keepers';
  index: number;
  eyebrow: string;
  title: string;
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
    eyebrow: 'Stage 01 · Underground',
    title: 'The Soil',
    short: 'Soil',
    lede: 'A journey beneath your feet, where plants and microbes strike deals.',
    body: [
      'Plants talk to microbes to reach the nutrients they need to grow, and to make our food. One teaspoon of soil holds more microbes than there are people on Earth.',
    ],
    research:
      'John Innes Centre scientists study naturally occurring soil bacteria that protect plants against disease and promote growth. Harnessing the soil microbiome could reduce environmentally harmful agrochemicals and cut greenhouse gases like nitrous oxide (N₂O).',
    accent: 'lime',
    hasSpecies: true,
  },
  {
    id: 'cafe',
    index: 2,
    eyebrow: 'Stage 02 · The Café',
    title: 'The Café',
    short: 'Café',
    lede: 'Grab a bite. A lot of the menu was made by microbes.',
    body: [
      'Bread, cheese, yoghurt and beer are all made by microbes. Fibre and a diet rich in vegetables also feed the helpful microbes that live inside you, so what you eat here matters for the stages ahead.',
    ],
    accent: 'amber',
    hasSpecies: true,
  },
  {
    id: 'mouth',
    index: 3,
    eyebrow: 'Stage 03 · The Way In',
    title: 'The Mouth',
    short: 'Mouth',
    lede: 'The front door to your body, and the first stop for your food.',
    body: [
      'Everything you eat at the café starts its journey here. Your mouth is warm, wet and home to its own busy community of microbes before the food heads deeper inside.',
    ],
    accent: 'magenta',
    hasSpecies: false,
  },
  {
    id: 'gut',
    index: 4,
    eyebrow: 'Stage 04 · Inside You',
    title: 'The Gut',
    short: 'Gut',
    lede: 'Follow the food inward to meet the microbiome that keeps you well.',
    body: [
      'Fibre and a diet rich in vegetables feed the microbes of the human gut, and in turn they help keep us healthy. It is one of the most crowded microbial habitats on the planet, and it is inside every one of us.',
    ],
    research:
      'Two threads run through the gut: phage research at the Quadram Institute (Revathy and Arezoo), and work by Dr David Vazour at UEA’s Norwich Medical School, who found that subtle changes in the blood, caused by chemicals made by gut bacteria, may reveal the earliest signs of cognitive decline long before symptoms show. This could lead to a blood test identifying people at higher risk of dementia.',
    accent: 'violet',
    hasSpecies: true,
  },
  {
    id: 'poo',
    index: 5,
    eyebrow: 'Stage 05 · The End of the Line',
    title: 'The Giant Poo',
    short: 'Poo',
    lede: 'Where the journey through your gut finally comes out.',
    body: [
      'A surprisingly large part of poo is living microbes, washed out from the crowded world of the gut. It is proof of just how busy the microbiome really is.',
    ],
    accent: 'amber',
    hasSpecies: false,
  },
  {
    id: 'waterways',
    index: 6,
    eyebrow: 'Stage 06 · Rivers & Seas',
    title: 'The Waterways',
    short: 'Water',
    lede: 'Dive into water, where microbes help balance the climate.',
    body: [
      'Our rivers and seas face real pressures from sewage and runoff from landfill or agriculture. Microbial research could help build a more sustainable ecological balance.',
    ],
    research:
      'UEA researchers found that a common ocean alga produces an abundance of a compound called DMSP (dimethylsulfoniopropionate). It breaks down into a gas that creates the characteristic smell of the sea, and plays a vital role in balancing the planet’s climate.',
    accent: 'cyan',
    hasSpecies: true,
  },
];

export const ENTRANCE = {
  eyebrow: 'You are about to get very, very small',
  title: 'MICROBIA',
  subtitle: 'The Microbe Zoo',
  lede: 'Everywhere on Earth has its own crowd of microbes. We usually cannot see them, yet they grow our food, keep us healthy, and shape the planet. Step into the shrink ray and go and meet them.',
  cta: 'Shrink me',
  skip: 'Skip the shrink ray',
};
