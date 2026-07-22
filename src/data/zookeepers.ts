// "Meet the Zookeepers" — the real research groups behind the Microbe Zoo.
// Grounded strictly in CLAUDE.md's Content section. No invented people or claims.

export interface Zookeeper {
  id: string;
  institution: string;
  zone: string;
  work: string;
  accent: 'teal' | 'cyan' | 'magenta' | 'violet' | 'amber' | 'lime';
}

export const ZOOKEEPERS: Zookeeper[] = [
  {
    id: 'jic',
    institution: 'John Innes Centre',
    zone: 'The Soil Tunnel',
    work: 'Studying naturally occurring soil bacteria that protect plants against disease and promote growth — a route to cutting harmful agrochemicals and greenhouse gases like N₂O.',
    accent: 'lime',
  },
  {
    id: 'quadram',
    institution: 'Quadram Institute',
    zone: 'The Gut Tunnel',
    work: 'Revathy and Arezoo study bacteriophages — viruses that infect bacteria — asking whether they could be harnessed against antibiotic-resistant bacteria as a replacement for antibiotics.',
    accent: 'violet',
  },
  {
    id: 'uea-brain',
    institution: 'UEA · Norwich Medical School',
    zone: 'The Gut Tunnel',
    work: 'Dr David Vazour found that subtle blood changes, caused by chemicals made by gut bacteria, may reveal the earliest signs of cognitive decline — pointing toward a blood test for dementia risk.',
    accent: 'magenta',
  },
  {
    id: 'uea-sea',
    institution: 'University of East Anglia',
    zone: 'The Waterways',
    work: 'Found that a common ocean alga produces an abundance of DMSP — the compound behind the smell of the sea, and a key player in balancing the planet’s climate.',
    accent: 'cyan',
  },
  {
    id: 'tsl',
    institution: 'The Sainsbury Laboratory',
    zone: 'Global biosecurity',
    work: 'Sophien Kamoun’s group developed the sequencing technology “Field Pathogenomics” and the web platform “OpenWheatBlast” to combat wheat blast, a devastating fungal disease — helping farmers avoid crop losses.',
    accent: 'amber',
  },
  {
    id: 'earlham',
    institution: 'Earlham Institute',
    zone: 'The Waterways',
    work: 'Using single-cell genomics to decode protists. Sequencing Bodo — the closest free-living relative of the parasite behind sleeping sickness — revealed how these microbes evolved and interact with their environment.',
    accent: 'cyan',
  },
];
