
export function calculateDefinitiva(c1: number, c2: number, c3: number): number {
  const result = (c1 * 0.30) + (c2 * 0.35) + (c3 * 0.35);
  return Math.round(result * 10) / 10;
}

export function getEstado(definitiva: number): "Aprobado" | "Reprobado" | "Aprobado mín." {
  if (definitiva < 3.0) return "Reprobado";
  if (definitiva >= 3.0 && definitiva <= 3.4) return "Aprobado mín.";
  return "Aprobado";
}
