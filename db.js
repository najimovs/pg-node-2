import pkg from "pg";
const { Client } = pkg;
import dotenv from "dotenv";
dotenv.config();

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "bank",
  password: "0ybek123",
  port: 5432,
});

await client.connect();

export default client;
