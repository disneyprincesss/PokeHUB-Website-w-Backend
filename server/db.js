import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Database file will be created in the server directory
const databaseFilePath = path.join(__dirname, 'pokehub.sqlite');
const db = new Database(databaseFilePath);

// Initialize schema
db.pragma('journal_mode = WAL');
db.exec(`
  CREATE TABLE IF NOT EXISTS nicknames (
    pokemon_id INTEGER PRIMARY KEY,
    nickname TEXT NOT NULL
  );
`);
db.exec(`
  CREATE TABLE IF NOT EXISTS pokemon_info (
    pokemon_id INTEGER PRIMARY KEY,
    height REAL,
    weight REAL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

//Pokemon Nicknames
const getNicknameStmt = db.prepare(
  "SELECT nickname FROM nicknames WHERE pokemon_id = ?"
);
const setNicknameStmt = db.prepare(`
  INSERT INTO nicknames (pokemon_id, nickname)
  VALUES (?, ?)
  ON CONFLICT(pokemon_id) DO UPDATE SET nickname = excluded.nickname
`);
const deleteNicknameStmt = db.prepare(
  "DELETE FROM nicknames WHERE pokemon_id = ?"
);

export function getNickname(pokemonId) {
  const row = getNicknameStmt.get(pokemonId);
  return row ? row.nickname : null;
}

// export function getNicknamesForIds(pokemonIds) {
//   if (!Array.isArray(pokemonIds) || pokemonIds.length === 0) {
//     return new Map();
//   }
//   const placeholders = pokemonIds.map(() => "?").join(",");
//   const stmt = db.prepare(
//     `SELECT pokemon_id, nickname FROM nicknames WHERE pokemon_id IN (${placeholders})`
//   );
//   const rows = stmt.all(...pokemonIds);
//   const result = new Map();
//   for (const row of rows) {
//     result.set(row.pokemon_id, row.nickname);
//   }
//   return result;
// }

export function setNickname(pokemonId, nickname) {
  setNicknameStmt.run(pokemonId, nickname);
}

export function deleteNickname(pokemonId) {
  deleteNicknameStmt.run(pokemonId);
}

//Pokemon About
export function getAboutInfo(pokemonId) {
  const stmt = db.prepare('SELECT height, weight, description FROM pokemon_info WHERE pokemon_id = ?');
  const result = stmt.get(pokemonId);
  return result || null;
}

export function setAboutInfo(pokemonId, aboutData) {
  const { height, weight, description } = aboutData;
  const stmt = db.prepare(`
    INSERT INTO pokemon_info (pokemon_id, height, weight, description, updated_at)
    VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)
    ON CONFLICT(pokemon_id) DO UPDATE SET
      height = excluded.height,
      weight = excluded.weight,
      description = excluded.description,
      updated_at = CURRENT_TIMESTAMP
  `);
  return stmt.run(pokemonId, height, weight, description);
}

export function deleteAboutInfo(pokemonId) {
  const stmt = db.prepare('DELETE FROM pokemon_info WHERE pokemon_id = ?');
  return stmt.run(pokemonId);
}

export function getAboutInfoForIds(pokemonIds) {
  if (pokemonIds.length === 0) return new Map();
  
  const placeholders = pokemonIds.map(() => '?').join(',');
  const stmt = db.prepare(`
    SELECT pokemon_id, height, weight, description 
    FROM pokemon_info 
    WHERE pokemon_id IN (${placeholders})
  `);
  
  const results = stmt.all(...pokemonIds);
  const map = new Map();
  
  results.forEach(row => {
    map.set(row.pokemon_id, {
      height: row.height,
      weight: row.weight,
      description: row.description
    });
  });
  
  return map;
}

export default db;



