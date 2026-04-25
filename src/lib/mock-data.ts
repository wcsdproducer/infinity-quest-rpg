import type { Character } from './types';

export const mockCharacter: Character = {
  id: 'mock-char-1',
  playerId: 'player-1',
  name: 'Ava',
  class: 'Teamster',
  traumaResponse: 'Panic',
  currentLocationId: undefined,
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
  modifiers: {
    stats: {
        strength: 0,
        speed: 0,
        intellect: 0,
        combat: 0,
    },
    saves: {
        sanity: 0,
        fear: 0,
        body: 0,
    },
  },
  health: {
    current: 85,
    max: 100,
  },
  armorPoints: 10,
  stress: {
    current: 3,
    min: 2,
  },
  wounds: {
    current: 0,
    max: 2,
  },
  carryingCapacity: {
    current: 5,
    max: 10,
  },
  skills: [
    { name: 'Zero-G', level: 'Trained' },
    { name: 'Mechanical Repair', level: 'Expert' },
    { name: 'Piloting', level: 'Trained' },
    { name: 'Gunnery', level: 'Expert' }
  ],
  inventory: [
    'Standard Crew Jumpsuit',
    'Vibechete',
    'Patch-Kit',
    'Standard-Issue Medpac',
    'Flashlight',
  ],
};
