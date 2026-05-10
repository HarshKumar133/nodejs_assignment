jest.mock('../src/db/pool', () => ({
  query: jest.fn()
}));

const pool = require('../src/db/pool');
const schoolRepository = require('../src/repositories/schoolRepository');

describe('schoolRepository', () => {
  beforeEach(() => {
    pool.query.mockReset();
  });

  test('listSchoolsByDistance uses SQL ordering by distance then id', async () => {
    pool.query.mockResolvedValueOnce([[]]);

    await schoolRepository.listSchoolsByDistance(12.9716, 77.5946);

    expect(pool.query).toHaveBeenCalledTimes(1);
    const [sql, params] = pool.query.mock.calls[0];

    expect(sql).toContain('AS distance_km');
    expect(sql.replace(/\s+/g, ' ')).toContain('ORDER BY distance_km ASC, id ASC');
    expect(params).toEqual([12.9716, 77.5946, 12.9716]);
  });

  test('getSchoolByNameAndAddress returns first matching row', async () => {
    pool.query.mockResolvedValueOnce([[{ id: 4 }]]);

    const result = await schoolRepository.getSchoolByNameAndAddress('ABC School', 'Downtown');

    expect(pool.query).toHaveBeenCalledWith(
      'SELECT id FROM schools WHERE name = ? AND address = ? LIMIT 1',
      ['ABC School', 'Downtown']
    );
    expect(result).toEqual({ id: 4 });
  });
});
