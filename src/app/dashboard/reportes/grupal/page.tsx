
"use client"

import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore';
import { useFirestore, useUser } from '@/firebase';
import { SectionTitle } from '@/components/ui/section-title';
import { FilterBar } from '@/components/reports/FilterBar';
import { StatCard } from '@/components/ui/stat-card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

export default function GrupalReportPage() {
  const db = useFirestore();
  const { user } = useUser();
  const [materias, setMaterias] = useState<any[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [filters, setFilters] = useState({ periodo: '2025-1' });

  useEffect(() => {
    if (!db) return;
    getDocs(collection(db, 'materias')).then(s => setMaterias(s.docs.map(d => ({id: d.id, ...d.data()}))));
  }, [db]);

  const generateReport = async () => {
    if (!db || !user) return;
    const q = query(collection(db, 'notas'), where('periodo', '==', filters.periodo));
    const snap = await getDocs(q);
    const notas = snap.docs.map(d => d.data());

    const aggregated: any = {};
    notas.forEach(n => {
      if (!aggregated[n.materiaId]) aggregated[n.materiaId] = { sum: 0, count: 0 };
      aggregated[n.materiaId].sum += n.definitiva;
      aggregated[n.materiaId].count += 1;
    });

    const chartData = Object.keys(aggregated).map(mId => ({
      name: materias.find(m => m.id === mId)?.nombre.substring(0, 10) || 'N/A',
      promedio: Math.round((aggregated[mId].sum / aggregated[mId].count) * 10) / 10
    }));

    setData(chartData);

    await addDoc(collection(db, 'users', user.uid, 'reportes'), {
      tipo: 'promedio_grupal',
      parametros: JSON.stringify(filters),
      periodo: filters.periodo,
      generadoPor: user.uid,
      fecha: new Date().toISOString()
    });
  };

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle title="Análisis Grupal" subtitle="Comparativa de rendimientos promedio entre diferentes asignaturas." />
      
      <FilterBar 
        filters={filters} 
        setFilters={setFilters} 
        onGenerate={generateReport}
        onExportPDF={() => {}}
        onExportExcel={() => {}}
        options={{ periodos: ['2025-1', '2024-2'] }}
      />

      {data.length > 0 && (
        <div className="bg-white border border-udc-border rounded-lg p-6 udc-shadow h-[450px]">
          <h3 className="text-sm font-bold text-udc-navy mb-6 uppercase tracking-wider">Promedio de Notas por Asignatura</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" fontSize={11} />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="promedio" fill="#1a1f6e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
