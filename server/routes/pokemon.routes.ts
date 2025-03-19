import { Router } from 'express'
import {
  getPokemon,
  getPokemonPagination,
  pokemonSearch,
} from '../controllers/pokemon.controller'

const route = Router()

route.get('/pokemon', getPokemonPagination)
route.get('/pokemon/search', pokemonSearch)
route.get('/pokemon/:id', getPokemon)

export default route
