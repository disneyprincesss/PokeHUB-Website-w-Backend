// constants/gameConstants.ts
export const GAME_CONFIG = {
  API_URL: 'https://pokeapi.co/api/v2',
  MAX_POKEMON_ID: 151,
  INITIAL_MANA: 100,
  SKIP_MANA_GAIN: 30,
  STAT_MULTIPLIER: 3,
  SKILL_POWER: 25,
  CRIT_CHANCE: 0.05,
  DODGE_CHANCE: 0.25,
  EFFECTIVE_MULTIPLIER: 1.25,
  CRIT_MULTIPLIER: 1.5,
} as const;

export const TAUNTS = [
  "Take that!",
  "You can't beat me!",
  "Feel my power!",
  "Is that all you've got?",
  "Prepare to lose!",
  "I'm just getting started!",
] as const;