
import { Firestore, doc, writeBatch } from 'firebase/firestore';
import { calculateDefinitiva, getEstado } from '../utils/grade-logic';

export async function seedDatabase(db: Firestore) {
  const batch = writeBatch(db);

  // Alumnos
  const alumnos = [
    { id: 'a1', nombre: 'Carlos', apellido: 'Rodríguez', codigo: '2022001', programa: 'Ingeniería de Software', semestre: 7, email: 'carlos.r@universitaria.edu.co' },
    { id: 'a2', nombre: 'María', apellido: 'Pérez', codigo: '2022002', programa: 'Ingeniería de Software', semestre: 7, email: 'maria.p@universitaria.edu.co' },
    { id: 'a3', nombre: 'Juan', apellido: 'García', codigo: '2021050', programa: 'Sistemas', semestre: 8, email: 'juan.g@universitaria.edu.co' },
    { id: 'a4', nombre: 'Elena', apellido: 'Martínez', codigo: '2023010', programa: 'Ingeniería de Software', semestre: 4, email: 'elena.m@universitaria.edu.co' },
    { id: 'a5', nombre: 'Luis', apellido: 'López', codigo: '2022112', programa: 'Ingeniería de Software', semestre: 6, email: 'luis.l@universitaria.edu.co' },
  ];

  alumnos.forEach(a => {
    const ref = doc(db, 'alumnos', a.id);
    batch.set(ref, a);
  });

  // Docentes
  const docentes = [
    { id: 'd1', nombre: 'Ricardo', apellido: 'Sánchez', departamento: 'Ingeniería', email: 'r.sanchez@universitaria.edu.co' },
    { id: 'd2', nombre: 'Patricia', apellido: 'Díaz', departamento: 'Ciencias Básicas', email: 'p.diaz@universitaria.edu.co' },
    { id: 'd3', nombre: 'Jorge', apellido: 'Morales', departamento: 'Ingeniería', email: 'j.morales@universitaria.edu.co' },
  ];

  docentes.forEach(d => {
    const ref = doc(db, 'docentes', d.id);
    batch.set(ref, d);
  });

  // Materias
  const materias = [
    { id: 'm1', nombre: 'Ingeniería de Software VII', creditos: 4, docenteId: 'd1', programa: 'Ingeniería de Software' },
    { id: 'm2', nombre: 'Bases de Datos II', creditos: 3, docenteId: 'd1', programa: 'Ingeniería de Software' },
    { id: 'm3', nombre: 'Redes', creditos: 3, docenteId: 'd3', programa: 'Sistemas' },
    { id: 'm4', nombre: 'Arquitectura de Software', creditos: 4, docenteId: 'd3', programa: 'Ingeniería de Software' },
    { id: 'm5', nombre: 'Cálculo Diferencial', creditos: 4, docenteId: 'd2', programa: 'Ingeniería' },
    { id: 'm6', nombre: 'Estructuras de Datos', creditos: 3, docenteId: 'd1', programa: 'Ingeniería de Software' },
  ];

  materias.forEach(m => {
    const ref = doc(db, 'materias', m.id);
    batch.set(ref, m);
  });

  // Notas (Mock generation)
  const periodos = ['2025-1', '2024-2'];
  let notaId = 1;
  alumnos.forEach(a => {
    materias.filter(m => m.programa === a.programa || m.programa === 'Ingeniería').forEach(m => {
      periodos.forEach(p => {
        const c1 = Math.round((1 + Math.random() * 4) * 10) / 10;
        const c2 = Math.round((1 + Math.random() * 4) * 10) / 10;
        const c3 = Math.round((1 + Math.random() * 4) * 10) / 10;
        const definitiva = calculateDefinitiva(c1, c2, c3);
        const estado = getEstado(definitiva);

        const nota = {
          id: `n${notaId++}`,
          alumnoId: a.id,
          materiaId: m.id,
          docenteId: m.docenteId,
          periodo: p,
          corte1: c1,
          corte2: c2,
          corte3: c3,
          definitiva: definitiva,
          estado: estado
        };
        const ref = doc(db, 'notas', nota.id);
        batch.set(ref, nota);
      });
    });
  });

  await batch.commit();
}
