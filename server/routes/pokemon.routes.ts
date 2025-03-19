import { Router } from 'express'
import {
  getPokemon,
  getPokemonPagination,
} from '../controllers/pokemon.controller'

const route = Router()

route.get('/pokemon', getPokemonPagination)
route.get('/pokemon/:id', getPokemon)

export default route
