import { Request, Response } from 'express'
import axios from '../config/axios'

export const getPokemon = async (
  req: Request,
  res: Response<PokemonResponse>
) => {
  const { id } = req.params

  const { data } = await axios.get(`/pokemon/${id}`)

  res.status(200).json({ message: 'Pokemon controller', data: data.name })
}

export const getPokemonPagination = async (req: Request, res: Response) => {
  const { limit, offset } = req.query

  const { data } = await axios.get(`/pokemon?limit=${limit}&offset=${offset}`)

  res.status(200).json({ message: 'Pokemon controller', data })
}
