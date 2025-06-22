const express = require('express');
const pool = require('./db');
const app = express();

app.get('/devices/:id/data', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    'SELECT * FROM sensor_data WHERE device_id = $1 ORDER BY timestamp DESC LIMIT 50',
    [id]
  );
  res.json(result.rows);
});

app.listen(process.env.PORT || 3000);