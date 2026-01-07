// src/lib/db.ts
import mysql from "mysql2/promise";

const globalForDb = global as unknown as { pool: mysql.Pool | undefined };

export const pool =
  globalForDb.pool ??
  mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 2, // LOW for shared hosting
    queueLimit: 0,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.pool = pool;
}

export default pool;
