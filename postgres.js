// hanya load .env.local saat development / lokal
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: require("path").resolve(__dirname, "..", ".env.local") });
}

const { Pool } = require("pg");

// bersihkan dan debug ringan DATABASE_URL
if (process.env.DATABASE_URL) {
  process.env.DATABASE_URL = process.env.DATABASE_URL.trim(); // hilangkan whitespace tersembunyi
  const safe = process.env.DATABASE_URL.replace(/:\/\/(.*?):(.*?)@/, "://$1:****@");
  console.log("ENV: DATABASE_URL terdeteksi (disamarkan) =", safe);
} else {
  console.warn("ENV: DATABASE_URL TIDAK terdeteksi! fallback akan dipakai.");
}

let config;
if (process.env.DATABASE_URL) {
  config = {
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  };
} else {
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
