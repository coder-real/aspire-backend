import { pool } from "../config/db";
import { hashPassword } from "../utils/bcrypt";
import { computeGrade } from "../utils/grades";

export interface StudentProfile {
  id: string;
  fullName: string;
  regNumber: string;
  class: string;
  school: {
    name: string;
    code: string;
  };
}

export interface StudentResult {
  id: string;
  subject: string;
  ca: number;
  exam: number;
  total: number;
  term: string;
  session: string;
  grade: string;
}

export interface ResultsSummary {
  average: number;
  highest: number;
  lowest: number;
  totalSubjects: number;
  term: string;
  session: string;
}

export async function getStudentProfile(
  userId: string,
  schoolId: string,
): Promise<StudentProfile> {
  const result = await pool.query(
    `SELECT
       s.id,
       s.full_name,
       s.reg_number,
       s.class,
       sc.name AS school_name,
       sc.code AS school_code
     FROM students s
     JOIN schools sc ON sc.id = s.school_id
     WHERE s.user_id   = $1
       AND s.school_id = $2`,
    [userId, schoolId],
  );

  const row = result.rows[0];

  if (!row) {
    const err: any = new Error("Student profile not found");
    err.status = 404;
    err.code = "STUDENT_NOT_FOUND";
    throw err;
  }

  return {
    id: row.id,
    fullName: row.full_name,
    regNumber: row.reg_number,
    class: row.class,
    school: {
      name: row.school_name,
      code: row.school_code,
    },
  };
}

export async function getStudentResults(
  userId: string,
  schoolId: string,
  term?: string,
  session?: string,
): Promise<{ results: StudentResult[]; summary: ResultsSummary | null }> {
  const studentQuery = await pool.query(
    `SELECT id FROM students WHERE user_id = $1 AND school_id = $2`,
    [userId, schoolId],
  );

  const student = studentQuery.rows[0];

  if (!student) {
    const err: any = new Error("Student profile not found");
    err.status = 404;
    err.code = "STUDENT_NOT_FOUND";
    throw err;
  }

  const conditions = ["r.student_id = $1", "r.school_id = $2"];
  const params: any[] = [student.id, schoolId];

  if (term) {
    params.push(term);
    conditions.push(`r.term = $${params.length}`);
  }

  if (session) {
    params.push(session);
    conditions.push(`r.session = $${params.length}`);
  }

  const resultsQuery = await pool.query(
    `SELECT
       r.id,
       r.subject,
       r.ca,
       r.exam,
       r.total,
       r.term,
       r.session
     FROM results r
     WHERE ${conditions.join(" AND ")}
     ORDER BY r.subject ASC`,
    params,
  );

  if (resultsQuery.rows.length === 0) {
    return { results: [], summary: null };
  }

  const results: StudentResult[] = resultsQuery.rows.map((row) => ({
    id: row.id,
    subject: row.subject,
    ca: parseFloat(row.ca),
    exam: parseFloat(row.exam),
    total: parseFloat(row.total),
    term: row.term,
    session: row.session,
    grade: computeGrade(parseFloat(row.total)),
  }));

  const totals = results.map((r) => r.total);
  const average = totals.reduce((a, b) => a + b, 0) / totals.length;

  const summary: ResultsSummary = {
    average: Math.round(average * 100) / 100,
    highest: Math.max(...totals),
    lowest: Math.min(...totals),
    totalSubjects: results.length,
    term: results[0].term,
    session: results[0].session,
  };

  return { results, summary };
}

export async function createStudent(
  schoolId: string,
  fullName: string,
  regNumber: string,
  className: string,
  email: string,
  password: string,
) {
  const regCheck = await pool.query(
    `SELECT id FROM students WHERE reg_number = $1 AND school_id = $2`,
    [regNumber, schoolId],
  );
  if (regCheck.rows.length > 0) {
    const err: any = new Error(
      "Registration number already exists in this school",
    );
    err.status = 409;
    err.code = "REG_NUMBER_EXISTS";
    throw err;
  }

  const emailCheck = await pool.query(
    `SELECT id FROM users WHERE email = $1 AND school_id = $2`,
    [email.toLowerCase(), schoolId],
  );
  if (emailCheck.rows.length > 0) {
    const err: any = new Error("Email already exists in this school");
    err.status = 409;
    err.code = "EMAIL_EXISTS";
    throw err;
  }

  const passwordHash = await hashPassword(password);
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const userResult = await client.query(
      `INSERT INTO users (school_id, email, password_hash, role)
       VALUES ($1, $2, $3, 'student')
       RETURNING id, email, created_at`,
      [schoolId, email.toLowerCase(), passwordHash],
    );

    const newUser = userResult.rows[0];

    const studentResult = await client.query(
      `INSERT INTO students (school_id, user_id, reg_number, full_name, class)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, full_name, reg_number, class, created_at`,
      [schoolId, newUser.id, regNumber, fullName, className],
    );

    const newStudent = studentResult.rows[0];

    await client.query("COMMIT");

    return {
      id: newStudent.id,
      fullName: newStudent.full_name,
      regNumber: newStudent.reg_number,
      class: newStudent.class,
      email: newUser.email,
      createdAt: newStudent.created_at,
    };
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function listStudents(
  schoolId: string,
  search?: string,
  className?: string,
  page = 1,
  limit = 20,
) {
  const offset = (page - 1) * limit;
  const conditions = ["s.school_id = $1"];
  const params: any[] = [schoolId];

  if (search && search.trim()) {
    params.push(`%${search.trim()}%`);
    conditions.push(
      `(LOWER(s.full_name) LIKE LOWER($${params.length}) OR LOWER(s.reg_number) LIKE LOWER($${params.length}))`,
    );
  }

  if (className && className.trim()) {
    params.push(className.trim());
    conditions.push(`s.class = $${params.length}`);
  }

  const whereClause = conditions.join(" AND ");

  const countResult = await pool.query(
    `SELECT COUNT(*) FROM students s WHERE ${whereClause}`,
    params,
  );
  const total = parseInt(countResult.rows[0].count, 10);

  params.push(limit, offset);

  const result = await pool.query(
    `SELECT
       s.id,
       s.full_name,
       s.reg_number,
       s.class,
       s.created_at,
       u.email
     FROM students s
     JOIN users u ON u.id = s.user_id
     WHERE ${whereClause}
     ORDER BY s.full_name ASC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params,
  );

  return {
    students: result.rows.map((row) => ({
      id: row.id,
      fullName: row.full_name,
      regNumber: row.reg_number,
      class: row.class,
      email: row.email,
      createdAt: row.created_at,
    })),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}
