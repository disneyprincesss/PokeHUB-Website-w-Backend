import { GAME_CONFIG } from '../constants/gameConstants';
import type { Pokemon, Skill, BattleResult } from '../types/pokemon';

export function getRandomId(): number {
  return Math.floor(Math.random() * GAME_CONFIG.MAX_POKEMON_ID) + 1;
}

export async function fetchPokemonById(id: number): Promise<Pokemon> {
  const res = await fetch(`${GAME_CONFIG.API_URL}/pokemon/${id}`);
  const data = await res.json();

  const stats = data.stats.map((s: any) => ({
    name: s.stat.name,
    value: s.base_stat * GAME_CONFIG.STAT_MULTIPLIER,
  }));

  const types: string[] = data.types.map((t: any) => t.type.name);

  const moves = [...data.moves]
    .filter((m: any) => m.version_group_details[0].move_learn_method.name === 'level-up')
    .sort(() => Math.random() - 0.5)
    .slice(0, 4)
    .map((m: any) => ({
      name: m.move.name,
      power: GAME_CONFIG.SKILL_POWER,
      accuracy: 100,
      type: types[0],
      manaCost: Math.floor(Math.random() * 21) + 20,
    }));

  const sprite = data.sprites.front_default;

  let weaknesses: string[] = [];
  for (const type of types) {
    const typeRes = await fetch(`${GAME_CONFIG.API_URL}/type/${type}`);
    const typeData = await typeRes.json();
    weaknesses.push(
      ...typeData.damage_relations.double_damage_from.map((t: any) => t.name)
    );
  }
  weaknesses = Array.from(new Set(weaknesses));

  return {
    id: data.id,
    name: data.name,
    stats,
    types,
    weaknesses,
    skills: moves,
    sprite,
  };
}

export function calculateDamage(attacker: Pokemon, defender: Pokemon, skill: Skill): BattleResult {
  const isEffective = defender.weaknesses.includes(skill.type);
  const critChance = Math.random() < GAME_CONFIG.CRIT_CHANCE;
  const dodgeChance = Math.random() < GAME_CONFIG.DODGE_CHANCE;

  if (dodgeChance) return { damage: 0, crit: false, dodged: true, emoji: "🛡️" };

  const attackStat = attacker.stats.find(s => s.name === 'attack')?.value || 50;
  const defenseStat = defender.stats.find(s => s.name === 'defense')?.value || 50;
  let critMultiplier = 1;
  let emoji = "💥";
  
  if (isEffective) {
    critMultiplier = GAME_CONFIG.EFFECTIVE_MULTIPLIER;
    emoji = "⚡️";
  }
  if (critChance) {
    critMultiplier = GAME_CONFIG.CRIT_MULTIPLIER;
    emoji = "⚡️";
  }
  
  const baseDamage = skill.power + attackStat - defenseStat;
  const damage = Math.max(1, Math.floor(baseDamage * critMultiplier));
  return { damage, crit: isEffective || critChance, dodged: false, emoji };
}
