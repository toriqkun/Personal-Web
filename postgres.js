const { Pool } = require("pg");

let config;

if (process.env.DATABASE_URL) {
  config = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  };
  console.log("ENV: DATABASE_URL terdeteksi (tidak ditampilkan isi).");
} else {
  console.warn("ENV: DATABASE_URL TIDAK terdeteksi! fallback akan dipakai.");
  config = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
  };
}

const pool = new Pool(config);

// sanity check koneksi
pool
  .connect()
  .then((client) => {
    client.release();
    console.log("Sanity check: berhasil konek ke Postgres.");
  })
  .catch((err) => {
    console.error("Sanity check: gagal konek ke Postgres:", err.message);
  });

module.exports = pool;
