import { pool } from "../config/db";

export interface UploadResultItem {
  subject: string;
  ca: number;
  exam: number;
}

export async function uploadResults(
  studentId: string,
  schoolId: string,
  adminSchoolId: string,
  term: string,
  session: string,
  results: UploadResultItem[],
) {
  const studentCheck = await pool.query(
    `SELECT id FROM students WHERE id = $1 AND school_id = $2`,
    [studentId, adminSchoolId],
  );

  if (studentCheck.rows.length === 0) {
    const exists = await pool.query(`SELECT id FROM students WHERE id = $1`, [
      studentId,
    ]);
    if (exists.rows.length === 0) {
      const err: any = new Error("Student not found");
      err.status = 404;
      err.code = "STUDENT_NOT_FOUND";
      throw err;
    }
    const err: any = new Error("Student belongs to a different school");
    err.status = 403;
    err.code = "STUDENT_SCHOOL_MISMATCH";
    throw err;
  }

  for (const item of results) {
    if (!item.subject || item.subject.trim() === "") {
      const err: any = new Error("Each result must have a subject");
      err.status = 400;
      err.code = "VALIDATION_ERROR";
      throw err;
    }
    if (item.ca < 0 || item.ca > 40) {
      const err: any = new Error(
        `CA score for ${item.subject} must be between 0 and 40`,
      );
      err.status = 400;
      err.code = "VALIDATION_ERROR";
      throw err;
    }
    if (item.exam < 0 || item.exam > 60) {
      const err: any = new Error(
        `Exam score for ${item.subject} must be between 0 and 60`,
      );
      err.status = 400;
      err.code = "VALIDATION_ERROR";
      throw err;
    }
  }

  const client = await pool.connect();
  let inserted = 0;
  let updated = 0;

  try {
    await client.query("BEGIN");

    for (const item of results) {
      const result = await client.query(
        `INSERT INTO results (student_id, school_id, subject, ca, exam, term, session)
         VALUES ($1, $2, $3, $4, $5, $6, $7)
         ON CONFLICT (student_id, subject, term, session)
         DO UPDATE SET ca = EXCLUDED.ca, exam = EXCLUDED.exam
         RETURNING (xmax = 0) AS is_insert`,
        [
          studentId,
          schoolId,
          item.subject.trim(),
          item.ca,
          item.exam,
          term,
          session,
        ],
      );
      if (result.rows[0].is_insert) {
        inserted++;
      } else {
        updated++;
      }
    }

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }

  return { inserted, updated, studentId, term, session };
}
