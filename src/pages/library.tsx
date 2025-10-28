import Navbar from "../components/navbar";
import { useEffect, useMemo, useState } from "react";
import PokemonCard from "../components/card";
import PokemonInfo from "../components/pokemon-info";
import { Search } from "lucide-react";
import type { EvolutionPokemon, PokemonDetails, PokemonListItem } from "@/types/pokemon";

interface PageData {
  right: PokemonListItem[];
  left: PokemonListItem[];
}

export default function LibraryPage() {
  const [pokemonList, setPokemonList] = useState<PokemonListItem[]>([]);
  const [filteredList, setFilteredList] = useState<PokemonListItem[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [selectedType, setSelectedType] = useState<string>("");
  // Cache of type -> set of names for fast filtering without 800 requests
  const [typeCache, setTypeCache] = useState<Record<string, Set<string>>>({});

  // All Pokemon types
  const pokemonTypes = [
    "normal",
    "fire",
    "water",
    "electric",
    "grass",
    "ice",
    "fighting",
    "poison",
    "ground",
    "flying",
    "psychic",
    "bug",
    "rock",
    "ghost",
    "dragon",
    "dark",
    "steel",
    "fairy",
  ];

  const [loading, setLoading] = useState<boolean>(false);
  // const [loadingTypeFilter, setLoadingTypeFilter] = useState<boolean>(false); 
  const [isCardOpen, setIsCardOpen] = useState<boolean>(false);
  const [selectedPokemon, setSelectedPokemon] = useState<PokemonDetails | null>(
    null
  );

  useEffect(() => {
    setLoading(true);
    fetch("https://pokeapi.co/api/v2/pokemon?limit=151")
      .then((res) => res.json())
      .then((data) => {
        setPokemonList(data.results);
        setFilteredList(data.results);
      })
      .finally(() => setLoading(false));
  }, []);

  // Debounce search input to avoid filtering on every key stroke
  useEffect(() => {
    const handle = setTimeout(() => setDebouncedSearch(searchTerm.trim().toLowerCase()), 200);
    return () => clearTimeout(handle);
  }, [searchTerm]);

  useEffect(() => {
    let base = pokemonList;

    if (debouncedSearch) {
      base = base.filter((p) => p.name.toLowerCase().includes(debouncedSearch));
    }

    // Handle type filtering via PokeAPI type endpoint, with caching
    if (selectedType) {
      const cached = typeCache[selectedType];
      if (cached) {
        const filtered = base.filter((p) => cached.has(p.name));
        setFilteredList(filtered);
        setCurrentPage(1);
      } else {
        fetch(`https://pokeapi.co/api/v2/type/${selectedType}`)
          .then((res) => res.json())
          .then((data) => {
            const names: Set<string> = new Set(
              (data.pokemon || []).map((x: any) => x.pokemon.name)
            );
            setTypeCache((prev) => ({ ...prev, [selectedType]: names }));
            const filtered = base.filter((p) => names.has(p.name));
            setFilteredList(filtered);
            setCurrentPage(1);
          })
          .catch(() => {
            // If type fetch fails, fallback to no type filter
            setFilteredList(base);
          });
      }
    } else {
      setFilteredList(base);
      setCurrentPage(1);
    }
  }, [debouncedSearch, selectedType, pokemonList, typeCache]);

  const fetchPokemonDetails = async (url: string) => {
    const res = await fetch(url);
    const data = await res.json();

    const speciesRes = await fetch(data.species.url);
    const speciesData = await speciesRes.json();
    const flavorText =
      speciesData.flavor_text_entries
        .find((e: any) => e.language.name === "en")
        ?.flavor_text?.replace(/\f|\n|\r/g, " ") || "No description available.";

    const image =
      data.sprites.other["official-artwork"].front_default || // clean official art
      data.sprites.other["dream_world"].front_default || // SVG fallback
      data.sprites.other["home"].front_default || // 3D model
      data.sprites.front_default;

    let evolutionChain: EvolutionPokemon[] = [];
    if (speciesData.evolution_chain?.url) {
      const evolutionRes = await fetch(speciesData.evolution_chain.url);
      const evolutionData = await evolutionRes.json();

      // Get all Pokemon names in the evolution chain
      function getEvolutionNames(chain: any, acc: string[]): string[] {
        acc.push(chain.species.name);
        if (chain.evolves_to && chain.evolves_to.length) {
          chain.evolves_to.forEach((c: any) => getEvolutionNames(c, acc));
        }
        return acc;
      }

      const evolutionNames = getEvolutionNames(evolutionData.chain, []);

      // Fetch detailed data for each Pokemon in the evolution chain
      const evolutionPromises = evolutionNames.map(async (name: string) => {
        try {
          const pokemonRes = await fetch(
            `https://pokeapi.co/api/v2/pokemon/${name}`
          );
          const pokemonData = await pokemonRes.json();

          const evolutionImage =
            pokemonData.sprites.other["official-artwork"].front_default ||
            pokemonData.sprites.other["dream_world"].front_default ||
            pokemonData.sprites.other["home"].front_default ||
            pokemonData.sprites.front_default;

          return {
            id: pokemonData.id,
            name: pokemonData.name,
            image: evolutionImage,
            types: pokemonData.types,
          };
        } catch (error) {
          console.error(`Failed to fetch evolution data for ${name}:`, error);
          return null;
        }
      });

      const evolutionResults = await Promise.all(evolutionPromises);
      evolutionChain = evolutionResults.filter(Boolean) as EvolutionPokemon[];
    }

    setSelectedPokemon({
      ...data,
      description: flavorText,
      image,
      evolutionChain,
    });
  };

  const [currentPage, setCurrentPage] = useState(1);

  // Build { right, left } pairs
  const pages: PageData[] = useMemo(() => {
    const spreads: PageData[] = [];

    // Each spread = 6 pokémon on the right, 6 pokémon on the left
    for (let i = 0; i < filteredList.length; i += 12) {
      spreads.push({
        left: filteredList.slice(i, i + 6),
        right: filteredList.slice(i + 6, i + 12),
      });
    }

    return spreads;
  }, [filteredList]);

  const totalPages = pages.length;

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  return (
    <>
      <main className="relative w-full h-screen">
        <Navbar />
        <div className="bg-[url('/image/library-bg.gif')] relative bg-cover bg-center min-h-screen flex flex-col gap-5 lg:gap-0 justify-center items-center overflow-y-auto pt-16 pb-5 sm:pt-20 px-4 sm:px-6 lg:px-8">
          <div className="w-full max-w-sm sm:max-w-lg text-center flex flex-col gap-4 sm:gap-6 justify-center items-center">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-revalia text-amber-600 text-shadow-[0_0_10px_rgba(225, 162, 55, 1)]">
              Pokémon Library
            </h1>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full items-stretch sm:items-center">
              {/* Search Bar */}
              <div className="relative w-full mx-auto bg-[#f1e2b2] rounded-lg">
                <input
                  type="text"
                  placeholder="Search Pokémon..."
                  className="w-full h-8 sm:h-8 p-2 sm:p-1.5 pr-12 sm:pr-10 rounded-lg text-black outline-3 outline-amber-700 font-jersey text-lg sm:text-xl lg:text-2xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="h-8 w-10 absolute top-0 right-0 bg-amber-700 text-white flex items-center justify-center rounded-r-lg hover:bg-[#914007] transition-colors">
                  <Search size={20} />
                </div>
              </div>

              {/* Type Filter Dropdown */}
              <div className="flex justify-center w-full sm:w-auto">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full sm:w-auto bg-[#f1e2b2] text-amber-800 font-jersey text-lg sm:text-xl px-4 py-2.5 sm:py-2 rounded-lg shadow-lg outline-none border-2 border-amber-700 hover:bg-amber-200 transition-colors cursor-pointer"
                >
                  <option value="">All Types</option>
                  {pokemonTypes.map((type) => (
                    <option key={type} value={type} className="capitalize">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {loading && (
              <p className="text-amber-200 font-jersey text-xl">
                Loading Pokémons…
              </p>
            )}
          </div>

          {/* Book - Desktop and Mobile Layouts */}
          <div
            className={`w-full flex justify-center items-center ${
              loading ? "opacity-0" : "opacity-100"
            } transition-opacity duration-500`}
          >
            {/* Prev Button */}
            <div className="mx-2 sm:mx-4">
              <button
                className="cursor-pointer bg-[#bb4d00] hover:bg-[#914007] disabled:bg-gray-600 disabled:cursor-not-allowed text-zinc-200 font-pixelify text-lg sm:text-xl py-2 px-3 sm:px-4 rounded-xl shadow-md transition-all duration-100"
                disabled={currentPage === 1}
                onClick={prevPage}
              >
                ◀
              </button>
            </div>

            {/* Desktop Book Layout - Hidden on mobile */}
            <div className="hidden lg:block bg-[url('/image/book.png')] bg-cover bg-center w-215 h-full">
              <div className="w-120 h-143 flex justify-center items-center relative translate-x-107">
                {(() => {
                  const startIndex = Math.max(0, currentPage - 3); // render a small window around current
                  const endIndex = Math.min(totalPages, currentPage + 2);
                  const windowPages = [] as Array<{ pageData: PageData; pageNumber: number }>;
                  for (let i = startIndex; i < endIndex; i++) {
                    windowPages.push({ pageData: pages[i], pageNumber: i + 1 });
                  }
                  return windowPages.map(({ pageData, pageNumber }) => {
                    const isFlipped = currentPage >= pageNumber;
                    let z;
                    if (pageNumber === currentPage) {
                      z = totalPages;
                    } else if (pageNumber < currentPage) {
                      z = pageNumber;
                    } else {
                      z = totalPages - (pageNumber - currentPage);
                    }
                    return (
                      <div
                        key={pageNumber}
                        className={`pages absolute left-0 top-0 w-full h-full transition-transform duration-700 ${
                          isFlipped ? "flip" : ""
                        }`}
                        style={{ zIndex: z }}
                      >
                        <div className="page-left w-100 h-full absolute left-0 top-0 text-zinc-900 bg-[#f9e5b7] border-l-7 border-[#e7d7a2] rounded-2xl">
                          <div
                            className={`left-content w-full h-full flex flex-wrap justify-center items-center ${
                              currentPage === pageNumber || totalPages < 13
                                ? "opacity-100 translate-x-0"
                                : "opacity-50 -translate-x-5"
                            } transition-all duration-500`}
                          >
                            {pageData.left.map((pokemon) => (
                              <button
                                key={pokemon.name}
                                onClick={() => {
                                  setIsCardOpen(true);
                                  fetchPokemonDetails(pokemon.url);
                                }}
                              >
                                <PokemonCard pokemon={pokemon} />
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="page-right w-100 h-full absolute left-0 top-0 text-zinc-900 bg-[#f9e5b7] rounded-2xl">
                          <div
                            className={` w-full h-full flex flex-wrap justify-center items-center ${
                              currentPage === pageNumber || totalPages < 13
                                ? "opacity-100 translate-x-0"
                                : "opacity-50 -translate-x-5"
                            } transition-all duration-500`}
                          >
                            {pageData.right.map((pokemon) => (
                              <button
                                key={pokemon.name}
                                onClick={() => {
                                  setIsCardOpen(true);
                                  fetchPokemonDetails(pokemon.url);
                                }}
                              >
                                <PokemonCard pokemon={pokemon} />
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Mobile/Tablet Grid Layout */}
            <div className="lg:hidden bg-[#f9e5b7] rounded-2xl shadow-xl p-2 w-full justify-center">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 place-items-center">
                {pages[currentPage - 1]?.left
                  .concat(pages[currentPage - 1]?.right || [])
                  .map((pokemon) => (
                    <button
                      key={pokemon.name}
                      onClick={() => {
                        setIsCardOpen(true);
                        fetchPokemonDetails(pokemon.url);
                      }}
                    >
                      <PokemonCard pokemon={pokemon} />
                    </button>
                  ))}
              </div>

              {/* Page indicator */}
              <div className="text-center text-amber-800 font-jersey text-lg">
                {totalPages > 0 ? (
                  <span>
                    Page {currentPage} of {totalPages}
                  </span>
                ) : (
                  <span>No Results</span>
                )}
              </div>
            </div>

            {/* Next Button */}
            <div className="mx-2 sm:mx-4">
              <button
                className="cursor-pointer bg-[#bb4d00] hover:bg-[#914007] disabled:bg-gray-600 disabled:cursor-not-allowed text-zinc-200 font-pixelify text-lg sm:text-xl py-2 px-3 sm:px-4 rounded-xl shadow-md transition-all duration-100"
                disabled={currentPage === totalPages}
                onClick={nextPage}
              >
                ▶
              </button>
            </div>
          </div>

          {/* Pokémon Info Overlay */}
          <div
            className={`bg-zinc-900/50 w-full h-full absolute top-0 z-10 ${
              isCardOpen ? "block" : "hidden"
            }`}
          >
            {selectedPokemon && (
              <PokemonInfo
                pokemon={selectedPokemon}
                setIsCardOpen={setIsCardOpen}
                setSelectedPokemon={setSelectedPokemon}
              />
            )}
          </div>
        </div>
      </main>
    </>
  );
}
