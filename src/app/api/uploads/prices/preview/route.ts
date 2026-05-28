import { NextResponse } from 'next/server';
import { parseUpload } from '@/lib/parse';

type Row=Record<string,unknown>;
const get=(r:Row,m:Record<string,string>,k:string)=>r[m[k]];

export async function POST(req:Request){
  const fd=await req.formData();
  const file=fd.get('file') as File;
  const mapping=JSON.parse(String(fd.get('mapping')||'{}')) as Record<string,string>;
  const rows=(await parseUpload(file)) as Row[];
  const parsed=rows.map((r,i)=>({
    idx:i+1,
    category:String(get(r,mapping,'category')??''),
    itemName:String(get(r,mapping,'itemName')??'').trim(),
    costPrice:Number(get(r,mapping,'costPrice')??0),
    salePrice:Number(get(r,mapping,'salePrice')??0),
    effectiveDate:String(get(r,mapping,'effectiveDate')??''),
  }));
  const seen=new Set<string>();
  const errors:string[]=[];
  for(const r of parsed){
    if(!r.itemName) errors.push(`Строка ${r.idx}: нет названия блюда`);
    if(!r.costPrice) errors.push(`Строка ${r.idx}: нет себестоимости`);
    if(!r.salePrice) errors.push(`Строка ${r.idx}: нет цены`);
    if(r.salePrice<0||r.costPrice<0) errors.push(`Строка ${r.idx}: отрицательная цена`);
    const key=`${r.itemName}|${r.category}`; if(seen.has(key)) errors.push(`Строка ${r.idx}: дубль`); seen.add(key);
  }
  return NextResponse.json({rows:parsed,errors,critical:errors.length>0});
}
