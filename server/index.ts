import app from './app'
import { PORT } from './config/server'

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
