
"use client"

import React, { useState, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  getDoc, 
  doc 
} from 'firebase/firestore';
import { useFirestore, useMemoFirebase, useCollection } from '@/firebase';
import { SectionTitle } from '@/components/ui/section-title';
import { FilterBar } from '@/components/reports/FilterBar';
import { StatCard } from '@/components/ui/stat-card';
import { GradeBadge } from '@/components/ui/grade-badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { exportToPDF, exportToExcel } from '@/lib/utils/export';
import { UserCircle } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

export default function AlumnoReportPage() {
  const db = useFirestore();
  const [loading, setLoading] = useState(false);
  const [alumnos, setAlumnos] = useState<any[]>([]);
  const [materias, setMaterias] = useState<any[]>([]);
  const [notas, setNotas] = useState<any[]>([]);
  const [selectedAlumno, setSelectedAlumno] = useState<any>(null);
  const [filters, setFilters] = useState({
    periodo: '2025-1',
    alumno: '',
    materia: 'all'
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (!db) return;
      setLoading(true);
      try {
        const alumnosSnap = await getDocs(collection(db, 'alumnos'));
        const materiasSnap = await getDocs(collection(db, 'materias'));
        
        const alumnosData = alumnosSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        const materiasData = materiasSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        
        setAlumnos(alumnosData);
        setMaterias(materiasData);
        
        if (alumnosData.length > 0) {
          setFilters(f => ({ ...f, alumno: alumnosData[0].id }));
        }
      } catch (err) {
        console.error(err);
        toast({ title: "Error", description: "No se pudieron cargar los datos básicos.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [db, toast]);

  const generateReport = async () => {
    if (!filters.alumno || !db) return;
    setLoading(true);
    try {
      const alumnoRef = doc(db, 'alumnos', filters.alumno);
      const alumnoSnap = await getDoc(alumnoRef);
      setSelectedAlumno(alumnoSnap.data());

      let q = query(
        collection(db, 'notas'), 
        where('alumnoId', '==', filters.alumno),
        where('periodo', '==', filters.periodo)
      );
      
      const notasSnap = await getDocs(q);
      let notasData = notasSnap.docs.map(d => ({ id: d.id, ...d.data() }));

      if (filters.materia !== 'all') {
        notasData = notasData.filter(n => n.materiaId === filters.materia);
      }

      setNotas(notasData);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Ocurrió un problema al generar el reporte.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const getStats = () => {
    if (notas.length === 0) return { promedio: 0, cursadas: 0, aprobadas: 0, reprobadas: 0 };
    const cursadas = notas.length;
    const aprobadas = notas.filter(n => n.definitiva >= 3.0).length;
    const reprobadas = cursadas - aprobadas;
    const promedio = Math.round((notas.reduce((acc, curr) => acc + curr.definitiva, 0) / cursadas) * 10) / 10;
    return { promedio, cursadas, aprobadas, reprobadas };
  };

  const stats = getStats();

  const handleExportPDF = () => {
    const headers = ['Materia', 'Corte 1', 'Corte 2', 'Corte 3', 'Definitiva', 'Estado'];
    const data = notas.map(n => {
      const m = materias.find(mat => mat.id === n.materiaId);
      return [
        m?.nombre || 'N/A',
        n.corte1,
        n.corte2,
        n.corte3,
        n.definitiva,
        n.estado
      ];
    });
    exportToPDF(
      `REPORTE DE ALUMNO: ${selectedAlumno?.nombre} ${selectedAlumno?.apellido}`,
      `Periodo: ${filters.periodo} | Código: ${selectedAlumno?.codigo} | Programa: ${selectedAlumno?.programa}`,
      headers,
      data,
      `reporte_alumno_${selectedAlumno?.codigo}_${filters.periodo}`
    );
  };

  const handleExportExcel = () => {
    const headers = ['Materia', 'Corte 1', 'Corte 2', 'Corte 3', 'Definitiva', 'Estado'];
    const data = notas.map(n => [
      materias.find(mat => mat.id === n.materiaId)?.nombre || 'N/A',
      n.corte1, n.corte2, n.corte3, n.definitiva, n.estado
    ]);
    exportToExcel('Reporte Alumno', headers, data, `reporte_alumno_${filters.periodo}`);
  };

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle 
        title="Reporte por Alumno" 
        subtitle="Analice el rendimiento académico individual por periodo y materia." 
      />

      <FilterBar 
        filters={filters}
        setFilters={setFilters}
        onGenerate={generateReport}
        onExportPDF={handleExportPDF}
        onExportExcel={handleExportExcel}
        options={{
          periodos: ['2025-1', '2024-2', '2024-1'],
          alumnos: alumnos.map(a => ({ id: a.id, label: `${a.nombre} ${a.apellido} (${a.codigo})` })),
          materias: materias.map(m => ({ id: m.id, label: m.nombre }))
        }}
      />

      {selectedAlumno && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard label="Promedio General" value={stats.promedio} variant="blue" />
            <StatCard label="Materias Cursadas" value={stats.cursadas} />
            <StatCard label="Materias Aprobadas" value={stats.aprobadas} variant="green" />
            <StatCard label="Materias Reprobadas" value={stats.reprobadas} variant="red" />
          </div>

          <Tabs defaultValue="detalles" className="w-full">
            <TabsList className="bg-white border border-udc-border udc-shadow p-1">
              <TabsTrigger value="detalles">Notas Detalladas</TabsTrigger>
              <TabsTrigger value="graficos">Promedios Visuales</TabsTrigger>
            </TabsList>
            
            <TabsContent value="detalles" className="mt-4">
              <div className="bg-white border border-udc-border rounded-lg udc-shadow overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="udc-table-header">
                    <tr>
                      <th className="px-4 py-3">Materia</th>
                      <th className="px-4 py-3">Corte 1 (30%)</th>
                      <th className="px-4 py-3">Corte 2 (35%)</th>
                      <th className="px-4 py-3">Corte 3 (35%)</th>
                      <th className="px-4 py-3">Definitiva</th>
                      <th className="px-4 py-3 text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notas.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-4 py-10 text-center text-udc-textMuted italic">
                          No se encontraron registros para los filtros seleccionados.
                        </td>
                      </tr>
                    ) : (
                      notas.map((n) => (
                        <tr key={n.id} className="udc-table-row">
                          <td className="px-4 py-4 font-medium">{materias.find(m => m.id === n.materiaId)?.nombre}</td>
                          <td className="px-4 py-4 text-udc-textMuted">{n.corte1.toFixed(1)}</td>
                          <td className="px-4 py-4 text-udc-textMuted">{n.corte2.toFixed(1)}</td>
                          <td className="px-4 py-4 text-udc-textMuted">{n.corte3.toFixed(1)}</td>
                          <td className="px-4 py-4 font-bold text-udc-navy">{n.definitiva.toFixed(1)}</td>
                          <td className="px-4 py-4 text-center">
                            <GradeBadge estado={n.estado} />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="graficos" className="mt-4">
              <div className="bg-white border border-udc-border rounded-lg p-6 udc-shadow h-[400px]">
                <h3 className="text-sm font-bold text-udc-navy mb-4 uppercase tracking-wider">Distribución de Notas por Materia</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={notas.map(n => ({ 
                    name: (materias.find(m => m.id === n.materiaId)?.nombre || '').substring(0, 15) + '...', 
                    val: n.definitiva 
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef0fb" />
                    <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 5]} fontSize={10} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      cursor={{ fill: '#f8f9fd' }}
                    />
                    <Bar dataKey="val" radius={[4, 4, 0, 0]} barSize={40}>
                      {notas.map((n, index) => (
                        <Cell key={`cell-${index}`} fill={n.definitiva >= 3 ? '#1a1f6e' : '#ef4444'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}

      {loading && (
        <div className="flex items-center justify-center p-20">
          <div className="w-8 h-8 border-4 border-udc-navy border-t-udc-yellow rounded-full animate-spin"></div>
        </div>
      )}

      {!loading && !selectedAlumno && (
        <div className="bg-white border border-dashed border-udc-border rounded-lg p-20 text-center udc-shadow">
          <div className="max-w-xs mx-auto flex flex-col items-center gap-4">
            <div className="p-4 bg-udc-bg rounded-full text-udc-navy">
              <UserCircle size={40} />
            </div>
            <h3 className="text-lg font-bold text-udc-navy">Seleccione un Alumno</h3>
            <p className="text-sm text-udc-textMuted">Use los filtros superiores para cargar la información académica del estudiante.</p>
          </div>
        </div>
      )}
    </div>
  );
}
