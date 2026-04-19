
"use client"

import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useAuth, useFirestore, useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { seedDatabase } from '@/lib/firebase/seed';
import { Database, LogIn } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  
  const router = useRouter();
  const auth = useAuth();
  const db = useFirestore();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    if (user && !isUserLoading) {
      router.push('/dashboard/reportes/alumno');
    }
  }, [user, isUserLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboard/reportes/alumno');
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error de autenticación",
        description: "Credenciales inválidas. Por favor intente de nuevo.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    if (!auth || !db) return;
    
    setSeeding(true);
    const demoEmail = 'admin@universitaria.edu.co';
    const demoPass = 'admin123';

    try {
      // Intentar iniciar sesión
      try {
        await signInWithEmailAndPassword(auth, demoEmail, demoPass);
      } catch (err: any) {
        // Si no existe, crearlo
        if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/invalid-email') {
          await createUserWithEmailAndPassword(auth, demoEmail, demoPass);
        } else {
          throw err;
        }
      }

      // Sembrar la base de datos (Firestore) pasándole la instancia correcta
      await seedDatabase(db);
      
      toast({
        title: "Acceso Exitoso",
        description: "Se han cargado los datos de prueba y se ha iniciado sesión.",
      });
      
      router.push('/dashboard/reportes/alumno');
    } catch (error: any) {
      console.error(error);
      toast({
        title: "Error en Demo",
        description: error.message || "No se pudo inicializar el acceso de demostración.",
        variant: "destructive"
      });
    } finally {
      setSeeding(false);
    }
  };

  if (isUserLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-udc-bg">
        <div className="w-8 h-8 border-4 border-udc-navy border-t-udc-yellow rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-udc-bg p-4">
      <div className="w-full max-w-md bg-white rounded-xl udc-shadow overflow-hidden border border-udc-border">
        <div className="bg-udc-navy p-8 text-center text-white">
          <h1 className="text-3xl font-bold tracking-tight">Sistema de Notas</h1>
          <p className="text-udc-yellow font-medium mt-1">Universidad Universitaria de Colombia</p>
        </div>
        
        <div className="p-8 space-y-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@universitaria.edu.co" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input 
                id="password" 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11"
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading || seeding}
              className="w-full bg-udc-navy hover:bg-udc-navyHover text-white h-11 text-base font-bold transition-all"
            >
              <LogIn size={18} className="mr-2" />
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-udc-border"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-udc-textMuted font-bold">O también</span>
            </div>
          </div>

          <Button 
            onClick={handleDemoLogin}
            disabled={loading || seeding}
            variant="outline"
            className="w-full border-udc-navy text-udc-navy hover:bg-udc-bg h-11 font-bold"
          >
            <Database size={18} className="mr-2" />
            {seeding ? "Configurando sistema..." : "Acceso de Demostración"}
          </Button>

          <div className="text-center pt-2">
            <p className="text-[10px] text-udc-textMuted uppercase tracking-widest font-bold">
              Credenciales demo: admin@universitaria.edu.co / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
