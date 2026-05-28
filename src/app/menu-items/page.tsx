import { prisma } from '@/lib/prisma';
import { calcPricing } from '@/lib/calc';
export const dynamic='force-dynamic';

export default async function MenuItems(){
  const rows=await prisma.snapshotItem.findMany({include:{menuItem:{include:{restaurant:true}}},orderBy:{createdAt:'desc'}});
  return <div><h1>Блюда</h1><table className='table'><thead><tr><th>Ресторан</th><th>Категория</th><th>Блюдо</th><th>Себестоимость</th><th>Цена</th><th>Food cost</th><th>Наценка ₽</th><th>Наценка %</th><th>Коэф.</th><th>Статус</th></tr></thead><tbody>{rows.map(r=>{const c=calcPricing(Number(r.costPrice),Number(r.salePrice));const status=c.foodCostPercent>35?'danger':c.foodCostPercent>25?'warning':'good';return <tr key={r.id}><td>{r.menuItem.restaurant.name}</td><td>{r.groupName}</td><td>{r.name}</td><td>{Number(r.costPrice).toFixed(2)}</td><td>{Number(r.salePrice).toFixed(2)}</td><td>{c.foodCostPercent.toFixed(2)}%</td><td>{c.markupRub.toFixed(2)}</td><td>{c.markupPercent.toFixed(2)}%</td><td>{c.markupMultiplier.toFixed(2)}</td><td>{status}</td></tr>})}</tbody></table></div>;
}
