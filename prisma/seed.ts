import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
  const names = ['Южно-Сахалинск', 'Сочи', 'Авиапарк', 'Ростов'];
  for (const n of names) await prisma.restaurant.upsert({ where: { name: n }, update: {}, create: { name: n, city: n } });
  const restaurants = await prisma.restaurant.findMany();

  for (const r of restaurants) {
    for (let i = 1; i <= 10; i++) {
      const cost = 100 + i * 12;
      const sale = Math.round(cost * (1.9 + (i % 3) * 0.15));
      await prisma.menuItem.upsert({ where: { restaurantId_name: { restaurantId: r.id, name: `Блюдо ${i}` } }, update: {}, create: { restaurantId: r.id, name: `Блюдо ${i}`, category: i % 2 ? 'Горячее' : 'Салаты', costPrice: cost, salePrice: sale, markupRub: sale - cost, markupPercent: ((sale - cost)/cost) * 100, foodCostPercent: (cost/sale) * 100, startDate: new Date() } });
    }
  }
  const adminPass = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({ where: { username: 'admin' }, update: {}, create: { username: 'admin', passwordHash: adminPass, role: 'admin' } });
}
main().finally(() => prisma.$disconnect());
