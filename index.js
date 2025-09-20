import { Client } from "pg"

const client = new Client( {
	user: "postgres",
	host: "localhost",
	database: "superapp",
	password: "math",
	port: 5432,
} )

await client.connect()

const query = `select * from users`
const result = await client.query( query )

console.log( result.rows )
