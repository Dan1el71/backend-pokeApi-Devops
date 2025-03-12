import { createClient } from 'redis'
import { REDIS_URL } from './server'

const redisClient = createClient({ url: REDIS_URL })

redisClient.on('error', (error) => {
  console.error('Redis error:', error)
})

const connectRedis = async () => {
  try {
    await redisClient.connect()
    const response = await redisClient.ping()
    console.log('Redis connected:', response)
  } catch (error) {
    console.error('Failed to connect to Redis:', error)
    process.exit(1)
  }
}

export { redisClient, connectRedis }
