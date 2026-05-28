import * as XLSX from 'xlsx';
export async function parseUpload(file: File) {
  const lower = file.name.toLowerCase();
  if (!['.xlsx','.xls','.csv'].some((x) => lower.endsWith(x))) throw new Error('Только .xlsx/.xls/.csv');
  const buf = Buffer.from(await file.arrayBuffer());
  if (lower.endsWith('.csv')) return XLSX.utils.sheet_to_json(XLSX.read(buf, { type:'buffer' }).Sheets[XLSX.read(buf,{type:'buffer'}).SheetNames[0]], { defval: '' }) as Record<string, unknown>[];
  const wb = XLSX.read(buf, { type: 'buffer' });
  return XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '' }) as Record<string, unknown>[];
}
