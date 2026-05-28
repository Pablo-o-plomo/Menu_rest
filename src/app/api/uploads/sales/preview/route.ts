import { NextResponse } from 'next/server';
import { parseUpload } from '@/lib/parse';

type Row=Record<string,unknown>; const get=(r:Row,m:Record<string,string>,k:string)=>r[m[k]];
export async function POST(req:Request){
  const fd=await req.formData(); const file=fd.get('file') as File; const mapping=JSON.parse(String(fd.get('mapping')||'{}'));
  const rows=(await parseUpload(file)) as Row[];
  const parsed=rows.map((r,i)=>({idx:i+1,saleDate:String(get(r,mapping,'saleDate')??''),category:String(get(r,mapping,'category')??''),itemName:String(get(r,mapping,'itemName')??'').trim(),quantity:Number(get(r,mapping,'quantity')??0),revenue:Number(get(r,mapping,'revenue')??0)}));
  const errors=parsed.filter(r=>!r.itemName||r.quantity<=0||r.revenue<=0).map(r=>`Строка ${r.idx}: некорректные поля`);
  return NextResponse.json({rows:parsed,errors,critical:errors.length>0});
}
