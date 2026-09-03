import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Transaction, FinancialSummary, CategorySummary } from '../types';
import { formatRupiah, formatMonthYear, formatDate } from './utils';

interface ExportDataParams {
  transactions: Transaction[];
  summary: FinancialSummary;
  categorySummaries: CategorySummary[];
  month: string;
  userName?: string;
}

/**
 * Export data to a comprehensive Excel (.xlsx) workbook with multiple sheets
 */
export function exportToExcel({
  transactions,
  summary,
  categorySummaries,
  month,
  userName = 'User',
}: ExportDataParams) {
  const monthName = formatMonthYear(month);
  const wb = XLSX.utils.book_new();

  // 1. Transactions Sheet
  const txData = transactions.map((t, idx) => ({
    No: idx + 1,
    Tanggal: formatDate(t.transaction_date, 'medium'),
    Tipe: t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
    Kategori: t.category,
    Deskripsi: t.description || '-',
    'Jumlah (Rp)': Number(t.amount) || 0,
  }));

  const wsTransactions = XLSX.utils.json_to_sheet(txData);
  // Set column widths
  wsTransactions['!cols'] = [
    { wch: 6 },  // No
    { wch: 16 }, // Tanggal
    { wch: 14 }, // Tipe
    { wch: 18 }, // Kategori
    { wch: 32 }, // Deskripsi
    { wch: 18 }, // Jumlah
  ];
  XLSX.utils.book_append_sheet(wb, wsTransactions, 'Daftar Transaksi');

  // 2. Category Summary Sheet
  const catData = categorySummaries.map((cat, idx) => ({
    No: idx + 1,
    Kategori: cat.category,
    'Jumlah Transaksi': cat.count,
    'Total Pengeluaran (Rp)': cat.total,
    'Porsi (%)': `${cat.percentage}%`,
  }));

  const wsCategories = XLSX.utils.json_to_sheet(catData);
  wsCategories['!cols'] = [
    { wch: 6 },
    { wch: 20 },
    { wch: 18 },
    { wch: 24 },
    { wch: 12 },
  ];
  XLSX.utils.book_append_sheet(wb, wsCategories, 'Ringkasan Kategori');

  // 3. Overview Summary Sheet
  const overviewData = [
    { Parameter: 'Periode Laporan', Nilai: monthName },
    { Parameter: 'Nama Pengguna', Nilai: userName },
    { Parameter: 'Tanggal Dibuat', Nilai: new Date().toLocaleString('id-ID') },
    { Parameter: '', Nilai: '' },
    { Parameter: 'Total Pemasukan (Income)', Nilai: formatRupiah(summary.income) },
    { Parameter: 'Total Pengeluaran (Expense)', Nilai: formatRupiah(summary.expense) },
    { Parameter: 'Saldo Bersih (Net Balance)', Nilai: formatRupiah(summary.balance) },
    { Parameter: 'Alokasi Budget Bulanan', Nilai: formatRupiah(summary.budget) },
    { Parameter: 'Sisa Budget', Nilai: formatRupiah(summary.remainingBudget) },
    { Parameter: 'Status Budget', Nilai: summary.budgetProgress?.status?.toUpperCase() || 'SAFE' },
    { Parameter: 'Persentase Terpakai', Nilai: `${summary.budgetProgress?.percentage || 0}%` },
    { Parameter: 'Total Jumlah Transaksi', Nilai: transactions.length },
  ];

  const wsOverview = XLSX.utils.json_to_sheet(overviewData);
  wsOverview['!cols'] = [{ wch: 30 }, { wch: 30 }];
  XLSX.utils.book_append_sheet(wb, wsOverview, 'Ringkasan Eksekutif');

  // Generate and trigger download
  const fileName = `MoneyTracker_Report_${month}.xlsx`;
  XLSX.writeFile(wb, fileName);
}

/**
 * Export data to a styled PDF document
 */
