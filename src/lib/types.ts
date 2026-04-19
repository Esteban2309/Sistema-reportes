
export type Alumno = {
  id: string;
  nombre: string;
  apellido: string;
  codigo: string;
  programa: string;
  semestre: number;
  email: string;
};

export type Docente = {
  id: string;
  nombre: string;
  apellido: string;
  departamento: string;
  email: string;
};

export type Materia = {
  id: string;
  nombre: string;
  creditos: number;
  docente_id: string;
  programa: string;
};

export type Nota = {
  id: string;
  alumno_id: string;
  materia_id: string;
  docente_id: string;
  periodo: string;
  corte1: number;
  corte2: number;
  corte3: number;
  definitiva: number;
  estado: "Aprobado" | "Reprobado" | "Aprobado mín.";
};

export type Reporte = {
  id: string;
  tipo: "por_alumno" | "por_materia" | "por_docente" | "promedio_grupal" | "seguimiento";
  parametros: any;
  periodo: string;
  generado_por: string;
  fecha: any; // Firebase Timestamp or Date
  archivo_url?: string;
};
