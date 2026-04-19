
"use client"

import React from 'react';
import { SectionTitle } from '@/components/ui/section-title';
import { FileDown, CheckCircle2 } from 'lucide-react';

export default function ExportacionesPage() {
  return (
    <div className="flex flex-col gap-6">
      <SectionTitle title="Registro de Exportaciones" subtitle="Log de archivos descargados recientemente." />
      
      <div className="bg-white border border-udc-border rounded-lg p-10 text-center udc-shadow">
        <div className="max-w-md mx-auto">
          <FileDown className="mx-auto mb-4 text-udc-yellow" size={48} />
          <h3 className="text-xl font-bold text-udc-navy">Descargas Locales</h3>
          <p className="text-udc-textMuted text-sm mt-2">
            Todos los reportes exportados en formato PDF y Excel se guardan directamente en la carpeta de descargas de su navegador.
          </p>
          <div className="mt-8 bg-udc-bg p-4 rounded-lg flex items-start gap-3 text-left">
            <CheckCircle2 className="text-green-500 shrink-0" size={18} />
            <p className="text-xs text-udc-navy font-medium">
              El sistema ha sido configurado para procesar exportaciones en tiempo real usando jsPDF y XLSX directamente en su equipo para mayor seguridad y velocidad.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
