import { useState, useEffect } from 'react';
import { fetchPokemonById, getRandomId, calculateDamage } from '../utils/pokemonUtils';
import { GAME_CONFIG, TAUNTS } from '../constants/gameConstants';
import type { Pokemon, Skill } from '@/types/pokemon';

// Accept playerPokemon as an optional argument
export const usePokemonBattle = (playerPokemon?: Pokemon) => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [currentHp, setCurrentHp] = useState<number[]>([0, 0]);
  const [maxHp, setMaxHp] = useState<number[]>([100, 100]);
  const [currentMana, setCurrentMana] = useState<number[]>([GAME_CONFIG.INITIAL_MANA, GAME_CONFIG.INITIAL_MANA]);
  const [battleLog, setBattleLog] = useState<string[]>([]);
  const [winner, setWinner] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [turn, setTurn] = useState<0 | 1>(0);
  const [flash, setFlash] = useState<[boolean, boolean]>([false, false]);
  const [showConfetti, setShowConfetti] = useState(false);

  const initializeBattle = async () => {
    setLoading(true);
    try {
      let pokes: Pokemon[];

      if (playerPokemon) {
        // Use the selected Pokémon + a random opponent
        const opponent = await fetchPokemonById(getRandomId());
        pokes = [playerPokemon, opponent];
      } else {
        // Fallback: both random
        pokes = await Promise.all([
          fetchPokemonById(getRandomId()), 
          fetchPokemonById(getRandomId())
        ]);
      }

      setPokemons(pokes);

      // Adjust to your stats structure
      const hp1 = pokes[0].stats.find(s => s.name === 'hp')?.value || 100;
      const hp2 = pokes[1].stats.find(s => s.name === 'hp')?.value || 100;
      setCurrentHp([hp1, hp2]);
      setMaxHp([hp1, hp2]);
      setCurrentMana([GAME_CONFIG.INITIAL_MANA, GAME_CONFIG.INITIAL_MANA]);
      setWinner(null);
      setBattleLog([]);
      setTurn(0);
      setShowConfetti(false);
    } finally {
      setLoading(false);
    }
  };

  // Re-run battle init when playerPokemon changes
  useEffect(() => {
    initializeBattle();
  }, [playerPokemon]);

  // --- AI Turn Logic and battle handlers remain the same ---
  // (no changes below this line except using the updated state)

  useEffect(() => {
    if (
      pokemons.length === 2 &&
      turn === 1 &&
      !winner &&
      currentHp[0] > 0 &&
      currentHp[1] > 0
    ) {
      const availableSkills = pokemons[1].skills.filter(
        skill => currentMana[1] >= skill.manaCost
      );
      
      if (availableSkills.length === 0) {
        setTimeout(() => {
          setCurrentMana(mana => [
            mana[0], 
            Math.min(GAME_CONFIG.INITIAL_MANA, mana[1] + GAME_CONFIG.SKIP_MANA_GAIN)
          ]);
          setBattleLog(log => [
            `💤 ${pokemons[1].name} Skips turn and regains ${GAME_CONFIG.SKIP_MANA_GAIN} mana.`,
            ...log,
          ]);
          setTurn(0);
        }, 1200);
        return;
      }
      
      const skill = availableSkills[Math.floor(Math.random() * availableSkills.length)];
      const taunt = TAUNTS[Math.floor(Math.random() * TAUNTS.length)];
      
      setTimeout(() => {
        const result = calculateDamage(pokemons[1], pokemons[0], skill);
        
        if (result.dodged) {
          setBattleLog(log => [
            `🛡️ ${pokemons[1].name}'s attack was dodged! "${taunt}"`,
            ...log,
          ]);
        } else {
          setFlash([true, false]);
          setCurrentHp(hp => {
            const newHp = [Math.max(0, hp[0] - result.damage), hp[1]];
            if (newHp[0] === 0) {
              setWinner(pokemons[1].name);
              setBattleLog(log => [`🎉 ${pokemons[1].name} wins!`, ...log]);
              setShowConfetti(true);
            }
            return newHp;
          });
          setBattleLog(log => [
            `${result.emoji} ${pokemons[1].name} used ${skill.name}. Damage: ${result.damage}${result.crit ? ' (Critical!)' : ''} "${taunt}"`,
            ...log,
          ]);
          setCurrentMana(mana => [mana[0], mana[1] - skill.manaCost]);
        }
        
        setTimeout(() => setFlash([false, false]), 400);
        setTurn(0);
      }, 1200);
    }
  }, [turn, pokemons, winner, currentHp, currentMana]);

  const handleSkillSelect = (skill: Skill) => {
    if (winner || turn !== 0 || currentMana[0] < skill.manaCost) return;
    
    const result = calculateDamage(pokemons[0], pokemons[1], skill);
    
    if (result.dodged) {
      setBattleLog(log => ['🛡️ Attack dodged!', ...log]);
      setTurn(1);
      return;
    }
    
    setFlash([false, true]);
    setCurrentHp(hp => {
      const newHp = [hp[0], Math.max(0, hp[1] - result.damage)];
      if (newHp[1] === 0) {
        setWinner(pokemons[0].name);
        setBattleLog(log => [`🎉 ${pokemons[0].name} wins!`, ...log]);
        setShowConfetti(true);
      }
      return newHp;
    });
    
    setBattleLog(log => [
      `${result.emoji} You used ${skill.name}. Damage: ${result.damage}${result.crit ? ' (Critical!)' : ''}`,
      ...log,
    ]);
    
    setCurrentMana(mana => [mana[0] - skill.manaCost, mana[1]]);
    setTimeout(() => setFlash([false, false]), 400);
    
    if (currentHp[1] - result.damage <= 0) return;
    setTurn(1);
  };

  const handleSkipTurn = () => {
    if (winner || turn !== 0) return;
    
    setCurrentMana(mana => [
      Math.min(GAME_CONFIG.INITIAL_MANA, mana[0] + GAME_CONFIG.SKIP_MANA_GAIN), 
      mana[1]
    ]);
    setBattleLog(log => [
      `💤 You skipped turn and regained ${GAME_CONFIG.SKIP_MANA_GAIN} mana.`, 
      ...log
    ]);
    setTurn(1);
  };

  const handleRestart = () => {
    initializeBattle();
  };

  return {
    pokemons,
    currentHp,
    maxHp,
    currentMana,
    battleLog,
    winner,
    loading,
    turn,
    flash,
    showConfetti,
    handleSkillSelect,
    handleSkipTurn,
    handleRestart,
  };
};
