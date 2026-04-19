
"use client"

import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import { SectionTitle } from '@/components/ui/section-title';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts';

export default function SeguimientoReportPage() {
  const db = useFirestore();
  const [alumnos, setAlumnos] = useState<any[]>([]);
  const [selectedAlumno, setSelectedAlumno] = useState('');
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    if (!db) return;
    getDocs(collection(db, 'alumnos')).then(s => setAlumnos(s.docs.map(d => ({id: d.id, ...d.data()}))));
  }, [db]);

  const generateReport = async () => {
    if (!db || !selectedAlumno) return;
    const q = query(collection(db, 'notas'), where('alumnoId', '==', selectedAlumno));
    const snap = await getDocs(q);
    const notas = snap.docs.map(d => d.data());

    const periods: any = {};
    notas.forEach(n => {
      if (!periods[n.periodo]) periods[n.periodo] = { sum: 0, count: 0 };
      periods[n.periodo].sum += n.definitiva;
      periods[n.periodo].count += 1;
    });

    const chartData = Object.keys(periods).sort().map(p => ({
      periodo: p,
      promedio: Math.round((periods[p].sum / periods[p].count) * 10) / 10
    }));

    setData(chartData);
  };

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle title="Seguimiento Histórico" subtitle="Evolución del promedio académico a través de los periodos." />
      
      <div className="bg-white p-4 rounded-lg border border-udc-border udc-shadow flex items-end gap-4">
        <div className="flex-1 max-w-xs">
          <label className="text-[10px] font-bold text-udc-textMuted uppercase mb-1 block">Estudiante</label>
          <Select value={selectedAlumno} onValueChange={setSelectedAlumno}>
            <SelectTrigger><SelectValue placeholder="Seleccionar Estudiante" /></SelectTrigger>
            <SelectContent>
              {alumnos.map(a => <SelectItem key={a.id} value={a.id}>{a.nombre} {a.apellido}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <Button onClick={generateReport} className="bg-udc-navy">Analizar Evolución</Button>
      </div>

      {data.length > 0 && (
        <div className="bg-white border border-udc-border rounded-lg p-6 udc-shadow h-[450px]">
          <h3 className="text-sm font-bold text-udc-navy mb-6 uppercase tracking-wider">Evolución del Promedio Académico</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="periodo" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="promedio" stroke="#1a1f6e" strokeWidth={3} dot={{ r: 6, fill: '#f5c518' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
