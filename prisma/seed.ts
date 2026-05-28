import { PrismaClient, PlannedChangeStatus, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const calc = (cost: number, sale: number) => {
  const margin = sale === 0 ? 0 : ((sale - cost) / sale) * 100;
  const markup = cost === 0 ? 0 : ((sale - cost) / cost) * 100;
  const food = sale === 0 ? 0 : (cost / sale) * 100;
  return { margin, markup, food };
};

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@klevo.local' },
    update: {},
    create: {
      id: 'cm_admin',
      name: 'Admin',
      email: 'admin@klevo.local',
      passwordHash,
      role: UserRole.admin,
    },
  });

  const restaurantsData = [
    { name: 'Клёво Москва', city: 'Москва' },
    { name: 'Клёво Ростов', city: 'Ростов' },
    { name: 'Клёво Сочи', city: 'Сочи' },
  ];

  const restaurants = [] as Awaited<ReturnType<typeof prisma.restaurant.create>>[];
  for (const r of restaurantsData) {
    const restaurant = await prisma.restaurant.create({ data: r });
    restaurants.push(restaurant);
  }

  const dishesPerRestaurant = [7, 7, 6]; // total 20 dishes
  const snapshotDate = new Date('2026-05-01T00:00:00.000Z');

  for (let idx = 0; idx < restaurants.length; idx++) {
    const restaurant = restaurants[idx];
    const count = dishesPerRestaurant[idx];

    const snapshot = await prisma.priceSnapshot.create({
      data: {
        restaurantId: restaurant.id,
        snapshotDate,
        fileName: `seed-${restaurant.city}.xlsx`,
        comment: 'Seed snapshot',
        uploadedByUserId: admin.id,
      },
    });

    const salesReport = await prisma.salesReport.create({
      data: {
        restaurantId: restaurant.id,
        startDate: new Date('2026-05-01T00:00:00.000Z'),
        endDate: new Date('2026-05-31T23:59:59.000Z'),
        fileName: `sales-${restaurant.city}.xlsx`,
        uploadedByUserId: admin.id,
      },
    });

    for (let i = 1; i <= count; i++) {
      const n = idx * 10 + i;
      const article = `${restaurant.city.slice(0, 3).toUpperCase()}-${n}`;
      const costPrice = 120 + n * 11;
      const salePrice = 330 + n * 19;
      const quantitySold = 15 + n * 2;
      const totalRevenue = quantitySold * (salePrice - (i % 3) * 7);

      const base = calc(costPrice, salePrice);
      const avgSalePrice = quantitySold ? totalRevenue / quantitySold : salePrice;
      const totalCost = costPrice * quantitySold;
      const grossProfit = totalRevenue - totalCost;
      const actualFoodCostPercent = totalRevenue ? (totalCost / totalRevenue) * 100 : 0;
      const actualMarginPercent = totalRevenue ? (grossProfit / totalRevenue) * 100 : 0;
      const actualMarkupPercent = totalCost ? (grossProfit / totalCost) * 100 : 0;

      const item = await prisma.menuItem.create({
        data: {
          restaurantId: restaurant.id,
          externalCode: `${2000 + n}`,
          article,
          name: `Блюдо ${n}`,
          groupName: i % 2 ? 'Горячее' : 'Салаты',
          priceListName: i % 2 ? 'Основное меню' : 'Ланч',
          isActive: true,
        },
      });

      await prisma.snapshotItem.create({
        data: {
          snapshotId: snapshot.id,
          menuItemId: item.id,
          article,
          name: item.name,
          groupName: item.groupName,
          priceListName: item.priceListName,
          salePrice,
          costPrice,
          markupPercent: base.markup,
          marginPercent: base.margin,
          foodCostPercent: base.food,
        },
      });

      await prisma.salesReportItem.create({
        data: {
          salesReportId: salesReport.id,
          menuItemId: item.id,
          article,
          name: item.name,
          groupName: item.groupName,
          quantitySold,
          totalRevenue,
          averageSalePrice: avgSalePrice,
          costPrice,
          totalCost,
          grossProfit,
          actualFoodCostPercent,
          actualMarginPercent,
          actualMarkupPercent,
        },
      });

      await prisma.plannedPriceChange.create({
        data: {
          restaurantId: restaurant.id,
          menuItemId: item.id,
          currentPrice: salePrice,
          plannedPrice: salePrice + (i % 2 ? 30 : 50),
          currentCostPrice: costPrice,
          currentFoodCostPercent: base.food,
          projectedFoodCostPercent: calc(costPrice, salePrice + (i % 2 ? 30 : 50)).food,
          currentMarginPercent: base.margin,
          projectedMarginPercent: calc(costPrice, salePrice + (i % 2 ? 30 : 50)).margin,
          plannedStartDate: new Date('2026-07-01T00:00:00.000Z'),
          reason: 'Плановое изменение цены',
          status: i % 4 === 0 ? PlannedChangeStatus.draft : PlannedChangeStatus.approved,
          createdByUserId: admin.id,
        },
      });
    }
  }
}

main()
  .then(() => console.log('Seed completed: 3 restaurants, 20 dishes, sales, price plans'))
  .finally(async () => {
    await prisma.$disconnect();
  });