export function exportToPDF({
  transactions,
  summary,
  categorySummaries,
  month,
  userName = 'User',
}: ExportDataParams) {
  const monthName = formatMonthYear(month);
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // --- Header & Branding ---
  doc.setFillColor(11, 15, 23); // Dark navy
  doc.rect(0, 0, pageWidth, 42, 'F');

  // Brand Name
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('MoneyTracker', 14, 16);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(16, 185, 129); // Emerald accent
  doc.text('Smart Personal Finance & Budgeting', 14, 23);

  // Report Period (Right aligned)
  doc.setTextColor(203, 213, 225);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`PERIODE: ${monthName.toUpperCase()}`, pageWidth - 14, 16, { align: 'right' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text(`User: ${userName} | Dibuat: ${new Date().toLocaleDateString('id-ID')}`, pageWidth - 14, 23, { align: 'right' });

  // Thin emerald banner line
  doc.setFillColor(16, 185, 129);
  doc.rect(0, 41, pageWidth, 1.5, 'F');

  // --- Financial Summary Metric Cards ---
  let startY = 48;
  const cardWidth = (pageWidth - 28 - 9) / 4;
  const cardHeight = 20;

  const metrics = [
    { label: 'Pemasukan', val: formatRupiah(summary.income), color: [16, 185, 129] },
    { label: 'Pengeluaran', val: formatRupiah(summary.expense), color: [244, 63, 94] },
    { label: 'Sisa Saldo', val: formatRupiah(summary.balance), color: [59, 130, 246] },
    { label: 'Budget Limit', val: formatRupiah(summary.budget), color: [168, 85, 247] },
  ];

  metrics.forEach((m, i) => {
    const x = 14 + i * (cardWidth + 3);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, startY, cardWidth, cardHeight, 2, 2, 'FD');

    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 116, 139);
    doc.text(m.label.toUpperCase(), x + 4, startY + 6);

    doc.setFontSize(9.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(m.color[0], m.color[1], m.color[2]);
    doc.text(m.val, x + 4, startY + 14);
  });

  // --- Section 1: Detailed Category Breakdown Table ---
  startY += 26;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('Ringkasan Pengeluaran per Kategori', 14, startY);

  const categoryRows = categorySummaries.map((cat, idx) => [
    (idx + 1).toString(),
    `${cat.emoji || '🏷️'} ${cat.category}`,
    `${cat.count} Transaksi`,
    formatRupiah(cat.total),
    `${cat.percentage}%`,
  ]);

  autoTable(doc, {
    startY: startY + 3,
    head: [['No', 'Kategori', 'Jumlah', 'Total Pengeluaran', 'Porsi (%)']],
    body: categoryRows.length > 0 ? categoryRows : [['-', 'Belum ada data pengeluaran', '-', '-', '-']],
    theme: 'striped',
    headStyles: {
      fillColor: [15, 23, 42],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'left',
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 50 },
      2: { cellWidth: 35, halign: 'center' },
      3: { cellWidth: 45, halign: 'right', fontStyle: 'bold' },
      4: { cellWidth: 25, halign: 'right' },
    },
    styles: {
      fontSize: 8,
      cellPadding: 2.5,
    },
    margin: { left: 14, right: 14 },
  });

  // --- Section 2: Detailed Transactions Table ---
  const finalY = (doc as any).lastAutoTable?.finalY || startY + 40;
  let txStartY = finalY + 10;

  if (txStartY > 240) {
    doc.addPage();
    txStartY = 20;
  }

  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`Rincian Transaksi (${transactions.length} Data)`, 14, txStartY);

  const txRows = transactions.map((t, idx) => [
    (idx + 1).toString(),
    formatDate(t.transaction_date, 'short'),
    t.type === 'income' ? 'INCOME' : 'EXPENSE',
    t.category,
    t.description || '-',
    (t.type === 'income' ? '+ ' : '- ') + formatRupiah(t.amount),
  ]);

  autoTable(doc, {
    startY: txStartY + 3,
    head: [['No', 'Tanggal', 'Tipe', 'Kategori', 'Deskripsi', 'Jumlah']],
    body: txRows.length > 0 ? txRows : [['-', '-', '-', 'Belum ada transaksi', '-', '-']],
    theme: 'grid',
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 22, halign: 'center' },
      2: { cellWidth: 22, halign: 'center', fontStyle: 'bold' },
      3: { cellWidth: 32 },
      4: { cellWidth: 'auto' },
      5: { cellWidth: 35, halign: 'right', fontStyle: 'bold' },
    },
    styles: {
      fontSize: 7.5,
      cellPadding: 2,
    },
    margin: { left: 14, right: 14 },
    didParseCell: (data) => {
      // Color code income vs expense column
      if (data.section === 'body' && data.column.index === 2) {
        if (data.cell.raw === 'INCOME') {
          data.cell.styles.textColor = [16, 185, 129];
        } else if (data.cell.raw === 'EXPENSE') {
          data.cell.styles.textColor = [244, 63, 94];
        }
      }
      if (data.section === 'body' && data.column.index === 5) {
        const text = String(data.cell.raw || '');
        if (text.startsWith('+')) {
          data.cell.styles.textColor = [16, 185, 129];
        } else {
          data.cell.styles.textColor = [225, 29, 72];
        }
      }
    },
  });

  // --- Add Page Number Footer on all pages ---
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `MoneyTracker by Dfaalt © ${new Date().getFullYear()} — Halaman ${i} dari ${totalPages}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 8,
      { align: 'center' }
    );
  }

  // Save PDF
  const fileName = `MoneyTracker_Report_${month}.pdf`;
  doc.save(fileName);
}
