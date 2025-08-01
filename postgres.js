const { Pool } = require("pg");

let config;

if (process.env.DATABASE_URL) {
  config = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  };
  console.log("Menggunakan DATABASE_URL untuk koneksi Postgres");
} else {
  // fallback lokal
  config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
  };
}

const pool = new Pool(config);

module.exports = pool;
