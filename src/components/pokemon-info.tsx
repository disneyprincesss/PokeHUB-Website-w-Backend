import { Pencil, Plus, SquareX } from "lucide-react";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import { Progress } from "./ui/progress";
import { ScrollArea } from "./ui/scroll-area";
import type { PokemonDetails } from "@/types/pokemon";
import { apiService, type AboutInfo } from "../services/api";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface PokemonInfoProps {
  pokemon: PokemonDetails | null;
  setIsCardOpen: (open: boolean) => void;
  setSelectedPokemon: (pokemon: PokemonDetails | null) => void;
}

export default function PokemonInfo({
  pokemon,
  setIsCardOpen,
  setSelectedPokemon,
}: PokemonInfoProps) {
  const selectedPokemonType = pokemon?.types[0].type.name || "";
  const id = pokemon?.id;
  const location = useLocation();

  //nickname
  const [nickname, setNickname] = useState<string | null>(null);
  const [editingNickname, setEditingNickname] = useState(false);
  const [inputNickname, setInputNickname] = useState("");
  const [loadingNickname, setLoadingNickname] = useState(false);
  const [errorNickname, setErrorNickname] = useState<string | null>(null);

  //about
  const [aboutInfo, setAboutInfo] = useState<AboutInfo | null>(null);
  const [editingAbout, setEditingAbout] = useState(false);
  const [aboutInput, setAboutInput] = useState<AboutInfo>({
    height: null,
    weight: null,
    description: "",
  });
  const [aboutLoading, setAboutLoading] = useState(false);
  const [aboutError, setAboutError] = useState<string | null>(null);
  const isEditMode = location.pathname.endsWith("/edit");

  useEffect(() => {
    if (!id) return;
    let mounted = true;

    const loadData = async () => {
      try {
        // Load both nickname and about info simultaneously
        const [aboutResponse, nicknameResponse] = await Promise.all([
          apiService.getAboutInfo(id),
          apiService.getNickname(id),
        ]);

        if (mounted) {
          setAboutInfo(aboutResponse.data.aboutInfo);
          setNickname(nicknameResponse.data.nickname);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
        // Gracefully handle - don't show error to user
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [id]);

  const handleEditNickname = () => {
    setInputNickname(nickname || "");
    setEditingNickname(true);
    setErrorNickname(null);
  };

  const saveNickname = async () => {
    if (!id) return;

    try {
      setLoadingNickname(true);
      setErrorNickname(null);

      const trimmed = inputNickname.trim();

      if (trimmed.length === 0) {
        await apiService.deleteNickname(id);
        setNickname(null);
      } else {
        const res = await apiService.setNickname(id, trimmed);
        setNickname(res.data.nickname);
      }

      setEditingNickname(false);
    } catch (e: any) {
      setErrorNickname(e?.message || "Failed to save nickname");
    } finally {
      setLoadingNickname(false);
    }
  };

  const handleEditAbout = () => {
    setAboutInput({
      height: aboutInfo?.height || null,
      weight: aboutInfo?.weight || null,
      description: aboutInfo?.description || "",
    });
    setEditingAbout(true);
    setAboutError(null);
  };

  const handleSaveAbout = async () => {
    setAboutLoading(true);
    setAboutError(null);

    try {
      if (!id) {
        setAboutError("No Pokémon selected.");
        return;
      }

      const submissionData = {
        height: aboutInput.height,
        weight: aboutInput.weight,
        description: aboutInput.description
          ? aboutInput.description.trim()
          : null,
      };

      // Debug logging
      console.log("Submission data:", submissionData);
      console.log("Data types:", {
        height: typeof submissionData.height,
        weight: typeof submissionData.weight,
        description: typeof submissionData.description,
      });

      const isEmpty =
        submissionData.height === null &&
        submissionData.weight === null &&
        !submissionData.description;

      if (isEmpty) {
        await apiService.deleteAboutInfo(id);
        setAboutInfo(null);
      } else {
        const response = await apiService.setAboutInfo(id, submissionData);
        setAboutInfo(response.data.aboutInfo);
      }

      setEditingAbout(false);
    } catch (error) {
      console.error("Failed to save about info:", error);
      setAboutError("Failed to save about information. Please try again.");
    } finally {
      setAboutLoading(false);
    }
  };

  const handleHeightChange = (value: string) => {
    if (value === "") {
      setAboutInput((prev) => ({ ...prev, height: null }));
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue >= 0) {
        // Round to 2 decimal places and convert back to number
        const roundedValue = Math.round(numValue * 100) / 100;
        setAboutInput((prev) => ({ ...prev, height: roundedValue }));
      }
    }
  };

  const handleWeightChange = (value: string) => {
    if (value === "") {
      setAboutInput((prev) => ({ ...prev, weight: null }));
    } else {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) && numValue >= 0) {
        // Round to 2 decimal places and convert back to number
        const roundedValue = Math.round(numValue * 100) / 100;
        setAboutInput((prev) => ({ ...prev, weight: roundedValue }));
      }
    }
  };

  const handleAboutInputChange = (field: keyof AboutInfo, value: string) => {
    setAboutInput((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card
      className={`bg-gradient-to-r ${
        selectedPokemonType == "grass"
          ? "from-[#009E51] to-[#88F6B0]"
          : selectedPokemonType == "fire"
          ? "from-[#CF5300] to-[#FFA46F]"
          : selectedPokemonType == "water"
          ? "from-[#0267DB] to-[#88B6F6]"
          : selectedPokemonType == "bug"
          ? "from-[#939E00] to-[#D3F688]"
          : selectedPokemonType == "electric"
          ? "from-[#DBB702] to-[#F6DC88]"
          : selectedPokemonType == "ice"
          ? "from-[#007D9E] to-[#88DFF6]"
          : selectedPokemonType == "poison"
          ? "from-[#6E009E] to-[#D588F6]"
          : selectedPokemonType == "fighting"
          ? "from-[#9E0003] to-[#F6888A]"
          : selectedPokemonType == "ground"
          ? "from-[#8E2C02] to-[#DB812D]"
          : selectedPokemonType == "psychic"
          ? "from-[#9E0064] to-[#F688E2]"
          : selectedPokemonType == "flying"
          ? "from-[#0D009E] to-[#8A88F6]"
          : selectedPokemonType == "ghost"
          ? "from-[#450167] to-[#A769FF]"
          : selectedPokemonType == "rock"
          ? "from-[#9E6600] to-[#F6C588]"
          : selectedPokemonType == "dragon"
          ? "from-[#022D69] to-[#7091FF]"
          : selectedPokemonType == "dark"
          ? "from-[#010101] to-[#4A4251]"
          : selectedPokemonType == "steel"
          ? "from-[#313030] to-[#B2B2B2]"
          : selectedPokemonType == "fairy"
          ? "from-[#9E004C] to-[#F688B6]"
          : selectedPokemonType == "normal"
          ? "from-[#A8A878] to-[#E0E0B0]"
          : ""
      } w-[95vw] max-w-6xl max-h-[90vh] sm:max-h-screen lg:max-h-[90vh] absolute inset-0 my-auto mx-auto flex flex-col lg:flex-row overflow-hidden rounded-2xl`}
    >
      <div className="relative w-full">
        {selectedPokemonType != "normal" && (
          <img
            src={`/image/card-bg/${selectedPokemonType}-bg.png`}
            alt={`${selectedPokemonType} type`}
            className={`opacity-50 absolute h-50 left-0 right-20 mx-auto lg:right-0 lg:mx-0 sm:h-55 ${
              selectedPokemonType == "grass"
                ? "lg:bottom-15 lg:-left-10 lg:h-135"
                : selectedPokemonType == "fire"
                ? "lg:bottom-0 lg:-left-15 lg:h-160"
                : selectedPokemonType == "water"
                ? "lg:bottom-10 lg:-left-5 lg:h-130"
                : selectedPokemonType == "bug"
                ? "lg:bottom-15 lg:-left-3 lg:h-130"
                : selectedPokemonType == "electric"
                ? "lg:bottom-25 lg:left-0 lg:h-140"
                : selectedPokemonType == "ground"
                ? "lg:top-20 lg:left-0 lg:w-250 h-auto"
                : selectedPokemonType == "poison"
                ? "lg:top-0 lg:-left-5 lg:h-110"
                : selectedPokemonType == "fighting"
                ? "lg:top-0 lg:left-0 lg:h-110"
                : selectedPokemonType == "psychic"
                ? "lg:top-0 lg:-left-5 lg:h-115"
                : selectedPokemonType == "rock"
                ? "lg:top-10 lg:left-0 lg:h-120"
                : selectedPokemonType == "ghost"
                ? "lg:bottom-0 lg:-left-10 lg:h-160"
                : selectedPokemonType == "ice"
                ? "lg:top-10 lg:left-0 lg:h-110"
                : selectedPokemonType == "dragon"
                ? "lg:top-0 lg:left-0 lg:h-130"
                : selectedPokemonType == "flying"
                ? "lg:top-5 lg:left-0 lg:h-120"
                : selectedPokemonType == "dark"
                ? "lg:top-0 lg:-left-5 lg:h-120"
                : selectedPokemonType == "steel"
                ? "-lg:top-5 lg:left-0 lg:h-120"
                : selectedPokemonType == "fairy"
                ? "lg:top-15 lg:left-0 lg:h-100"
                : ""
            }`}
          />
        )}
        <img
          src={`${pokemon?.image ? pokemon.image : ""}`}
          alt={pokemon?.name}
          className={`z-10 mx-auto absolute right-0 h-40 sm:h-45 lg:h-100 ${
            selectedPokemonType == "normal"
              ? "lg:inset-0 lg:my-auto inset-x-0 h-45 sm:h-55"
              : "left-10 sm:left-25 top-12 lg:top-55 lg:left-40"
          } `}
        />
      </div>
      <div
        className={`w-full pb-5 lg:pb-0 flex flex-col justify-center items-center lg:items-start lg:justify-start px-0 absolute bottom-0 lg:static ${
          selectedPokemonType == "dark" ||
          selectedPokemonType == "ghost" ||
          selectedPokemonType == "steel"
            ? "text-zinc-200"
            : "text-zinc-800"
        } `}
      >
        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-jersey font-bold uppercase tracking-wider text-shadow-[5px_5px_6px_rgba(0,0,0,0.5)] sm:text-shadow-[8px_8px_10px_rgba(0,0,0,0.5)] text-center lg:text-left z-10">
          {pokemon?.name}
        </h1>

        {editingNickname ? (
          <div className="flex items-center gap-4 w-full max-w-md">
            <input
              value={inputNickname}
              onChange={(e) => setInputNickname(e.target.value)}
              maxLength={40}
              placeholder="Enter nickname (empty to clear)"
              className={`w-3/4 font-robotoslab px-3 py-2 rounded-lg border-2 focus:outline-none focus:ring-2 ${
                selectedPokemonType == "dark" ||
                selectedPokemonType == "ghost" ||
                selectedPokemonType == "steel"
                  ? "bg-zinc-800 border-zinc-600 text-zinc-200 focus:ring-zinc-400"
                  : "bg-white border-zinc-300 text-zinc-800 focus:ring-blue-500"
              }`}
              disabled={loadingNickname}
            />
            <div className="flex gap-2 font-robotoslab">
              <button
                onClick={saveNickname}
                disabled={loadingNickname}
                className="px-3 py-1.5 text-sm bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 transition-colors"
              >
                {loadingNickname ? "Saving..." : "Save"}
              </button>
              <button
                onClick={() => setEditingNickname(false)}
                disabled={loadingNickname}
                className="px-3 py-1.5 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
            </div>
            {errorNickname && (
              <span className="text-sm text-red-500 font-medium">
                {errorNickname}
              </span>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-1 font-robotoslab lg:flex-row lg:gap-3">
            {nickname && (
              <div
                className={`text-xl font-medium${
                  selectedPokemonType == "dark" ||
                  selectedPokemonType == "ghost" ||
                  selectedPokemonType == "steel"
                    ? "text-zinc-200"
                    : "text-zinc-800"
                }`}
              >
                "{nickname}"
              </div>
            )}
            {isEditMode && (
              <button
                onClick={handleEditNickname}
                className={`cursor-pointer px-2 py-0.5 text-md rounded bg-[#0E9000] text-zinc-100 hover:bg-[#4cab39]`}
              >
                {nickname ? (
                  <Pencil className="inline-block w-5 h-5 mr-2" />
                ) : (
                  <Plus className="inline-block w-5 h-5 mr-1" />
                )}
                {nickname ? "Edit Nickname" : "Add Nickname"}
              </button>
            )}
          </div>
        )}

        <Tabs defaultValue="about">
          <TabsList>
            <TabsTrigger
              value="about"
              className={`${
                selectedPokemonType == "dark" ||
                selectedPokemonType == "ghost" ||
                selectedPokemonType == "steel"
                  ? "text-zinc-200 border-b-zinc-200"
                  : ""
              }`}
            >
              About
            </TabsTrigger>
            <TabsTrigger
              value="stats"
              className={`${
                selectedPokemonType == "dark" ||
                selectedPokemonType == "ghost" ||
                selectedPokemonType == "steel"
                  ? "text-zinc-200 border-b-zinc-200"
                  : ""
              }`}
            >
              Base Stats
            </TabsTrigger>
            <TabsTrigger
              value="evolution"
              className={`${
                selectedPokemonType == "dark" ||
                selectedPokemonType == "ghost" ||
                selectedPokemonType == "steel"
                  ? "text-zinc-200 border-b-zinc-200"
                  : ""
              }`}
            >
              Evolution
            </TabsTrigger>
          </TabsList>
          <TabsContent value="about">
            <ScrollArea
              className={`${
                isEditMode
                  ? "h-70 sm:h-80 lg:h-105"
                  : nickname
                  ? "h-69 sm:h-78 lg:h-100"
                  : "h-80 sm:h-84 lg:h-110"
              } w-full`}
            >
              <div className="flex flex-col gap-2">
                <div className="flex">
                  <h3>Species:</h3>
                  <div className="ml-2 flex items-center">
                    {pokemon?.types.map((t, index) => (
                      <Tooltip key={index}>
                        <TooltipTrigger>
                          <img
                            key={t.slot}
                            src={`/image/pokemon-type/${t.type.name}.png`}
                            alt={`${t.type.name} type`}
                            className="h-9 sm:h-10 mr-1"
                          />
                        </TooltipTrigger>
                        <TooltipContent>{t.type.name}</TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>
                <div className="flex items-center flex-wrap">
                  <h3>Abilities:</h3>
                  <div className="ml-2 flex flex-wrap items-center">
                    {pokemon?.abilities.map((a, index) => {
                      let abilityName = a.ability.name
                        .split(" ")
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(" ");

                      let abilityColor = "";

                      if (selectedPokemonType == "grass") {
                        abilityColor = a.is_hidden
                          ? "bg-[#4B9A47]"
                          : "bg-[#65C85F]";
                      } else if (selectedPokemonType == "water") {
                        abilityColor = a.is_hidden
                          ? "bg-[#2671A1]"
                          : "bg-[#248BCD]";
                      } else if (selectedPokemonType == "fire") {
                        abilityColor = a.is_hidden
                          ? "bg-[#E66007]"
                          : "bg-[#FF823A]";
                      } else if (selectedPokemonType == "bug") {
                        abilityColor = a.is_hidden
                          ? "bg-[#8DA126]"
                          : "bg-[#B2C12C]";
                      } else if (selectedPokemonType == "electric") {
                        abilityColor = a.is_hidden
                          ? "bg-[#D4BD10]"
                          : "bg-[#F0CE24]";
                      } else if (selectedPokemonType == "ice") {
                        abilityColor = a.is_hidden
                          ? "bg-[#358AC1]"
                          : "bg-[#68B4E5]";
                      } else if (selectedPokemonType == "poison") {
                        abilityColor = a.is_hidden
                          ? "bg-[#7244DF]"
                          : "bg-[#A467EF]";
                      } else if (selectedPokemonType == "fighting") {
                        abilityColor = a.is_hidden
                          ? "bg-[#A12626]"
                          : "bg-[#CD2424]";
                      } else if (selectedPokemonType == "ground") {
                        abilityColor = a.is_hidden
                          ? "bg-[#BA7E3A]"
                          : "bg-[#D9985A]";
                      } else if (selectedPokemonType == "psychic") {
                        abilityColor = a.is_hidden
                          ? "bg-[#9326A1]"
                          : "bg-[#CD24CD]";
                      } else if (selectedPokemonType == "flying") {
                        abilityColor = a.is_hidden
                          ? "bg-[#2649A1]"
                          : "bg-[#2A67D7]";
                      } else if (selectedPokemonType == "rock") {
                        abilityColor = a.is_hidden
                          ? "bg-[#AA975F]"
                          : "bg-[#CDAE56]";
                      } else if (selectedPokemonType == "ghost") {
                        abilityColor = a.is_hidden
                          ? "bg-[#3126A1]"
                          : "bg-[#6A24CD]";
                      } else if (selectedPokemonType == "dragon") {
                        abilityColor = a.is_hidden
                          ? "bg-[#002AB4]"
                          : "bg-[#244ECD]";
                      } else if (selectedPokemonType == "dark") {
                        abilityColor = a.is_hidden
                          ? "bg-[#46494B]"
                          : "bg-[#7E7E7E]";
                      } else if (selectedPokemonType == "steel") {
                        abilityColor = a.is_hidden
                          ? "bg-[#6D7579]"
                          : "bg-[#9A9A9A]";
                      } else if (selectedPokemonType == "fairy") {
                        abilityColor = a.is_hidden
                          ? "bg-[#BE2D9A]"
                          : "bg-[#EC61C2]";
                      } else {
                        abilityColor = a.is_hidden
                          ? "bg-[#7E7E62]"
                          : "bg-[#A5A580]";
                      }

                      return (
                        <Tooltip key={index}>
                          <TooltipTrigger>
                            <span
                              className={` text-xl sm:text-2xl px-2 py-1 mr-2 rounded-lg shadow-md text-white ${abilityColor}`}
                            >
                              {abilityName}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            {a.is_hidden ? "Hidden Ability" : "Normal Ability"}
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                </div>
                <div>
                  {editingAbout ? (
                    <div className="space-y-1">
                      {/* Edit form */}
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col w-fit">
                          <div className="flex gap-2 items-center">
                            <h3>Height:</h3>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              max="1000"
                              value={aboutInput.height ?? ""}
                              onChange={(e) =>
                                handleHeightChange(e.target.value)
                              }
                              placeholder={
                                pokemon?.height
                                  ? `${(pokemon.height / 10).toFixed(2)}`
                                  : "0.00"
                              }
                              className={`w-50 h-10 px-2 border rounded-md text-lg focus:outline-none focus:ring-2 ${
                                selectedPokemonType == "dark" ||
                                selectedPokemonType == "ghost" ||
                                selectedPokemonType == "steel"
                                  ? "bg-zinc-800 border-zinc-600 text-zinc-200 focus:ring-zinc-400"
                                  : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
                              }`}
                            />
                            <span className="text-sm">meters</span>
                          </div>
                        </div>

                        <div className="flex flex-col w-fit">
                          <div className="flex gap-2 items-center">
                            <h3>Weight:</h3>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              max="10000"
                              value={aboutInput.weight ?? ""}
                              onChange={(e) =>
                                handleWeightChange(e.target.value)
                              }
                              placeholder={
                                pokemon?.weight
                                  ? `${(pokemon.weight / 10).toFixed(2)}`
                                  : "0.00"
                              }
                              className={`w-50 h-10 px-2 border rounded-md text-lg focus:outline-none focus:ring-2 ${
                                selectedPokemonType == "dark" ||
                                selectedPokemonType == "ghost" ||
                                selectedPokemonType == "steel"
                                  ? "bg-zinc-800 border-zinc-600 text-zinc-200 focus:ring-zinc-400"
                                  : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
                              }`}
                            />
                            <span className="text-sm">kg</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3>Description</h3>
                        <textarea
                          value={aboutInput.description ?? ""}
                          onChange={(e) =>
                            handleAboutInputChange(
                              "description",
                              e.target.value
                            )
                          }
                          placeholder={pokemon?.description}
                          className={`w-100 lg:w-lg p-2 ml-1 border rounded-md text-lg focus:outline-none focus:ring-2 resize-none ${
                            selectedPokemonType == "dark" ||
                            selectedPokemonType == "ghost" ||
                            selectedPokemonType == "steel"
                              ? "bg-zinc-800 border-zinc-600 text-zinc-200 focus:ring-zinc-400"
                              : "bg-white border-gray-300 text-gray-900 focus:ring-blue-500"
                          }`}
                          rows={4}
                          maxLength={500}
                        />
                        <p
                          className={`text-xs my-1 ml-1 ${
                            selectedPokemonType == "dark" ||
                            selectedPokemonType == "ghost" ||
                            selectedPokemonType == "steel"
                              ? "text-zinc-400"
                              : "text-gray-800"
                          }`}
                        >
                          {(aboutInput.description ?? "").length}/500 characters
                        </p>
                      </div>

                      {aboutError && (
                        <p className="text-red-600 text-sm">{aboutError}</p>
                      )}

                      <div className="flex gap-2">
                        <button
                          onClick={handleSaveAbout}
                          disabled={aboutLoading}
                          className="px-3 py-1.5 text-sm bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 transition-colors"
                        >
                          {aboutLoading ? "Saving..." : "Save"}
                        </button>
                        <button
                          onClick={() => setEditingAbout(false)}
                          disabled={aboutLoading}
                          className="px-3 py-1.5 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>

                      <p
                        className={`text-xs ${
                          selectedPokemonType == "dark" ||
                          selectedPokemonType == "ghost" ||
                          selectedPokemonType == "steel"
                            ? "text-zinc-400"
                            : "text-gray-800"
                        }`}
                      >
                        Leave all fields empty to remove customized information
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {/* Display current about info */}
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center">
                          <h3>Height:</h3>
                          <span className="text-2xl ml-4">
                            {aboutInfo?.height !== null &&
                            aboutInfo?.height !== undefined
                              ? `${aboutInfo.height} m` // Fix: Add units to custom height
                              : pokemon?.height
                              ? `${(pokemon.height / 10).toFixed(2)} m`
                              : "Unknown"}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <h3>Weight:</h3>
                          <span className="text-2xl ml-4">
                            {aboutInfo?.weight !== null &&
                            aboutInfo?.weight !== undefined
                              ? `${aboutInfo.weight} kg` // Fix: Add units to custom weight
                              : pokemon?.weight
                              ? `${(pokemon.weight / 10).toFixed(2)} kg`
                              : "Unknown"}
                          </span>
                        </div>
                      </div>

                      {(aboutInfo?.description || pokemon?.description) && (
                        <div>
                          <h3>Description: </h3>
                          <p className="text-xl mt-1 pr-2">
                            {aboutInfo?.description || pokemon?.description}
                          </p>
                        </div>
                      )}

                      {isEditMode && (
                        <button
                          onClick={handleEditAbout}
                          className="flex items-center cursor-pointer px-2 py-0.5 text-md rounded bg-[#31971C] text-zinc-100 hover:bg-[#4cab39]"
                        >
                          <Pencil className="w-4 h-4 mr-2" />
                          Customize Info
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent
            value="stats"
            className="justify-center items-center px-3"
          >
            <div className="stats">
              <h3>Stats</h3>
              <ScrollArea
                className={`${
                  isEditMode
                    ? "h-58 sm:h-68 lg:h-98"
                    : nickname
                    ? "h-57 sm:h-66"
                    : "h-68 sm:h-72 lg:h-98"
                } w-full`}
              >
                <ul className="flex flex-col gap-4 w-100 h-62 sm:h-68 text-xl sm:text-2xl sm:w-125 mt-3">
                  {pokemon?.stats.map((s) => {
                    let statName = s.stat.name
                      .split("-")
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join("-");

                    return (
                      <li
                        key={s.stat.name}
                        className="w-full flex items-center gap-4 "
                      >
                        <span className="w-2/3">{statName}</span>
                        <div className="w-full flex items-center justify-between">
                          <Progress value={s.base_stat} className="w-5/6" />
                          <span>{s.base_stat}</span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </ScrollArea>
            </div>
          </TabsContent>
          <TabsContent value="evolution" className="px-3 max-h-[45vh]">
            <div>
              <h3>Evolution Chain</h3>
              <ScrollArea
                className={`${
                  isEditMode
                    ? "h-58 sm:h-68 lg:h-98"
                    : nickname
                    ? "h-57 sm:h-66"
                    : "h-68 sm:h-72 lg:h-100"
                } w-full`}
              >
                <div className="flex items-center gap-2 flex-wrap">
                  {pokemon?.evolutionChain &&
                  pokemon.evolutionChain.length > 1 ? (
                    pokemon.evolutionChain.map((evolution, index) => (
                      <div key={evolution.id} className="flex items-center">
                        <div className="bg-white/20 rounded-lg p-2 flex flex-col items-center w-30 sm:min-w-35 sm:h-52">
                          <img
                            key={index}
                            src={evolution.image}
                            alt={evolution.name}
                            className="w-24 h-24 sm:w-28 sm:h-28 object-contain"
                          />
                          <span className="text-sm sm:text-lg capitalize font-semibold mt-2 ">
                            {evolution.name}
                          </span>
                          <div className="flex gap-1 mt-2">
                            {evolution.types.map((type) => (
                              <img
                                key={type.slot}
                                src={`/image/pokemon-type/${type.type.name}.png`}
                                alt={type.type.name}
                                className="w-6 h-6 sm:w-7 sm:h-7"
                              />
                            ))}
                          </div>
                        </div>
                        {index < (pokemon.evolutionChain?.length || 0) - 1 && (
                          <span className="mx-2 text-lg sm:text-xl">→</span>
                        )}
                      </div>
                    ))
                  ) : (
                    <p className="text-base sm:text-lg">
                      This Pokémon does not evolve.
                    </p>
                  )}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <button
        onClick={() => {
          setIsCardOpen(false);
          setSelectedPokemon(null);
        }}
        className="absolute top-3 right-3 lg:top-5 lg:right-5 cursor-pointer z-20"
      >
        <SquareX className="w-8 h-8 lg:w-10 lg:h-10 text-zinc-900 hover:text-red-400" />
      </button>
    </Card>
  );
}
