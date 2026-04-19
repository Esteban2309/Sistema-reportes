
"use client"

import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, RefreshCcw } from 'lucide-react';

interface FilterBarProps {
  onGenerate: () => void;
  onExportPDF: () => void;
  onExportExcel: () => void;
  filters: any;
  setFilters: (f: any) => void;
  options: {
    periodos: string[];
    alumnos?: { id: string, label: string }[];
    materias?: { id: string, label: string }[];
    docentes?: { id: string, label: string }[];
  }
}

export const FilterBar = ({ 
  onGenerate, 
  onExportPDF, 
  onExportExcel, 
  filters, 
  setFilters,
  options 
}: FilterBarProps) => {
  return (
    <div className="bg-white border border-udc-border rounded-lg p-4 udc-shadow flex flex-wrap items-center gap-4">
      <div className="flex flex-wrap items-center gap-3 flex-1">
        <div className="min-w-[140px]">
          <label className="text-[10px] font-bold text-udc-textMuted uppercase mb-1 block">Período</label>
          <Select value={filters.periodo} onValueChange={(val) => setFilters({...filters, periodo: val})}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Periodo" />
            </SelectTrigger>
            <SelectContent>
              {options.periodos.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {options.alumnos && (
          <div className="min-w-[200px]">
            <label className="text-[10px] font-bold text-udc-textMuted uppercase mb-1 block">Alumno</label>
            <Select value={filters.alumno} onValueChange={(val) => setFilters({...filters, alumno: val})}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Seleccionar Alumno" />
              </SelectTrigger>
              <SelectContent>
                {options.alumnos.map(a => <SelectItem key={a.id} value={a.id}>{a.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        )}

        {options.materias && (
          <div className="min-w-[200px]">
            <label className="text-[10px] font-bold text-udc-textMuted uppercase mb-1 block">Materia</label>
            <Select value={filters.materia} onValueChange={(val) => setFilters({...filters, materia: val})}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Todas las materias" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las materias</SelectItem>
                {options.materias.map(m => <SelectItem key={m.id} value={m.id}>{m.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        )}

        {options.docentes && (
          <div className="min-w-[200px]">
            <label className="text-[10px] font-bold text-udc-textMuted uppercase mb-1 block">Docente</label>
            <Select value={filters.docente} onValueChange={(val) => setFilters({...filters, docente: val})}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Seleccionar Docente" />
              </SelectTrigger>
              <SelectContent>
                {options.docentes.map(d => <SelectItem key={d.id} value={d.id}>{d.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="pt-5">
          <Button onClick={onGenerate} className="bg-udc-navy hover:bg-udc-navyHover text-white h-9">
            <RefreshCcw size={16} className="mr-2" />
            Generar Reporte
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 pt-5">
        <Button onClick={onExportPDF} variant="outline" className="border-udc-yellow text-udc-textPrimary bg-udc-yellow hover:bg-udc-yellowDark h-9 font-bold">
          <Download size={16} className="mr-2" />
          PDF
        </Button>
        <Button onClick={onExportExcel} variant="outline" className="border-udc-navy text-udc-navy hover:bg-udc-bg h-9">
          <FileSpreadsheet size={16} className="mr-2" />
          Excel
        </Button>
      </div>
    </div>
  );
};
