const fs = require('fs');
const path = require('path');
const pool = require('../src/db/pool');

const migrationPath =
  process.argv[2] || path.join(__dirname, '..', 'migrations', '001_create_schools.sql');

const run = async () => {
  try {
    const migrationSql = fs.readFileSync(migrationPath, 'utf-8');
    await pool.query(migrationSql);
    // eslint-disable-next-line no-console
    console.log(`Migration executed successfully: ${migrationPath}`);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Migration failed:', error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

run();
