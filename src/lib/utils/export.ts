
"use client"

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

export const exportToPDF = (title: string, subtitle: string, headers: string[], data: any[][], filename: string) => {
  const doc = new jsPDF();
  
  // Header: Navy rectangle
  doc.setFillColor(26, 31, 110);
  doc.rect(0, 0, 210, 40, 'F');
  
  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.text('REPORTE ACADÉMICO UD C', 105, 20, { align: 'center' });
  
  doc.setFontSize(12);
  doc.text(title, 105, 32, { align: 'center' });
  
  // Yellow divider
  doc.setFillColor(245, 197, 24);
  doc.rect(0, 40, 210, 5, 'F');
  
  // Subtitle
  doc.setTextColor(26, 31, 110);
  doc.setFontSize(10);
  doc.text(subtitle, 15, 55);
  doc.text(`Fecha de generación: ${new Date().toLocaleString()}`, 15, 60);

  // Table
  (doc as any).autoTable({
    startY: 70,
    head: [headers],
    body: data,
    theme: 'striped',
    headStyles: { fillColor: [26, 31, 110], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [248, 249, 253] },
    styles: { fontSize: 9, cellPadding: 3 },
  });

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text('Sistema de Notas UdC - Universidad Universitaria de Colombia', 105, 285, { align: 'center' });
    doc.text(`Página ${i} de ${pageCount}`, 190, 285, { align: 'right' });
  }

  doc.save(`${filename}.pdf`);
};

export const exportToExcel = (sheetName: string, headers: string[], data: any[][], filename: string) => {
  const wb = XLSX.utils.book_new();
  const wsData = [headers, ...data];
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  
  // Basic sizing
  const wscols = headers.map(() => ({ wch: 20 }));
  ws['!cols'] = wscols;

  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${filename}.xlsx`);
};
