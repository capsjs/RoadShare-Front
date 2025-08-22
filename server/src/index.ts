import express from "express";
import cors from "cors";
import { Pool } from "pg";

const app = express();
app.use(cors());
app.use(express.json());

const pool= new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {rejectUnauthorized: false },
});

app.get("api/rides", async (req, res) => {
  const { rows } = await pool.query(`
    SELECT r.*, u.name, u.car_image_url
    FROM rides r
    JOIN users u ON u.user_id = r.user_id
    ORDER BY r.started_at DESC
    LIMIT 6
  `);
  res.json(rows);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API on http://localhost:${PORT}`));
