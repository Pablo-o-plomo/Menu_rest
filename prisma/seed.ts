import { PrismaClient, UserRole, PlannedChangeStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const calc = (cost: number, sale: number) => ({
  margin: sale === 0 ? 0 : ((sale - cost) / sale) * 100,
  markup: cost === 0 ? 0 : ((sale - cost) / cost) * 100,
  food: sale === 0 ? 0 : (cost / sale) * 100,
});

async function main() {
  const pass = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({ where: { email: 'admin@klevo.local' }, update: {}, create: { id: 'cm_admin', name: 'Admin', email: 'admin@klevo.local', passwordHash: pass, role: UserRole.admin } });

  const names = ['Клёво Москва', 'Клёво Ростов', 'Клёво Сочи'];
  for (const name of names) {
    const r = await prisma.restaurant.create({ data: { name, city: name.replace('Клёво ', '') } });
    for (let i = 1; i <= 8; i++) {
      const cost = 120 + i * 20;
      const sale = 390 + i * 35;
      const m = calc(cost, sale);
      const item = await prisma.menuItem.create({ data: { restaurantId: r.id, article: `${r.city}-${i}`, externalCode: `${1000 + i}`, name: `Блюдо ${i}`, groupName: i % 2 ? 'Горячее' : 'Салаты', priceListName: 'Основное меню' } });
      const snap = await prisma.priceSnapshot.create({ data: { restaurantId: r.id, snapshotDate: new Date('2026-05-01'), fileName: 'seed.xlsx', uploadedByUserId: admin.id } });
      await prisma.snapshotItem.create({ data: { snapshotId: snap.id, menuItemId: item.id, article: item.article, name: item.name, groupName: item.groupName, priceListName: item.priceListName, salePrice: sale, costPrice: cost, markupPercent: m.markup, marginPercent: m.margin, foodCostPercent: m.food } });
      await prisma.plannedPriceChange.create({ data: { restaurantId: r.id, menuItemId: item.id, currentPrice: sale, plannedPrice: sale + 50, currentCostPrice: cost, currentFoodCostPercent: m.food, projectedFoodCostPercent: calc(cost, sale + 50).food, currentMarginPercent: m.margin, projectedMarginPercent: calc(cost, sale + 50).margin, plannedStartDate: new Date('2026-07-01'), reason: 'Плановое повышение', status: PlannedChangeStatus.approved, createdByUserId: admin.id } });
    }
  }
}
main().finally(() => prisma.$disconnect());
