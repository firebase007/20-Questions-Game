import { Pool } from 'pg'

import dotenv from 'dotenv'

dotenv.config()
console.log(process.env.PG_URL, 'PG_URL')
const databaseConfig = { connectionString: process.env.PG_URL }
const pool = new Pool(databaseConfig)

export default pool
