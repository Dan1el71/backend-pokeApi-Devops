import { Request, Response } from 'express'
import axios from '../config/axios'
import { parseData, processEvolutionChainData } from '../utils/utils'
import {
  getPokemonById,
  savePokemon,
  pokemonExists,
} from '../repository/pokemon.repository'

export const getPokemon = async (
  req: Request<{ id: string }>,
  res: Response<PokemonResponse | ErrorResponse>
) => {
  const { id } = req.params

  try {
    const existingPokemon = await pokemonExists(id)

    if (existingPokemon) {
      const pokemon = await getPokemonById(id)

      res.status(200).json({
        message: 'Pokemon obtenido de la base de datos',
        data: pokemon,
      })

      return
    }

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

    try {
      await savePokemon(parsedPokemon)
    } catch (saveError) {
      console.error('Error guardando Pokémon:', saveError)
    }

    res.status(200).json({
      message: 'Pokemon obtenido exitosamente',
      data: parsedPokemon,
    })
  } catch (error: any) {
    console.error(`Error obteniendo Pokémon ${id}:`, error.message)

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
  res: Response<PaginationResponse | ErrorResponse>
) => {
  const { limit = 12, offset = 0 } = req.query

  try {
    const parsedLimit = Number(limit)
    const parsedOffset = Number(offset)

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
        id: pokemon.url.match(/\/(\d+)\/$/)?.[1] || '',
        name: pokemon.name,
      })),
    }

    res.status(200).json({
      count: paginatedResults.count,
      next: paginatedResults.next,
      previous: paginatedResults.previous,
      results: paginatedResults.results,
    })
  } catch (error: any) {
    console.error('Error en paginación:', error.message)
    res.status(500).json({
      message: 'Error al obtener la lista de Pokémon',
      error: error.message,
    })
  }
}

export const pokemonSearch = async (req: Request, res: Response) => {
  try {
    const searchTerm = req.query.searchTerm?.toString().trim().toLowerCase()

    if (!searchTerm) {
      res.status(400).json({ error: 'Parámetro searchTerm inválido' })

      return
    }

    if (!isNaN(Number(searchTerm))) {
      const { data } = await axios.get(`/pokemon/${searchTerm}`)
      res.status(200).json({
        data: [{ id: data.id, name: data.name }],
      })

      return
    }

    const { data } = await axios.get<{ results: PokemonResult[] }>('/pokemon', {
      params: { limit: 1000 },
      timeout: 5000,
    })

    const results = data.results
      .filter(({ name }) => name.includes(searchTerm))
      .slice(0, 8)
      .map(({ name, url }) => ({
        id: url.match(/\/(\d+)\/$/)?.[1] || '0',
        name,
      }))

    res.status(200).json({ data: results })
  } catch (error) {
    console.error('Error en búsqueda:', error)
    res.status(500).json({ message: 'Error al buscar Pokémon', error })
  }
}
