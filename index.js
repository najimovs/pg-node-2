import { Client } from "pg"

const client = new Client( {
	user: "postgres",
	host: "localhost",
	database: "postgres",
	password: "math",
	port: 5432,
} )

await client.connect()

const query = `select 'Hi!'`
const result = await client.query( query )

console.log( result.rows[ 0 ] )
