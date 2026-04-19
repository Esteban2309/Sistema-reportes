
"use client"

import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, addDoc, serverTimestamp } from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase';
import { SectionTitle } from '@/components/ui/section-title';
import { FilterBar } from '@/components/reports/FilterBar';
import { StatCard } from '@/components/ui/stat-card';
import { GradeBadge } from '@/components/ui/grade-badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { exportToPDF, exportToExcel } from '@/lib/utils/export';
import { BookOpen } from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip,
  Legend
} from 'recharts';

export default function MateriaReportPage() {
  const db = useFirestore();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [alumnos, setAlumnos] = useState<any[]>([]);
  const [materias, setMaterias] = useState<any[]>([]);
  const [notas, setNotas] = useState<any[]>([]);
  const [selectedMateria, setSelectedMateria] = useState<any>(null);
  const [filters, setFilters] = useState({
    periodo: '2025-1',
    materia: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      if (!db) return;
      try {
        const materiasSnap = await getDocs(collection(db, 'materias'));
        const alumnosSnap = await getDocs(collection(db, 'alumnos'));
        const materiasData = materiasSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        const alumnosData = alumnosSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        
        setMaterias(materiasData);
        setAlumnos(alumnosData);
        
        if (materiasData.length > 0) {
          setFilters(f => ({ ...f, materia: materiasData[0].id }));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [db]);

  const generateReport = async () => {
    if (!filters.materia || !db || !user) return;
    setLoading(true);
    try {
      const mat = materias.find(m => m.id === filters.materia);
      setSelectedMateria(mat);

      const q = query(
        collection(db, 'notas'), 
        where('materiaId', '==', filters.materia),
        where('periodo', '==', filters.periodo)
      );
      
      const notasSnap = await getDocs(q);
      const notasData = notasSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      setNotas(notasData);

      // Save report record
      await addDoc(collection(db, 'users', user.uid, 'reportes'), {
        tipo: 'por_materia',
        parametros: JSON.stringify(filters),
        periodo: filters.periodo,
        generadoPor: user.uid,
        fecha: new Date().toISOString()
      });

    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "No se pudo generar el reporte.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const getStats = () => {
    if (notas.length === 0) return { promedio: 0, total: 0, aprobados: 0, reprobados: 0 };
    const total = notas.length;
    const aprobados = notas.filter(n => n.definitiva >= 3.0).length;
    const reprobados = total - aprobados;
    const promedio = Math.round((notas.reduce((acc, curr) => acc + curr.definitiva, 0) / total) * 10) / 10;
    return { promedio, total, aprobados, reprobados };
  };

  const stats = getStats();
  const chartData = [
    { name: 'Aprobados', value: stats.aprobados },
    { name: 'Reprobados', value: stats.reprobados }
  ];
  const COLORS = ['#1a1f6e', '#ef4444'];

  const handleExportPDF = () => {
    const headers = ['Alumno', 'Código', 'Corte 1', 'Corte 2', 'Corte 3', 'Definitiva', 'Estado'];
    const data = notas.map(n => {
      const a = alumnos.find(alu => alu.id === n.alumnoId);
      return [
        `${a?.nombre} ${a?.apellido}`,
        a?.codigo || 'N/A',
        n.corte1, n.corte2, n.corte3, n.definitiva, n.estado
      ];
    });
    exportToPDF(
      `REPORTE DE MATERIA: ${selectedMateria?.nombre}`,
      `Periodo: ${filters.periodo} | Créditos: ${selectedMateria?.creditos}`,
      headers,
      data,
      `reporte_materia_${filters.periodo}`
    );
  };

  const handleExportExcel = () => {
    const headers = ['Alumno', 'Código', 'Definitiva', 'Estado'];
    const data = notas.map(n => {
      const a = alumnos.find(alu => alu.id === n.alumnoId);
      return [`${a?.nombre} ${a?.apellido}`, a?.codigo, n.definitiva, n.estado];
    });
    exportToExcel('Reporte Materia', headers, data, `reporte_materia_${filters.periodo}`);
  };

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle title="Reporte por Materia" subtitle="Analice el desempeño de un grupo específico en una asignatura." />

      <FilterBar 
        filters={filters}
        setFilters={setFilters}
        onGenerate={generateReport}
        onExportPDF={handleExportPDF}
        onExportExcel={handleExportExcel}
        options={{
          periodos: ['2025-1', '2024-2', '2024-1'],
          materias: materias.map(m => ({ id: m.id, label: m.nombre }))
        }}
      />

      {selectedMateria && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard label="Promedio Materia" value={stats.promedio} variant="blue" />
            <StatCard label="Total Inscritos" value={stats.total} />
            <StatCard label="Aprobados" value={stats.aprobados} variant="green" />
            <StatCard label="Reprobados" value={stats.reprobados} variant="red" />
          </div>

          <Tabs defaultValue="listado">
            <TabsList className="bg-white border border-udc-border udc-shadow p-1">
              <TabsTrigger value="listado">Listado Estudiantes</TabsTrigger>
              <TabsTrigger value="analisis">Análisis de Aprobación</TabsTrigger>
            </TabsList>
            
            <TabsContent value="listado" className="mt-4">
              <div className="bg-white border border-udc-border rounded-lg udc-shadow overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="udc-table-header">
                    <tr>
                      <th className="px-4 py-3">Estudiante</th>
                      <th className="px-4 py-3">Código</th>
                      <th className="px-4 py-3">C1</th>
                      <th className="px-4 py-3">C2</th>
                      <th className="px-4 py-3">C3</th>
                      <th className="px-4 py-3">Def.</th>
                      <th className="px-4 py-3 text-center">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notas.length === 0 ? (
                      <tr><td colSpan={7} className="px-4 py-10 text-center text-udc-textMuted italic">No hay datos.</td></tr>
                    ) : (
                      notas.map((n) => {
                        const a = alumnos.find(alu => alu.id === n.alumnoId);
                        return (
                          <tr key={n.id} className="udc-table-row">
                            <td className="px-4 py-4 font-medium">{a?.nombre} {a?.apellido}</td>
                            <td className="px-4 py-4 text-udc-textMuted">{a?.codigo}</td>
                            <td className="px-4 py-4">{n.corte1}</td>
                            <td className="px-4 py-4">{n.corte2}</td>
                            <td className="px-4 py-4">{n.corte3}</td>
                            <td className="px-4 py-4 font-bold">{n.definitiva}</td>
                            <td className="px-4 py-4 text-center"><GradeBadge estado={n.estado} /></td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="analisis" className="mt-4">
              <div className="bg-white border border-udc-border rounded-lg p-6 udc-shadow h-[400px] flex flex-col items-center">
                <h3 className="text-sm font-bold text-udc-navy mb-4 uppercase tracking-wider">Distribución de Aprobación</h3>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="45%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}

      {!loading && !selectedMateria && (
        <div className="bg-white border border-dashed border-udc-border rounded-lg p-20 text-center udc-shadow">
          <BookOpen className="mx-auto mb-4 text-udc-navy" size={40} />
          <h3 className="text-lg font-bold text-udc-navy">Seleccione una Materia</h3>
        </div>
      )}
    </div>
  );
}
