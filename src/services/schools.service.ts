import { pool } from '../config/db';

export interface SchoolListItem {
  id: string;
  name: string;
  code: string;
  logoUrl: string | null;
}

export interface SchoolConfig {
  id: string;
  name: string;
  code: string;
  logoUrl: string | null;
  theme: {
    primaryColor: string;
    secondaryColor: string;
  };
  layoutType: 'primary' | 'secondary';
  features: string[];
}

export async function getSchools(
  search?: string,
  limit = 50
): Promise<{ schools: SchoolListItem[]; total: number }> {
  let query: string;
  let params: any[];

  if (search && search.trim()) {
    query = `
      SELECT id, name, code, logo_url
      FROM schools
      WHERE is_active = true
        AND (
          LOWER(name) LIKE LOWER($1)
          OR LOWER(code) LIKE LOWER($1)
        )
      ORDER BY name ASC
      LIMIT $2
    `;
    params = [`%${search.trim()}%`, limit];
  } else {
    query = `
      SELECT id, name, code, logo_url
      FROM schools
      WHERE is_active = true
      ORDER BY name ASC
      LIMIT $1
    `;
    params = [limit];
  }

  const result = await pool.query(query, params);

  const schools: SchoolListItem[] = result.rows.map((row) => ({
    id: row.id,
    name: row.name,
    code: row.code,
    logoUrl: row.logo_url,
  }));

  return { schools, total: schools.length };
}

export async function getSchoolConfig(code: string): Promise<SchoolConfig> {
  const result = await pool.query(
    `SELECT id, name, code, logo_url, primary_color, secondary_color, layout_type, is_active
     FROM schools
     WHERE code = $1`,
    [code.toUpperCase()]
  );

  const row = result.rows[0];

  if (!row) {
    const err: any = new Error('School not found');
    err.status = 404;
    err.code = 'SCHOOL_NOT_FOUND';
    throw err;
  }

  if (!row.is_active) {
    const err: any = new Error('School is inactive');
    err.status = 403;
    err.code = 'SCHOOL_INACTIVE';
    throw err;
  }

  return {
    id: row.id,
    name: row.name,
    code: row.code,
    logoUrl: row.logo_url,
    theme: {
      primaryColor: row.primary_color,
      secondaryColor: row.secondary_color,
    },
    layoutType: row.layout_type,
    features: ['results', 'profile'],
  };
}
