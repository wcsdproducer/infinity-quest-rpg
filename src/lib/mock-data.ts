import type { Character } from './types';

export const mockCharacter: Character = {
  name: 'Ava',
  class: 'Teamster',
  stats: {
    strength: 40,
    speed: 35,
    intellect: 50,
    combat: 30,
  },
  saves: {
    sanity: 30,
    fear: 25,
    body: 40,
  },
  health: {
    current: 85,
    max: 100,
  },
  stress: {
    current: 3,
    min: 2,
  },
  skills: [
    'Zero-G',
    'Mechanical Repair',
    'Piloting',
    'Gunnery'
  ],
  inventory: [
    'Standard Crew Jumpsuit',
    'Vibechete',
    'Patch-Kit',
    'Standard-Issue Medpac',
    'Flashlight',
  ],
};
