import { redisClient } from '../config/redis'

/**
 * Obtiene un valor de la cache
 * @param key Clave para buscar en la cache
 * @returns Valor parseado o null si este no existe
 */
const get = async <T>(key: string): Promise<T | null> => {
  try {
    const data = await redisClient.get(key)
    return data ? (JSON.parse(data) as T) : null
  } catch (error) {
    console.error(`Error al obtener  la clave %{}:`, error)
    return null
  }
}

/**
 * Guarda un valor en la cache con una expiración.
 * @param key Clave para almacenar el valor.
 * @param value Valor a almacenar.
 * @param expirationInSeconds Tiempo de expiración en segundos (por defecto 3600 segundos).
 */
const set = async (
  key: string,
  value: any,
  expirationInSeconds: number = 3600
): Promise<void> => {
  try {
    await redisClient.setEx(key, expirationInSeconds, JSON.stringify(value))
  } catch (error) {
    console.error(`Error al guardar la clave ${key}:`, error)
  }
}

/**
 * Elimina una clave de la cache.
 * @param key Clave a eliminar.
 */
const del = async (key: string): Promise<void> => {
  try {
    await redisClient.del(key)
  } catch (error) {
    console.error(`Error al eliminar la clave ${key}:`, error)
  }
}

export { get, set, del }
