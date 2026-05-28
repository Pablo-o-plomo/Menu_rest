import { NextResponse } from 'next/server';
import { parseIikoPriceWorkbook } from '@/lib/parse';

export async function POST(req: Request) {
  const fd = await req.formData();
  const file = fd.get('file') as File;
  const rows = await parseIikoPriceWorkbook(file);

  const errors: string[] = [];
  const seen = new Set<string>();
  for (const r of rows as any[]) {
    if (!r.itemName) errors.push(`Строка ${r.idx}: нет названия блюда`);
    if (!r.costPrice) errors.push(`Строка ${r.idx}: нет себестоимости`);
    if (!r.hallPrice && !r.deliveryPrice) errors.push(`Строка ${r.idx}: нет цен зал/доставка`);
    if (r.hallPrice < 0 || r.deliveryPrice < 0 || r.costPrice < 0) errors.push(`Строка ${r.idx}: отрицательные значения`);
    const key = `${r.article}|${r.itemName}`;
    if (seen.has(key)) errors.push(`Строка ${r.idx}: дубль`);
    seen.add(key);
  }
  return NextResponse.json({ rows, errors, critical: errors.length > 0 });
}
