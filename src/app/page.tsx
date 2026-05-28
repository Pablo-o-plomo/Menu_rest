import { prisma } from '@/lib/prisma';
export const dynamic='force-dynamic';

export default async function Page(){
  const restaurants=await prisma.restaurant.findMany({include:{menuItems:true,plannedChanges:true}});
  const snapshotItems=await prisma.snapshotItem.findMany();
  const foodBad=snapshotItems.filter(x=>Number(x.foodCostPercent)>30).length;
  const kpi=[
    {t:'Ресторанов',v:restaurants.length},
    {t:'Позиции меню',v:restaurants.reduce((a,b)=>a+b.menuItems.length,0)},
    {t:'Проблемный food cost >30%',v:foodBad},
    {t:'Планов цен',v:restaurants.reduce((a,b)=>a+b.plannedChanges.length,0)}
  ];
  return <div><h1>Dashboard</h1><div className='grid grid-4'>{kpi.map((k,i)=><div className='card' key={i}><div>{k.t}</div><h2>{k.v}</h2></div>)}</div><div className='card'><h3>Сравнение ресторанов</h3><table className='table'><thead><tr><th>Ресторан</th><th>Позиций</th><th>Планов</th></tr></thead><tbody>{restaurants.map(r=><tr key={r.id}><td>{r.name}</td><td>{r.menuItems.length}</td><td>{r.plannedChanges.length}</td></tr>)}</tbody></table></div></div>
}
