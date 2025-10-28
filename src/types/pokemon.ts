interface Stat {
  name: string;
  value: number;
}

export interface Skill {
  name: string;
  power: number;
  accuracy: number;
  type: string;
  manaCost: number;
}

export interface Pokemon {
  id: number;
  name: string;
  stats: Stat[];
  types: string[];
  weaknesses: string[];
  skills: Skill[];
  sprite: string;
}

export interface BattleResult {
  damage: number;
  crit: boolean;
  dodged: boolean;
  emoji: string;
}

export interface PokemonSpriteProps {
  pokemon: Pokemon;
  currentHp: number;
  maxHp: number;
  currentMana: number;
  isFlashing: boolean;
  position: "player" | "opponent";
}

export interface BattleUIProps {
  playerPokemon: Pokemon;
  currentMana: number;
  turn: number;
  winner: string | null;
  battleLog: string[];
  onSkillSelect: (skill: Skill) => void;
  onSkipTurn: () => void;
  onRestart: () => void;
}

export interface PokemonStatsBoxProps {
  pokemon: Pokemon;
  currentHp: number;
  maxHp: number;
  currentMana: number;
  position: "top-right" | "bottom-left";
}

export interface SkillButtonProps {
  skill: Skill;
  index: number;
  canUse: boolean;
  onClick: () => void;
}

export interface HealthBarProps {
  current: number;
  max: number;
  type: "health" | "mana";
  width?: string;
}

export interface PokemonListItem {
  name: string;
  url: string;
  types?: string[];
}

export interface EvolutionPokemon {
  id: number;
  name: string;
  image: string;
  types: { slot: number; type: { name: string } }[];
}

export interface PokemonDetails {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: { slot: number; type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  abilities: { is_hidden: boolean; ability: { name: string } }[];
  description?: string;
  image?: string;
  evolutionChain?: EvolutionPokemon[];
  customAbout?: AboutInfo | null;
}

export interface AboutInfo {
  height: string | null;
  weight: string | null;
  description: string | null;
}

export interface AboutResponse {
  data: {
    pokemonId: number;
    aboutInfo: AboutInfo;
  };
}