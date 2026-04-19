
"use client"

import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase';
import { SectionTitle } from '@/components/ui/section-title';
import { FilterBar } from '@/components/reports/FilterBar';
import { StatCard } from '@/components/ui/stat-card';
import { GradeBadge } from '@/components/ui/grade-badge';
import { useToast } from '@/hooks/use-toast';
import { exportToPDF, exportToExcel } from '@/lib/utils/export';
import { Users } from 'lucide-react';

export default function DocenteReportPage() {
  const db = useFirestore();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [docentes, setDocentes] = useState<any[]>([]);
  const [materias, setMaterias] = useState<any[]>([]);
  const [notas, setNotas] = useState<any[]>([]);
  const [selectedDocente, setSelectedDocente] = useState<any>(null);
  const [filters, setFilters] = useState({
    periodo: '2025-1',
    docente: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (!db) return;
      try {
        const dSnap = await getDocs(collection(db, 'docentes'));
        const mSnap = await getDocs(collection(db, 'materias'));
        setDocentes(dSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        setMaterias(mSnap.docs.map(d => ({ id: d.id, ...d.data() })));
        
        const dData = dSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        if (dData.length > 0) setFilters(f => ({ ...f, docente: dData[0].id }));
      } catch (err) {
        console.error(err);
        toast({ title: "Error", description: "No se pudieron cargar los datos básicos.", variant: "destructive" });
      }
    };
    fetchData();
  }, [db]);

  const generateReport = async () => {
    if (!filters.docente || !db || !user) return;
    setLoading(true);
    try {
      const docData = docentes.find(d => d.id === filters.docente);
      setSelectedDocente(docData);

      const q = query(
        collection(db, 'notas'), 
        where('docenteId', '==', filters.docente),
        where('periodo', '==', filters.periodo)
      );
      
      const nSnap = await getDocs(q);
      setNotas(nSnap.docs.map(d => ({ id: d.id, ...d.data() })));

      await addDoc(collection(db, 'users', user.uid, 'reportes'), {
        tipo: 'por_docente',
        parametros: JSON.stringify(filters),
        periodo: filters.periodo,
        generadoPor: user.uid,
        fecha: new Date().toISOString()
      });
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Fallo al generar reporte.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const getStats = () => {
    if (notas.length === 0) return { promedio: 0, total: 0, materiasCount: 0 };
    const total = notas.length;
    const promedio = Math.round((notas.reduce((acc, curr) => acc + curr.definitiva, 0) / total) * 10) / 10;
    const materiasIds = new Set(notas.map(n => n.materiaId));
    return { promedio, total, materiasCount: materiasIds.size };
  };

  const stats = getStats();

  const handleExportPDF = () => {
    const headers = ['Materia', 'Definitiva Promedio', 'Total Alumnos'];
    // Aggregate by materia
    const aggregated: any = {};
    notas.forEach(n => {
      if (!aggregated[n.materiaId]) aggregated[n.materiaId] = { sum: 0, count: 0 };
      aggregated[n.materiaId].sum += n.definitiva;
      aggregated[n.materiaId].count += 1;
    });
    const data = Object.keys(aggregated).map(mId => {
      const m = materias.find(mat => mat.id === mId);
      const avg = Math.round((aggregated[mId].sum / aggregated[mId].count) * 10) / 10;
      return [m?.nombre || 'N/A', avg, aggregated[mId].count];
    });
    exportToPDF(
      `REPORTE DE DOCENTE: ${selectedDocente?.nombre} ${selectedDocente?.apellido}`,
      `Departamento: ${selectedDocente?.departamento} | Periodo: ${filters.periodo}`,
      headers,
      data,
      `reporte_docente_${filters.periodo}`
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle title="Reporte por Docente" subtitle="Resumen de rendimiento de las asignaturas a cargo del docente." />
      
      <FilterBar 
        filters={filters}
        setFilters={setFilters}
        onGenerate={generateReport}
        onExportPDF={handleExportPDF}
        onExportExcel={() => {}}
        options={{
          periodos: ['2025-1', '2024-2'],
          docentes: docentes.map(d => ({ id: d.id, label: `${d.nombre} ${d.apellido}` }))
        }}
      />

      {selectedDocente && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard label="Promedio General Alumnos" value={stats.promedio} variant="amber" />
            <StatCard label="Total Alumnos Evaluados" value={stats.total} />
            <StatCard label="Asignaturas Impartidas" value={stats.materiasCount} variant="blue" />
          </div>

          <div className="bg-white border border-udc-border rounded-lg udc-shadow overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="udc-table-header">
                <tr>
                  <th className="px-4 py-3">Materia</th>
                  <th className="px-4 py-3">Alumnos</th>
                  <th className="px-4 py-3">Promedio</th>
                  <th className="px-4 py-3">% Aprobación</th>
                </tr>
              </thead>
              <tbody>
                {stats.materiasCount === 0 ? (
                  <tr><td colSpan={4} className="px-4 py-10 text-center">Sin datos.</td></tr>
                ) : (
                  Array.from(new Set(notas.map(n => n.materiaId))).map(mId => {
                    const m = materias.find(mat => mat.id === mId);
                    const matNotas = notas.filter(n => n.materiaId === mId);
                    const avg = Math.round((matNotas.reduce((a, b) => a + b.definitiva, 0) / matNotas.length) * 10) / 10;
                    const ap = Math.round((matNotas.filter(n => n.definitiva >= 3).length / matNotas.length) * 100);
                    return (
                      <tr key={mId} className="udc-table-row">
                        <td className="px-4 py-4 font-medium">{m?.nombre}</td>
                        <td className="px-4 py-4">{matNotas.length}</td>
                        <td className="px-4 py-4 font-bold">{avg}</td>
                        <td className="px-4 py-4">{ap}%</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
