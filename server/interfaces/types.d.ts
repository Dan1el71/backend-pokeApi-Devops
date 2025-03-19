interface Pokemon {
  id: number
  name: string
  height: number
  weight: number
  habitat: string
  baseExperience: number
  description: string
  image: string
  abilities: PokemonHability[]
  types: PokemonTypes[]
  stats: PokemonStat[]
  sprites: PokemonSprites
  moves: PokemonMove[]
  evolutionChain: PokemonEvolutionChain[]
}

interface PokemonEvolutionChain {
  id: number
  name: string
  image: string
}

interface PokemonHability {
  isHidden: boolean
  name: string
}

interface Pokemontypes {
  name: string
}

interface PokemonStat {
  name: string
  value: number
}

interface PokemonSprites {
  front_default: string | null
  back_default: string | null
  front_shiny: string | null
  back_shiny: string | null
}

interface PokemonMoves {
  name: string
}

interface PokemonSpecies {
  flavor_text_entries: FlavorTextEntry[]
  habitat?: {
    name: string
  }
}

interface FlavorTextEntry {
  flavor_text: string
  language: {
    name: string
  }
}

interface PaginationParams {
  limit?: number
  offset?: number
}

interface PokemonResponse {
  message: string
  data?: any
}

interface PaginationResponse {
  count: number
  next: string
  previous: string
  results: [
    {
      id: number
      name: string
    }
  ]
}

interface ErrorResponse {
  message: string
  error: string
}

interface PokemonResult {
  name: string
  url: string
}
