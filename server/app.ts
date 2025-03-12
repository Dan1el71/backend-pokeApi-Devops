import express from 'express'
import cors from 'cors'
import { corsOptions } from './config/server'
import morgan from 'morgan'
import pokemoneRoutes from './routes/pokemon.routes'

const app = express()

app.use(cors(corsOptions))
app.use(morgan('dev'))
app.use(express.json())

app.use('/api/v1', pokemoneRoutes)

export default app
