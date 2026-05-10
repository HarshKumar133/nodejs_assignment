const pool = require('../db/pool');

const getSchoolByNameAndAddress = async (name, address) => {
  const sql = 'SELECT id FROM schools WHERE name = ? AND address = ? LIMIT 1';
  const [rows] = await pool.query(sql, [name, address]);
  return rows[0] || null;
};

const insertSchool = async ({ name, address, latitude, longitude }) => {
  const sql = `
    INSERT INTO schools (name, address, latitude, longitude)
    VALUES (?, ?, ?, ?)
  `;
  const [result] = await pool.query(sql, [name, address, latitude, longitude]);
  return result.insertId;
};

const listSchoolsByDistance = async (userLatitude, userLongitude) => {
  const sql = `
    SELECT
      id,
      name,
      address,
      latitude,
      longitude,
      ROUND(
        6371 * ACOS(
          LEAST(
            1,
            GREATEST(
              -1,
              COS(RADIANS(?)) * COS(RADIANS(latitude)) * COS(RADIANS(longitude) - RADIANS(?)) +
              SIN(RADIANS(?)) * SIN(RADIANS(latitude))
            )
          )
        ),
        3
      ) AS distance_km
    FROM schools
    ORDER BY distance_km ASC, id ASC
  `;

  const [rows] = await pool.query(sql, [userLatitude, userLongitude, userLatitude]);
  return rows;
};

module.exports = {
  getSchoolByNameAndAddress,
  insertSchool,
  listSchoolsByDistance
};
