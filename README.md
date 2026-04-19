# Sistema de Notas UdC - Módulo de Reportes

## Descripción
Este proyecto es una plataforma web desarrollada para la **Universitaria de Colombia**, diseñada específicamente para la generación y gestión de reportes académicos. El sistema permite procesar datos maestros de alumnos, docentes, materias y notas para ofrecer visualizaciones detalladas y exportaciones profesionales de datos.

## 🚀 Tecnologías Principales
- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/) & [ShadCN UI](https://ui.shadcn.com/)
- **Backend as a Service**: [Firebase](https://firebase.google.com/) (Firestore & Authentication)
- **Visualización de Datos**: [Recharts](https://recharts.org/)
- **Exportación**: [jsPDF](https://rawgit.com/MrRio/jsPDF/master/docs/index.html) (PDF) & [XLSX](https://sheetjs.com/) (Excel)

## ✨ Características Principales
- **Autenticación Segura**: Acceso protegido mediante Firebase Auth con manejo de sesiones.
- **Dashboard Interactivo**: Navegación fluida y estable entre diferentes tipos de análisis académicos.
- **Módulo de Reportes Dinámicos**:
  - **Por Alumno**: Detalle de notas por cortes (30%, 35%, 35%) y cálculo de definitiva.
  - **Por Materia**: Estadísticas de aprobación/reprobación y listado completo de estudiantes.
  - **Por Docente**: Resumen de rendimiento de todas las asignaturas a cargo de un profesor.
  - **Análisis Grupal**: Gráficos comparativos de promedios entre diferentes asignaturas.
  - **Seguimiento Histórico**: Línea de tiempo de la evolución académica de un estudiante.
- **Exportación Multi-formato**: Generación y descarga inmediata de reportes en PDF y Excel.
- **Administración Total (CRUD)**: Panel para crear, visualizar y eliminar alumnos, docentes, materias y notas.
- **Historial de Actividad**: Registro persistente en Firestore de todos los reportes generados por el usuario.

## 📋 Requisitos Previos
- **Node.js**: Versión 18.0 o superior.
- **npm**: Gestor de paquetes.

## 🛠️ Instalación y Ejecución

1. **Instalar dependencias**:
   Ejecuta el siguiente comando en la terminal para instalar todos los paquetes necesarios:
   ```bash
   npm install
   ```

2. **Configuración de Firebase**:
   La aplicación utiliza una configuración centralizada en `src/firebase/config.ts`. Si deseas conectar tu propio proyecto, asegúrate de actualizar dicho archivo con tus credenciales de Firebase Console.

3. **Ejecutar en modo Desarrollo**:
   Inicia el servidor local:
   ```bash
   npm run dev
   ```
   La aplicación estará disponible por defecto en: `http://localhost:9002`

## 🔑 Acceso de Demostración
Para facilitar las pruebas de la plataforma, la pantalla de inicio incluye un botón de **"Acceso de Demostración"**. Al pulsarlo, el sistema realizará automáticamente:
1. La creación/inicio de sesión de un usuario administrador: `admin@universitaria.edu.co`.
2. La inicialización (Seed) de la base de datos Firestore con datos de prueba realistas.
3. El redireccionamiento al dashboard principal.

## 🗄️ Estructura de Datos (Firestore)
El sistema opera bajo las siguientes colecciones principales:
- `/alumnos`: Información de estudiantes (nombre, código, programa, semestre).
- `/docentes`: Registro de docentes y departamentos.
- `/materias`: Catálogo de asignaturas y créditos.
- `/notas`: Calificaciones desglosadas por cortes y periodos académicos.
- `/users/{userId}/reportes`: Historial de reportes generados, accesible solo por el dueño del reporte.

---
© 2025 **Universitaria de Colombia**
*Ingeniería de Software VII - Módulo de Reportes Académicos*