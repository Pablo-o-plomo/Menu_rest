import { prisma } from '@/lib/prisma';
export const dynamic='force-dynamic';

export default async function RestaurantPage({params}:{params:{id:string}}){
  const snaps=await prisma.priceSnapshot.findMany({where:{restaurantId:params.id},orderBy:{snapshotDate:'desc'},include:{items:true,restaurant:true}});
  const latest=snaps[0];
  if(!latest)return <div className='card'>Нет снимков по ресторану</div>;
  return <div><h1>{latest.restaurant.name}</h1><div className='card'>Дата снимка: {latest.snapshotDate.toISOString().slice(0,10)}</div><table className='table'><thead><tr><th>Артикул</th><th>Название</th><th>Группа</th><th>Цена</th><th>Себест.</th><th>Food cost</th><th>Маржа</th><th>Наценка</th></tr></thead><tbody>{latest.items.map(i=><tr key={i.id}><td>{i.article}</td><td>{i.name}</td><td>{i.groupName}</td><td>{Number(i.salePrice).toFixed(2)}</td><td>{Number(i.costPrice).toFixed(2)}</td><td>{Number(i.foodCostPercent).toFixed(2)}%</td><td>{Number(i.marginPercent).toFixed(2)}%</td><td>{Number(i.markupPercent).toFixed(2)}%</td></tr>)}</tbody></table></div>
}
