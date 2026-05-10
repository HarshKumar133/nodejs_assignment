jest.mock('../src/db/pool', () => ({
  query: jest.fn()
}));

const request = require('supertest');
const pool = require('../src/db/pool');
const app = require('../src/app');

describe('School APIs', () => {
  beforeEach(() => {
    pool.query.mockReset();
  });

  test('POST /addSchool should add school for valid input', async () => {
    pool.query.mockResolvedValueOnce([[]]);
    pool.query.mockResolvedValueOnce([{ insertId: 1 }]);

    const response = await request(app).post('/addSchool').send({
      name: '  Greenwood High  ',
      address: '  123 Main St  ',
      latitude: 12.9716,
      longitude: 77.5946
    });

    expect(response.statusCode).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual({
      id: 1,
      name: 'Greenwood High',
      address: '123 Main St',
      latitude: 12.9716,
      longitude: 77.5946
    });
  });

  test('POST /addSchool should return 400 for invalid payload', async () => {
    const response = await request(app).post('/addSchool').send({
      name: ' ',
      address: '',
      latitude: 123,
      longitude: 'abc'
    });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(pool.query).not.toHaveBeenCalled();
  });

  test('POST /addSchool should return 409 for duplicate school', async () => {
    pool.query.mockResolvedValueOnce([[{ id: 5 }]]);

    const response = await request(app).post('/addSchool').send({
      name: 'Greenwood High',
      address: '123 Main St',
      latitude: 12.9716,
      longitude: 77.5946
    });

    expect(response.statusCode).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/already exists/i);
  });

  test('GET /listSchools should return sorted schools with distance', async () => {
    const mockRows = [
      {
        id: 2,
        name: 'Nearest School',
        address: '1 Near Road',
        latitude: 12.9701,
        longitude: 77.5901,
        distance_km: 0.512
      },
      {
        id: 1,
        name: 'Far School',
        address: '99 Far Road',
        latitude: 13.0501,
        longitude: 77.6901,
        distance_km: 12.345
      }
    ];

    pool.query.mockResolvedValueOnce([mockRows]);

    const response = await request(app)
      .get('/listSchools')
      .query({ latitude: 12.9716, longitude: 77.5946 });

    expect(response.statusCode).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toEqual(mockRows);
    expect(response.body.data[0].distance_km).toBe(0.512);
    expect(pool.query).toHaveBeenCalledWith(expect.any(String), [12.9716, 77.5946, 12.9716]);
  });

  test('GET /listSchools should return 400 for invalid query params', async () => {
    const response = await request(app)
      .get('/listSchools')
      .query({ latitude: '', longitude: 'invalid' });

    expect(response.statusCode).toBe(400);
    expect(response.body.success).toBe(false);
    expect(pool.query).not.toHaveBeenCalled();
  });

  test('GET /listSchools should return 500 if database query fails', async () => {
    pool.query.mockRejectedValueOnce(new Error('DB failure'));

    const response = await request(app)
      .get('/listSchools')
      .query({ latitude: 12.9716, longitude: 77.5946 });

    expect(response.statusCode).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toMatch(/internal server error/i);
  });
});
