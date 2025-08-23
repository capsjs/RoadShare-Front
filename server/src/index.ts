import express from "express";
import cors from "cors";
import { Pool } from "pg";
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

const pool= new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {rejectUnauthorized: false },
});
// console.log('DB host =', new URL(process.env.DATABASE_URL!).hostname);


pool.query("SELECT 1").then(() => {
  console.log("DB OK");
}).catch(err => {
  console.error("DB KO:", err);
});


// app.get("/api/health", (_req, res) => res.json({ ok: true }));

// users from neon db
app.get("/api/users", async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT
        user_id,
        name,
        address,
        email,
        car_image_url,
        clerk_id,
        created_at
      FROM users
      ORDER BY created_at DESC
    `);
    res.json(rows);
  } catch (e: any) {
    console.error("ERROR /api/users:", e);
    res.status(500).json({ error: e.message });
  }
});

// rides from neon db
app.get("/api/rides", async (_req, res) => {
  // console.log("GET /api/rides")
  try {
    const { rows } = await pool.query(`
      SELECT
        r.ride_id,
        r.origin_address,
        r.destination_address,
        r.origin_latitude,
        r.origin_longitude,
        r.destination_latitude,
        r.destination_longitude,
        r.ride_time,
        r.user_id,
        r.created_at,
        json_build_object(
          'user_id', u.user_id,
          'name', u.name,
          'car_image_url', u.car_image_url
        ) AS "user"
      FROM rides r
      JOIN users u ON u.user_id = r.user_id
      ORDER BY r.created_at DESC
    `);
    // node-postgres parse automatiquement json/jsonb -> objets JS
    res.json(rows);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
