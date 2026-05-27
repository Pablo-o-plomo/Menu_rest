import './globals.css';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const restaurants = await prisma.restaurant.findMany({ orderBy: { name: 'asc' } });
  return (
    <html lang='ru'><body>
      <div className='layout'>
        <aside className='sidebar'>
          <div className='brand'>Menu Control</div>
          <nav className='nav'>
            <Link href='/'>Dashboard</Link>
            <Link href='/restaurants'>Рестораны</Link>
            <Link href='/analytics'>Аналитика</Link>
            <Link href='/uploads/menu'>Импорт меню</Link>
            <Link href='/uploads/sales'>Импорт продаж</Link>
            <Link href='/planning'>План цен</Link>
          </nav>
          <hr/>
          {restaurants.map(r=><div key={r.id}><Link href={`/restaurants/${r.id}`}>{r.name}</Link></div>)}
        </aside>
        <main className='content'>{children}</main>
      </div>
    </body></html>
  );
}
