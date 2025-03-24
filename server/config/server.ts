process.loadEnvFile()

const origin = process.env.ORIGIN || 'http://localhost:3000'

export const corsOptions = {
  origin: [origin],
  credentials: true,
}

export const {
  PORT = 3000,
  API_URL = 'https://pokeapi.co/api/v2',
} = process.env
