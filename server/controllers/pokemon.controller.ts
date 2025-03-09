import { Request, Response } from 'express'

export const getPokemon = async (req: Request, res: Response) => {
  const { id } = req.params

  res.status(200).json({ message: 'Pokemon controller', id })
}
