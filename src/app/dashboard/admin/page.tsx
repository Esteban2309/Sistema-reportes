
"use client"

import React, { useState } from 'react';
import { SectionTitle } from '@/components/ui/section-title';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { seedDatabase } from '@/lib/firebase/seed';
import { useToast } from '@/hooks/use-toast';
import { 
  Database, 
  RefreshCw, 
  AlertTriangle, 
  Plus, 
  Trash2,
  UserPlus,
  BookPlus,
  GraduationCap,
  ClipboardCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  addDocumentNonBlocking, 
  deleteDocumentNonBlocking 
} from '@/firebase/non-blocking-updates';

export default function AdminPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const alumnosQuery = useMemoFirebase(() => db ? collection(db, 'alumnos') : null, [db]);
  const docentesQuery = useMemoFirebase(() => db ? collection(db, 'docentes') : null, [db]);
  const materiasQuery = useMemoFirebase(() => db ? collection(db, 'materias') : null, [db]);
  const notasQuery = useMemoFirebase(() => db ? collection(db, 'notas') : null, [db]);

  const { data: alumnos } = useCollection(alumnosQuery);
  const { data: docentes } = useCollection(docentesQuery);
  const { data: materias } = useCollection(materiasQuery);
  const { data: notas } = useCollection(notasQuery);

  const handleResetData = async () => {
    if (!db) return;
    setLoading(true);
    try {
      await seedDatabase(db);
      toast({
        title: "Base de datos reiniciada",
        description: "Se han restaurado los datos de prueba originales.",
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error al reiniciar",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (collectionName: string, id: string) => {
    if (!db) return;
    deleteDocumentNonBlocking(doc(db, collectionName, id));
    toast({ title: "Registro eliminado", description: "El cambio se reflejará en breve." });
  };

  return (
    <div className="flex flex-col gap-6 pb-10">
      <SectionTitle 
        title="Administración del Sistema" 
        subtitle="Gestión completa de datos maestros. Puedes crear, visualizar y eliminar registros." 
      />

      <div className="bg-white border border-udc-border rounded-lg p-6 udc-shadow flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-udc-bg rounded-full text-udc-navy">
            <Database size={24} />
          </div>
          <div>
            <h3 className="font-bold text-udc-navy">Mantenimiento Global</h3>
            <p className="text-xs text-udc-textMuted">Restaura la información base a su estado inicial de fábrica.</p>
          </div>
        </div>
        <Button 
          onClick={handleResetData} 
          disabled={loading}
          variant="outline" 
          className="border-udc-navy text-udc-navy hover:bg-udc-bg font-bold"
        >
          <RefreshCw size={16} className={cn("mr-2", loading && "animate-spin")} />
          {loading ? "Reiniciando..." : "Reiniciar Datos de Fábrica"}
        </Button>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3 items-start">
        <AlertTriangle className="text-amber-600 shrink-0" size={18} />
        <p className="text-xs text-amber-800 leading-relaxed">
          <strong>Advertencia de Edición:</strong> Estás operando directamente sobre la base de datos de producción. 
          Cualquier eliminación es permanente y afectará los reportes históricos.
        </p>
      </div>

      <Tabs defaultValue="alumnos" className="w-full">
        <TabsList className="bg-white border border-udc-border udc-shadow p-1">
          <TabsTrigger value="alumnos">Alumnos ({alumnos?.length || 0})</TabsTrigger>
          <TabsTrigger value="docentes">Docentes ({docentes?.length || 0})</TabsTrigger>
          <TabsTrigger value="materias">Materias ({materias?.length || 0})</TabsTrigger>
          <TabsTrigger value="notas">Notas ({notas?.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="alumnos" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <AddEntityDialog 
              title="Nuevo Alumno" 
              entity="alumnos" 
              fields={[
                { name: 'nombre', label: 'Nombre' },
                { name: 'apellido', label: 'Apellido' },
                { name: 'codigo', label: 'Código' },
                { name: 'programa', label: 'Programa' },
                { name: 'semestre', label: 'Semestre', type: 'number' },
                { name: 'email', label: 'Email', type: 'email' }
              ]} 
              icon={<UserPlus size={16} />}
            />
          </div>
          <DataTable 
            data={alumnos} 
            headers={['Nombre', 'Código', 'Programa', 'Semestre']} 
            onDelete={(id) => handleDelete('alumnos', id)}
          />
        </TabsContent>

        <TabsContent value="docentes" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <AddEntityDialog 
              title="Nuevo Docente" 
              entity="docentes" 
              fields={[
                { name: 'nombre', label: 'Nombre' },
                { name: 'apellido', label: 'Apellido' },
                { name: 'departamento', label: 'Departamento' },
                { name: 'email', label: 'Email', type: 'email' }
              ]} 
              icon={<Plus size={16} />}
            />
          </div>
          <DataTable 
            data={docentes} 
            headers={['Nombre', 'Departamento', 'Email']} 
            onDelete={(id) => handleDelete('docentes', id)}
          />
        </TabsContent>

        <TabsContent value="materias" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <AddEntityDialog 
              title="Nueva Materia" 
              entity="materias" 
              fields={[
                { name: 'nombre', label: 'Nombre' },
                { name: 'creditos', label: 'Créditos', type: 'number' },
                { name: 'programa', label: 'Programa' },
                { name: 'docenteId', label: 'ID Docente' }
              ]} 
              icon={<BookPlus size={16} />}
            />
          </div>
          <DataTable 
            data={materias} 
            headers={['Nombre', 'Créditos', 'Programa']} 
            onDelete={(id) => handleDelete('materias', id)}
          />
        </TabsContent>

        <TabsContent value="notas" className="mt-4 space-y-4">
          <div className="flex justify-end">
            <AddEntityDialog 
              title="Nueva Nota" 
              entity="notas" 
              fields={[
                { name: 'alumnoId', label: 'ID Alumno' },
                { name: 'materiaId', label: 'ID Materia' },
                { name: 'docenteId', label: 'ID Docente' },
                { name: 'periodo', label: 'Periodo (ej: 2025-1)' },
                { name: 'corte1', label: 'Corte 1', type: 'number' },
                { name: 'corte2', label: 'Corte 2', type: 'number' },
                { name: 'corte3', label: 'Corte 3', type: 'number' },
                { name: 'definitiva', label: 'Definitiva', type: 'number' },
                { name: 'estado', label: 'Estado (Aprobado/Reprobado)' }
              ]} 
              icon={<ClipboardCheck size={16} />}
            />
          </div>
          <DataTable 
            data={notas} 
            headers={['ID Alumno', 'Periodo', 'Definitiva', 'Estado']} 
            onDelete={(id) => handleDelete('notas', id)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function AddEntityDialog({ title, entity, fields, icon }: { title: string, entity: string, fields: any[], icon: React.ReactNode }) {
  const db = useFirestore();
  const [formData, setFormData] = useState<any>({});
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!db) return;
    
    const collectionRef = collection(db, entity);
    addDocumentNonBlocking(collectionRef, formData);
    setOpen(false);
    setFormData({});
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-udc-navy hover:bg-udc-navyHover text-white">
          {icon}
          <span className="ml-2">{title}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-udc-navy">{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          {fields.map((field) => (
            <div key={field.name} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={field.name} className="text-right text-xs">
                {field.label}
              </Label>
              <Input
                id={field.name}
                type={field.type || 'text'}
                step={field.type === 'number' ? '0.1' : undefined}
                className="col-span-3 h-8 text-xs"
                value={formData[field.name] || ''}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  [field.name]: field.type === 'number' ? parseFloat(e.target.value) : e.target.value 
                })}
                required
              />
            </div>
          ))}
          <DialogFooter>
            <Button type="submit" className="bg-udc-navy">Guardar Registro</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DataTable({ data, headers, onDelete }: { data: any[] | null, headers: string[], onDelete: (id: string) => void }) {
  if (!data) return <div className="p-10 text-center animate-pulse">Cargando datos...</div>;
  if (data.length === 0) return <div className="p-10 text-center text-udc-textMuted italic">No hay datos en esta colección.</div>;

  return (
    <div className="bg-white border border-udc-border rounded-lg udc-shadow overflow-hidden">
      <table className="w-full text-left text-xs">
        <thead className="udc-table-header">
          <tr>
            {headers.map(h => <th key={h} className="px-4 py-3">{h}</th>)}
            <th className="px-4 py-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-udc-border">
          {data.map((item) => (
            <tr key={item.id} className="udc-table-row">
              {headers.map(h => {
                const key = h.toLowerCase().replace(' ', '').replace('id', 'Id').replace('créditos', 'creditos').replace('nombre', 'nombre');
                let display = item[key];
                if (h === 'Nombre' && item.nombre && item.apellido) display = `${item.nombre} ${item.apellido}`;
                if (h === 'ID Alumno') display = item.alumnoId;
                return <td key={h} className="px-4 py-3">{display}</td>;
              })}
              <td className="px-4 py-3 text-right">
                <button 
                  onClick={() => onDelete(item.id)}
                  className="text-red-400 hover:text-red-600 p-1"
                  title="Eliminar registro"
                >
                  <Trash2 size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
