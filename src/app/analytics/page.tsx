import { prisma } from '@/lib/prisma';
export const dynamic='force-dynamic';

export default async function Analytics(){
  const sales=await prisma.salesReportItem.findMany({include:{menuItem:{include:{restaurant:true}}}});
  const revenue=sales.reduce((a,b)=>a+Number(b.totalRevenue),0);
  const cost=sales.reduce((a,b)=>a+Number(b.totalCost),0);
  const profit=revenue-cost;
  const top=[...sales].sort((a,b)=>Number(b.grossProfit)-Number(a.grossProfit)).slice(0,10);
  const highFood=sales.filter(x=>Number(x.actualFoodCostPercent)>30);
  return <div><h1>Аналитика</h1><div className='grid grid-4'><div className='card'><div>Выручка</div><h3>{revenue.toFixed(2)}</h3></div><div className='card'><div>Себестоимость</div><h3>{cost.toFixed(2)}</h3></div><div className='card'><div>Валовая прибыль</div><h3>{profit.toFixed(2)}</h3></div><div className='card'><div>Food cost %</div><h3>{revenue?((cost/revenue)*100).toFixed(2):'0'}%</h3></div></div><div className='card'><h3>Топ блюд по прибыли</h3><table className='table'><thead><tr><th>Ресторан</th><th>Блюдо</th><th>Прибыль</th></tr></thead><tbody>{top.map(x=><tr key={x.id}><td>{x.menuItem.restaurant.name}</td><td>{x.name}</td><td>{Number(x.grossProfit).toFixed(2)}</td></tr>)}</tbody></table></div><div className='card'><h3>Высокий food cost</h3>{highFood.length===0?'Нет проблем':highFood.map(x=><div key={x.id}>{x.name} — {Number(x.actualFoodCostPercent).toFixed(1)}%</div>)}</div></div>
}
