// API service for communicating with Express backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface Pokemon {
  id: number;
  name: string;
  type: string[];
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  image: string;
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

export interface PokemonResponse {
  data: Pokemon[];
  total: number;
  limit: number;
  offset: number;
}

export interface SinglePokemonResponse {
  data: Pokemon;
}

class ApiService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Handle no-content responses
      if (response.status === 204) {
        return undefined as unknown as T;
      }
      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Pokemon API methods
  async getPokemon(params?: {
    type?: string;
    limit?: number;
    offset?: number;
  }): Promise<PokemonResponse> {
    const searchParams = new URLSearchParams();

    if (params?.type) searchParams.append("type", params.type);
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.offset) searchParams.append("offset", params.offset.toString());

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/pokemon?${queryString}` : "/pokemon";

    return this.request<PokemonResponse>(endpoint);
  }

  async getPokemonById(id: number): Promise<SinglePokemonResponse> {
    return this.request<SinglePokemonResponse>(`/pokemon/${id}`);
  }

  async searchPokemon(name: string): Promise<{ data: Pokemon[] }> {
    return this.request<{ data: Pokemon[] }>(
      `/pokemon/search/${encodeURIComponent(name)}`
    );
  }

  async createPokemon(
    pokemon: Omit<Pokemon, "id">
  ): Promise<SinglePokemonResponse> {
    return this.request<SinglePokemonResponse>("/pokemon", {
      method: "POST",
      body: JSON.stringify(pokemon),
    });
  }

  // Health check
  async healthCheck(): Promise<{
    status: string;
    message: string;
    timestamp: string;
  }> {
    return this.request<{ status: string; message: string; timestamp: string }>(
      "/health"
    );
  }

  // About section methods
  async getAboutInfo(id: number): Promise<AboutResponse> {
    return this.request<AboutResponse>(`/pokemon/${id}/about`);
  }

  async setAboutInfo(id: number, aboutInfo: AboutInfo): Promise<AboutResponse> {
    return this.request<AboutResponse>(`/pokemon/${id}/about`, {
      method: "PUT",
      body: JSON.stringify(aboutInfo),
    });
  }

  async deleteAboutInfo(id: number): Promise<void> {
    return this.request<void>(`/pokemon/${id}/about`, { method: "DELETE" });
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();

// Export the class for testing or custom instances
// export default ApiService;
