import { Request, Response } from 'express'
import axios from '../config/axios'
import { parseData, processEvolutionChainData } from '../utils/utils'

export const getPokemon = async (
  req: Request<{ id: string }>,
  res: Response<PokemonResponse>
) => {
  const { id } = req.params

  try {
    const pokemonRes = await axios.get(`/pokemon/${id}`)
    const speciesRes = await axios.get(pokemonRes.data.species.url)

    let evolutionChain: PokemonEvolutionChain[] = []
    if (speciesRes.data.evolution_chain?.url) {
      const evolutionRes = await axios.get(speciesRes.data.evolution_chain.url)
      evolutionChain = await processEvolutionChainData(
        evolutionRes.data.chain,
        async (url: string) => {
          const response = await axios.get(url)
          return response.data
        }
      )
    }

    const parsedPokemon = parseData(
      pokemonRes.data,
      speciesRes.data,
      evolutionChain
    )

    res.status(200).json({
      message: 'Pokemon obtenido exitosamente',
      data: parsedPokemon,
    })
  } catch (error: any) {
    console.error(`Error getting Pokemon ${id}:`, error.message)

    const statusCode = error.response?.status || 500
    const errorMessage =
      statusCode === 404
        ? 'Pokémon no encontrado'
        : 'Error interno del servidor'

    res.status(statusCode).json({
      message: errorMessage,
      error: error.message,
    })
  }
}

export const getPokemonPagination = async (
  req: Request<{}, {}, {}, PaginationParams>,
  res: Response<PokemonResponse>
) => {
  const { limit = 12, offset = 0 } = req.query

  try {
    const parsedLimit = Number(limit)
    const parsedOffset = Number(offset)

    if (isNaN(parsedLimit) || isNaN(parsedOffset)) {
      res.status(400).json({ message: 'Parámetros inválidos' })
    }

    const { data } = await axios.get('/pokemon', {
      params: {
        limit: parsedLimit,
        offset: parsedOffset,
      },
    })

    const paginatedResults = {
      count: data.count,
      next: data.next,
      previous: data.previous,
      results: data.results.map((pokemon: any) => ({
        name: pokemon.name,
        id: pokemon.url.split('/').filter(Boolean).pop(),
      })),
    }

    res.status(200).json({
      message: 'Lista de Pokémon obtenida exitosamente',
      data: paginatedResults,
    })
  } catch (error: any) {
    console.error('Error en paginación:', error.message)
    res.status(500).json({
      message: 'Error al obtener la lista de Pokémon',
      error: error.message,
    })
  }
}
