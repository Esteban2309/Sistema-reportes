
"use client"

import React from 'react';
import { collection, query, orderBy } from 'firebase/firestore';
import { useFirestore, useUser, useCollection, useMemoFirebase } from '@/firebase';
import { SectionTitle } from '@/components/ui/section-title';
import { FileText, Calendar, Info, Trash2 } from 'lucide-react';
import { deleteDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { doc } from 'firebase/firestore';

export default function HistorialPage() {
  const db = useFirestore();
  const { user } = useUser();

  const reportesQuery = useMemoFirebase(() => {
    if (!db || !user) return null;
    return query(
      collection(db, 'users', user.uid, 'reportes'),
      orderBy('fecha', 'desc')
    );
  }, [db, user]);

  const { data: reportes, isLoading } = useCollection(reportesQuery);

  const formatTipo = (tipo: string) => {
    switch (tipo) {
      case 'por_alumno': return 'Reporte Individual';
      case 'por_materia': return 'Reporte de Materia';
      case 'por_docente': return 'Reporte de Docente';
      case 'promedio_grupal': return 'Análisis Grupal';
      default: return 'Reporte Académico';
    }
  };

  const handleDelete = (id: string) => {
    if (!db || !user) return;
    deleteDocumentNonBlocking(doc(db, 'users', user.uid, 'reportes', id));
  };

  return (
    <div className="flex flex-col gap-6">
      <SectionTitle title="Historial de Reportes" subtitle="Registro de todos los reportes generados en el sistema." />

      <div className="bg-white border border-udc-border rounded-lg udc-shadow overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="udc-table-header">
            <tr>
              <th className="px-6 py-3">Tipo de Reporte</th>
              <th className="px-6 py-3">Fecha Generación</th>
              <th className="px-6 py-3">Periodo</th>
              <th className="px-6 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-udc-border">
            {isLoading ? (
              <tr><td colSpan={4} className="px-6 py-10 text-center animate-pulse">Cargando historial...</td></tr>
            ) : reportes?.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-10 text-center text-udc-textMuted italic">No se han generado reportes aún.</td></tr>
            ) : (
              reportes?.map((r) => (
                <tr key={r.id} className="udc-table-row">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-udc-bg rounded-lg text-udc-navy">
                        <FileText size={18} />
                      </div>
                      <span className="font-bold">{formatTipo(r.tipo)}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-udc-textMuted flex items-center gap-2">
                    <Calendar size={14} />
                    {new Date(r.fecha).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-udc-bg px-2 py-1 rounded text-[10px] font-bold uppercase">{r.periodo}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(r.id)}
                      className="text-red-400 hover:text-red-600 transition-colors p-2"
                      title="Eliminar del historial"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
