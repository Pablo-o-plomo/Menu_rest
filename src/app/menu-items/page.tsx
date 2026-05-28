import { prisma } from '@/lib/prisma';
export const dynamic='force-dynamic';
export default async function MenuItems(){const rows=await prisma.menuItem.findMany({include:{restaurant:true},orderBy:{name:'asc'}});return <div><h1>Блюда</h1><table className='table'><thead><tr><th>Ресторан</th><th>Блюдо</th><th>Категория</th><th>Статус</th></tr></thead><tbody>{rows.map(r=><tr key={r.id}><td>{r.restaurant.name}</td><td>{r.name}</td><td>{r.groupName}</td><td>{r.isActive?'active':'off'}</td></tr>)}</tbody></table></div>}
