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

//Register rides in neon db
app.get("/api/rides", async (req, res) => {
  const limit = Math.min(Number(req.query.limit ?? 6) || 6, 50);
  try {
    const { rows } = await pool.query(`
      SELECT r.*, u.name, u.car_image_url
      FROM rides r
      JOIN users u ON u.user_id = r.user_id
      ORDER BY r.started_at DESC
      LIMIT $1
      `, 
      [limit]
    );
    res.json(rows);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
