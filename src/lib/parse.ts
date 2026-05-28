import * as XLSX from 'xlsx';

type Raw = Record<string, unknown>;

const toNum = (v: unknown) => Number(String(v ?? '').replace(',', '.').replace(/[^\d.-]/g, '')) || 0;
const norm = (v: unknown) => String(v ?? '').trim().toLowerCase();

export async function parseUpload(file: File) {
  const lower = file.name.toLowerCase();
  if (!['.xlsx', '.xls'].some((x) => lower.endsWith(x))) throw new Error('Только .xlsx/.xls');
  const buf = Buffer.from(await file.arrayBuffer());
  const wb = XLSX.read(buf, { type: 'buffer' });
  const ws = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json(ws, { defval: '' }) as Raw[];
}

export async function parseIikoPriceWorkbook(file: File) {
  const rows = await parseUpload(file);
  let currentGroup = '';
  const parsed = rows
    .map((r, idx) => {
      const vals = Object.values(r);
      const maybeGroup = String(vals[0] ?? '');
      if (norm(maybeGroup).startsWith('группа:')) {
        currentGroup = maybeGroup.replace(/группа\s*:/i, '').trim();
        return null;
      }
      const article = String(r['Артикул'] ?? r['article'] ?? vals[0] ?? '').trim();
      const itemName = String(r['Блюдо'] ?? r['Название'] ?? r['itemName'] ?? vals[1] ?? '').trim();
      const hallPrice = toNum(r['Цена зал'] ?? r['Зал'] ?? r['hallPrice'] ?? vals[2]);
      const hallMarkupPercent = toNum(r['Наценка зал %'] ?? r['hallMarkupPercent'] ?? vals[3]);
      const deliveryPrice = toNum(r['Цена доставка'] ?? r['Доставка'] ?? r['deliveryPrice'] ?? vals[4]);
      const deliveryMarkupPercent = toNum(r['Наценка доставка %'] ?? r['deliveryMarkupPercent'] ?? vals[5]);
      const costPrice = toNum(r['Себестоимость'] ?? r['costPrice'] ?? vals[6]);
      if (!itemName) return null;
      return { idx: idx + 1, groupName: currentGroup || String(r['Группа'] ?? ''), article, itemName, hallPrice, hallMarkupPercent, deliveryPrice, deliveryMarkupPercent, costPrice };
    })
    .filter(Boolean) as Array<Record<string, unknown>>;
  return parsed;
}
