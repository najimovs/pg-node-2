import { Client } from "pg"

const client = new Client( {
	user: "postgres",
	host: "localhost",
	database: "superapp",
	password: "math",
	port: 5432,
} )

await client.connect()

const username = "'oybek'; drop table users;"

const query = `
INSERT INTO users (id, username, is_cary, age) VALUES( $1, $2, $3, $4 )
`

const result = await client.query( query, [ '' ] )

// console.log( result.rows )

// CRUD

// function abc() {}
	
// AFTER INSERT users call abc();

// BEFORE|AFTER INSERT
// BEFORE|AFTER SELECT
// BEFORE|AFTER UPDATE
// BEFORE|AFTER DELETE
