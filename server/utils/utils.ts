const PREFERRED_LANGUAGES = ['es', 'en'] as const
const DEFAULT_DESCRIPTION = 'Descripción no disponible.'
const UNKNOWN_HABITAT = 'Desconocido'

export const parseData = (
  data: any,
  speciesData: PokemonSpecies,
  evolutionChain: PokemonEvolutionChain[] = []
): Pokemon => {
  const {
    id,
    name,
    height,
    weight,
    base_experience: baseExperience,
    sprites,
    stats,
    abilities,
    types,
    moves,
  } = data

  return {
    id,
    name,
    height: height / 10,
    weight: weight / 10,
    baseExperience,
    image: sprites.other['official-artwork'].front_default,
    sprites: mapSprites(sprites),
    description: getDescription(speciesData.flavor_text_entries),
    habitat: speciesData.habitat?.name || UNKNOWN_HABITAT,
    stats: mapStats(stats),
    abilities: mapAbilities(abilities),
    evolutionChain,
    types: mapTypes(types),
    moves: mapMoves(moves),
  }
}

// Helpers específicos para mapeo

const formatStatName = (name: string) => {
  switch (name.toLowerCase()) {
    case 'hp':
      return 'PS'
    case 'attack':
      return 'Ataque'
    case 'defense':
      return 'Defensa'
    case 'special-attack':
      return 'Atq. Esp'
    case 'special-defense':
      return 'Def. Esp'
    case 'speed':
      return 'Velocidad'
    default:
      return name
  }
}

const mapStats = (stats: any[]) =>
  stats?.map(({ stat, base_stat }) => ({
    name: formatStatName(stat.name),
    value: base_stat,
  })) || []

const mapAbilities = (abilities: any[]) =>
  abilities?.map(({ is_hidden, ability }) => ({
    isHidden: is_hidden,
    name: ability.name,
  })) || []

const mapTypes = (types: any[]) =>
  types?.map(({ type }) => ({ name: type.name })) || []

const mapMoves = (moves: any[]) =>
  moves?.map(({ move }) => ({ name: move.name })) || []

const getDescription = (flavorEntries: FlavorTextEntry[] = []) => {
  const entry = PREFERRED_LANGUAGES.map((lang) =>
    flavorEntries.find((e) => e.language.name === lang)
  ).find(Boolean)

  return entry ? normalizeText(entry.flavor_text) : DEFAULT_DESCRIPTION
}

const mapSprites = (sprites: any): PokemonSprites => ({
  front_default: sprites.front_default || null,
  back_default: sprites.back_default || null,
  front_shiny: sprites.front_shiny || null,
  back_shiny: sprites.back_shiny || null,
})

const normalizeText = (text: string) =>
  text
    .replace(/[\f\n]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

export const processEvolutionChainData = (
  chain: any,
  fetcher: (url: string) => Promise<any>
): Promise<PokemonEvolutionChain[]> => {
  const evolutions: PokemonEvolutionChain[] = []

  const traverseChain = async (node: any): Promise<void> => {
    if (!node) return

    try {
      const speciesRes = await fetcher(node.species.url)
      const defaultVariety = speciesRes.varieties.find((v: any) => v.is_default)
      if (!defaultVariety) {
        console.error(
          `Variedad por defecto no encontrada para ${speciesRes.name}`
        )
        return
      }
      const pokemonRes = await fetcher(defaultVariety.pokemon.url)
      evolutions.push({
        id: pokemonRes.id,
        name: pokemonRes.name,
        image: pokemonRes.sprites.other['official-artwork'].front_default,
      })

      await Promise.all(
        node.evolves_to.map((evolution: any) => traverseChain(evolution))
      )
    } catch (error) {
      console.error(`Error procesando evolución: ${error}`)
    }
  }

  return (async () => {
    await traverseChain(chain)
    return evolutions
  })()
}
