import { Router } from 'express'
import { getPokemon } from '../controllers/pokemon.controller'

const route = Router()

route.get('/pokemon/:id', getPokemon)


export default route