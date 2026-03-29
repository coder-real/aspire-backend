CREATE TABLE schools (
  id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  name             VARCHAR(255) NOT NULL,
  code             VARCHAR(50)  NOT NULL UNIQUE,
  logo_url         TEXT,
  primary_color    VARCHAR(7)   NOT NULL DEFAULT '#1E3A8A',
  secondary_color  VARCHAR(7)   NOT NULL DEFAULT '#FBBF24',
  layout_type      VARCHAR(20)  NOT NULL DEFAULT 'primary',
  is_active        BOOLEAN      NOT NULL DEFAULT true,
  created_at       TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_schools_code ON schools(code);

CREATE TABLE users (
  id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     UUID         NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  email         VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role          VARCHAR(20)  NOT NULL CHECK (role IN ('admin', 'student')),
  is_active     BOOLEAN      NOT NULL DEFAULT true,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  UNIQUE (school_id, email)
);
CREATE INDEX idx_users_school_id ON users(school_id);

CREATE TABLE students (
  id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     UUID         NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  user_id       UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reg_number    VARCHAR(100) NOT NULL,
  full_name     VARCHAR(255) NOT NULL,
  class         VARCHAR(100) NOT NULL,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  UNIQUE (school_id, reg_number)
);
CREATE INDEX idx_students_school_id  ON students(school_id);
CREATE INDEX idx_students_user_id    ON students(user_id);
CREATE INDEX idx_students_reg_number ON students(reg_number);

CREATE TABLE results (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  UUID         NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  school_id   UUID         NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  subject     VARCHAR(255) NOT NULL,
  ca          NUMERIC(5,2) NOT NULL CHECK (ca >= 0 AND ca <= 40),
  exam        NUMERIC(5,2) NOT NULL CHECK (exam >= 0 AND exam <= 60),
  total       NUMERIC(5,2) GENERATED ALWAYS AS (ca + exam) STORED,
  term        VARCHAR(50)  NOT NULL DEFAULT 'First Term',
  session     VARCHAR(20)  NOT NULL DEFAULT '2024/2025',
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  UNIQUE (student_id, subject, term, session)
);
CREATE INDEX idx_results_student_id ON results(student_id);
CREATE INDEX idx_results_school_id  ON results(school_id);