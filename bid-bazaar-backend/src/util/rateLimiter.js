import moment from "moment";
import db from '../database/database.js';

const WINDOW_SIZE_IN_HOURS = 24;
const MAX_WINDOW_REQUEST_COUNT = 100;

export const rateLimiter = async (req, res, next) => {
  try {
    const ipAddress = req.ip || req.connection.remoteAddress;
    const currentTime = moment();
    const windowStart = currentTime.subtract(WINDOW_SIZE_IN_HOURS, "hours").format("YYYY-MM-DD HH:mm:ss");

    const [rows] = await db.execute(
      `SELECT * FROM rateLimits 
       WHERE ipAddress = ? 
       AND windowStart <= ?`,
      [ipAddress, windowStart]
    );

    if (rows.length === 0) {
      await db.execute(
        `INSERT INTO rateLimits (ipAddress, requestCount, windowStart) 
         VALUES (?, ?, ?)
         ON DUPLICATE KEY UPDATE requestCount = requestCount + 1, updatedAt = CURRENT_TIMESTAMP`,
        [ipAddress, 1, currentTime.format("YYYY-MM-DD HH:mm:ss")]
      );
      return next();
    }

    const record = rows[0];
    if (record.requestCount >= MAX_WINDOW_REQUEST_COUNT) {
      return res.status(429).json({
        error: `Rate limit exceeded. Max ${MAX_WINDOW_REQUEST_COUNT} requests allowed in ${WINDOW_SIZE_IN_HOURS} hours.`,
      });
    }

    await db.execute(
      `UPDATE rateLimits 
       SET requestCount = requestCount + 1, updatedAt = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [record.id]
    );
    next();
  } catch (e) {
    console.error("Rate Limiter Error:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
