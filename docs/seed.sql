DELETE FROM results;
DELETE FROM students;
DELETE FROM users;
DELETE FROM schools;

INSERT INTO schools (
  id, name, code, primary_color, secondary_color, layout_type, is_active
) VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Aspire Academy',
  'ASPIRE',
  '#1E3A8A',
  '#FBBF24',
  'primary',
  true
);

INSERT INTO users (
  id, school_id, email, password_hash, role, is_active
) VALUES (
  'b0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  'admin@aspire.edu',
  '$2b$10$t08x4o5VksfvT70hbRvP2e1oPqOmSbg9ur1D5V3nM/joZ/QuwHUEG',
  'admin',
  true
);

INSERT INTO users (
  id, school_id, email, password_hash, role, is_active
) VALUES (
  'd0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  'student@aspire.edu',
  '$2b$10$t08x4o5VksfvT70hbRvP2e1oPqOmSbg9ur1D5V3nM/joZ/QuwHUEG',
  'student',
  true
);

INSERT INTO students (
  id, school_id, user_id, reg_number, full_name, class
) VALUES (
  'c0000000-0000-0000-0000-000000000001',
  'a0000000-0000-0000-0000-000000000001',
  'd0000000-0000-0000-0000-000000000001',
  'ASP/2024/001',
  'Test Student',
  'SS3A'
);

INSERT INTO results (
  student_id, school_id, subject, ca, exam, term, session
) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Mathematics',     35, 52, 'First Term', '2024/2025'),
  ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'English Language', 28, 44, 'First Term', '2024/2025'),
  ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Basic Science',    38, 55, 'First Term', '2024/2025'),
  ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Social Studies',   30, 48, 'First Term', '2024/2025'),
  ('c0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000001', 'Civic Education',  32, 50, 'First Term', '2024/2025');