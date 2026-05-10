# Node.js School Management APIs

This project implements the  APIs using Node.js, Express.js, and MySQL.

## Features

- `POST /addSchool`: validates and creates a new school.
- `GET /listSchools`: returns all schools sorted by nearest distance from user coordinates.
- Input validation with meaningful `400` errors.
- Duplicate protection for exact `(name, address)` combinations with `409` errors.
- Consistent JSON response envelope.

## Tech Stack

- Node.js (CommonJS)
- Express.js
- MySQL (`mysql2`)
- Jest + Supertest

## Project Structure

```text
src/
  config/
  controllers/
  db/
  middlewares/
  repositories/
  routes/
  services/
  utils/
migrations/
scripts/
tests/
postman/
```

## Environment Variables

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

Required options:

- `PORT` (default `3000`)
- Either `MYSQL_URL` (recommended for Railway) or all individual DB values:
  - `DB_HOST`
  - `DB_PORT`
  - `DB_USER`
  - `DB_PASSWORD`
  - `DB_NAME`

## Setup and Run

```bash
npm install
npm run migrate
npm start
```

For development watch mode:

```bash
npm run dev
```

## API Documentation

### 1) Add School

- **Method:** `POST`
- **Endpoint:** `/addSchool`
- **Body:**

```json
{
  "name": "Greenwood High",
  "address": "123 Main Street, Bengaluru",
  "latitude": 12.9716,
  "longitude": 77.5946
}
```

#### Success (`201`)

```json
{
  "success": true,
  "message": "School added successfully.",
  "data": {
    "id": 1,
    "name": "Greenwood High",
    "address": "123 Main Street, Bengaluru",
    "latitude": 12.9716,
    "longitude": 77.5946
  }
}
```

#### Validation Error (`400`)

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    {
      "field": "latitude",
      "message": "latitude must be between -90 and 90."
    }
  ]
}
```

#### Duplicate Error (`409`)

```json
{
  "success": false,
  "message": "School with the same name and address already exists.",
  "errors": [
    {
      "field": "name,address",
      "message": "Duplicate school entry."
    }
  ]
}
```

### 2) List Schools

- **Method:** `GET`
- **Endpoint:** `/listSchools`
- **Query Params:**
  - `latitude`
  - `longitude`

Example:

```text
/listSchools?latitude=12.9716&longitude=77.5946
```

#### Success (`200`)

```json
{
  "success": true,
  "message": "Schools fetched successfully.",
  "data": [
    {
      "id": 2,
      "name": "Nearest School",
      "address": "1 Near Road",
      "latitude": 12.9701,
      "longitude": 77.5901,
      "distance_km": 0.512
    }
  ]
}
```

#### Validation Error (`400`)

```json
{
  "success": false,
  "message": "Validation failed.",
  "errors": [
    {
      "field": "longitude",
      "message": "longitude must be a valid number."
    }
  ]
}
```

## Migration Details

Migration file: `migrations/001_create_schools.sql`

Table definition:
- `id` (Primary Key)
- `name` (VARCHAR)
- `address` (VARCHAR)
- `latitude` (FLOAT)
- `longitude` (FLOAT)
- Unique key: `(name, address)`

## Testing

Run tests:

```bash
npm test
```

Included tests:
- Add school success
- Add school validation failures
- Add school duplicate detection (`409`)
- List schools success
- List schools validation failures
- List schools server error handling
- Repository SQL ordering contract (`distance_km`, tie-break by `id`)

## Railway Deployment (Submission Checklist)

1. Create a new Railway project.
2. Add a MySQL service.
3. Deploy this Node.js service repository.
4. Set environment variable:
   - `MYSQL_URL` from Railway MySQL connection string
   - Optional: `PORT` (Railway usually injects this automatically)
5. Run migration command:

```bash
npm run migrate
```

6. Verify endpoints from Postman:
   - `POST /addSchool`
   - `GET /listSchools`

### Deliverables to share

- Source code repository URL
- Live API base URL (after deployment)
- Postman collection link (`postman/School-Management-APIs.postman_collection.json`)

