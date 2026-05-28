import { prisma } from '@/lib/prisma';
export const dynamic='force-dynamic';

export default async function Dashboard(){
  const restaurants=await prisma.restaurant.findMany();
  const items=await prisma.snapshotItem.findMany();
  const sales=await prisma.salesReportItem.findMany();
  const lastPrice=await prisma.priceSnapshot.findFirst({orderBy:{uploadedAt:'desc'}});
  const lastSales=await prisma.salesReport.findFirst({orderBy:{uploadedAt:'desc'}});
  const avgFood=items.length?items.reduce((a,b)=>a+Number(b.foodCostPercent),0)/items.length:0;
  const avgMarkup=items.length?items.reduce((a,b)=>a+Number(b.markupPercent),0)/items.length:0;
  const highFood=items.filter(i=>Number(i.foodCostPercent)>35);
  const soldIds=new Set(sales.map(s=>s.menuItemId));
  const noSales=items.filter(i=>!soldIds.has(i.menuItemId));
  return <div><h1>Dashboard</h1><div className='grid grid-4'>{[
    ['Ресторанов',restaurants.length],['Блюд',items.length],['Средний food cost',avgFood.toFixed(2)+'%'],['Средняя наценка',avgMarkup.toFixed(2)+'%']
  ].map(([t,v])=><div className='card' key={String(t)}><div>{t}</div><h3>{v as any}</h3></div>)}</div>
  <div className='card'>Последняя загрузка цен: {lastPrice?.uploadedAt.toISOString()||'—'}<br/>Последняя загрузка продаж: {lastSales?.uploadedAt.toISOString()||'—'}</div>
  <div className='card'><h3>Food cost > 35%</h3>{highFood.length?highFood.map(i=><div key={i.id}>{i.name} — {Number(i.foodCostPercent).toFixed(1)}%</div>):'—'}</div>
  <div className='card'><h3>Блюда без продаж</h3>{noSales.length?noSales.map(i=><div key={i.id}>{i.name}</div>):'—'}</div></div>
}
