export type Grade = "A" | "B" | "C" | "D" | "E" | "F";

export function computeGrade(total: number): Grade {
  if (total >= 70) return "A";
  if (total >= 60) return "B";
  if (total >= 50) return "C";
  if (total >= 45) return "D";
  if (total >= 40) return "E";
  return "F";
}
