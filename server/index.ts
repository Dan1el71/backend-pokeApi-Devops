import app from './app'
import { PORT } from './config/server'
import { connectRedis } from './config/redis'

connectRedis()

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
