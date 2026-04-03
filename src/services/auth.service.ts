import { pool } from '../config/db';
import { comparePassword } from '../utils/bcrypt';
import { signToken } from '../utils/jwt';

export interface LoginResult {
  token: string;
  user: {
    id: string;
    email: string;
    role: 'admin' | 'student';
    schoolId: string;
    schoolCode: string;
  };
}

async function getSchool(code: string) {
  const result = await pool.query(
    `SELECT id, code, is_active 
     FROM schools 
     WHERE code = $1`,
    [code.toUpperCase()]
  );
  return result.rows[0] || null;
}

export async function loginStudent(
  schoolCode: string,
  regNumber: string,
  password: string
): Promise<LoginResult> {
  // Step 1: find the school
  const school = await getSchool(schoolCode);
  if (!school) {
    const err: any = new Error('School not found');
    err.status = 404;
    err.code = 'SCHOOL_NOT_FOUND';
    throw err;
  }
  if (!school.is_active) {
    const err: any = new Error('School is inactive');
    err.status = 403;
    err.code = 'SCHOOL_INACTIVE';
    throw err;
  }

  // Step 2: find student + user in one query
  const result = await pool.query(
    `SELECT 
       u.id        AS user_id,
       u.password_hash,
       u.is_active,
       u.email,
       s.id        AS student_id,
       s.full_name,
       s.reg_number
     FROM students s
     JOIN users u ON u.id = s.user_id
     WHERE s.reg_number = $1
       AND s.school_id  = $2`,
    [regNumber, school.id]
  );

  const row = result.rows[0];

  // Step 3: not found OR wrong school — same error to prevent enumeration
  if (!row) {
    const err: any = new Error('Invalid credentials');
    err.status = 401;
    err.code = 'INVALID_CREDENTIALS';
    throw err;
  }

  // Step 4: account disabled
  if (!row.is_active) {
    const err: any = new Error('Account is disabled');
    err.status = 403;
    err.code = 'ACCOUNT_DISABLED';
    throw err;
  }

  // Step 5: password check
  const valid = await comparePassword(password, row.password_hash);
  if (!valid) {
    const err: any = new Error('Invalid credentials');
    err.status = 401;
    err.code = 'INVALID_CREDENTIALS';
    throw err;
  }

  // Step 6: sign token and return
  const token = signToken({
    userId: row.user_id,
    schoolId: school.id,
    schoolCode: school.code,
    role: 'student',
  });

  return {
    token,
    user: {
      id: row.user_id,
      email: row.email,
      role: 'student',
      schoolId: school.id,
      schoolCode: school.code,
    },
  };
}

export async function loginAdmin(
  schoolCode: string,
  email: string,
  password: string
): Promise<LoginResult> {
  // Step 1: find the school
  const school = await getSchool(schoolCode);
  if (!school) {
    const err: any = new Error('School not found');
    err.status = 404;
    err.code = 'SCHOOL_NOT_FOUND';
    throw err;
  }
  if (!school.is_active) {
    const err: any = new Error('School is inactive');
    err.status = 403;
    err.code = 'SCHOOL_INACTIVE';
    throw err;
  }

  // Step 2: find user by email + school + role
  const result = await pool.query(
    `SELECT id, password_hash, is_active, email
     FROM users
     WHERE email     = $1
       AND school_id = $2
       AND role      = 'admin'`,
    [email.toLowerCase(), school.id]
  );

  const user = result.rows[0];

  if (!user) {
    const err: any = new Error('Invalid credentials');
    err.status = 401;
    err.code = 'INVALID_CREDENTIALS';
    throw err;
  }

  if (!user.is_active) {
    const err: any = new Error('Account is disabled');
    err.status = 403;
    err.code = 'ACCOUNT_DISABLED';
    throw err;
  }

  const valid = await comparePassword(password, user.password_hash);
  if (!valid) {
    const err: any = new Error('Invalid credentials');
    err.status = 401;
    err.code = 'INVALID_CREDENTIALS';
    throw err;
  }

  const token = signToken({
    userId: user.id,
    schoolId: school.id,
    schoolCode: school.code,
    role: 'admin',
  });

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      role: 'admin',
      schoolId: school.id,
      schoolCode: school.code,
    },
  };
}
