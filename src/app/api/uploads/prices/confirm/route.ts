import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const metrics = (cost: number, sale: number) => {
  const markupRub = sale - cost;
  const markupPercent = sale ? (markupRub / sale) * 100 : 0;
  const marginPercent = markupPercent;
  const food = sale ? (cost / sale) * 100 : 0;
  return { markupRub, markupPercent, marginPercent, food, markupMultiplier: cost ? sale / cost : 0 };
};

export async function POST(req: Request) {
  const b = await req.json();
  if (b.critical) return NextResponse.json({ error: 'critical errors' }, { status: 400 });

  const snapshot = await prisma.priceSnapshot.create({
    data: {
      restaurantId: b.restaurantId,
      snapshotDate: new Date(b.snapshotDate || new Date()),
      fileName: b.fileName || 'iiko-xlsx',
      comment: b.comment || null,
      uploadedByUserId: 'cm_admin',
    },
  });

  for (const r of b.rows as any[]) {
    const item = await prisma.menuItem.upsert({
      where: { restaurantId_article: { restaurantId: b.restaurantId, article: r.article || r.itemName } },
      update: { name: r.itemName, groupName: r.groupName },
      create: {
        restaurantId: b.restaurantId,
        article: r.article || r.itemName,
        name: r.itemName,
        groupName: r.groupName,
        priceListName: 'Зал',
      },
    });

    if (Number(r.hallPrice) > 0) {
      const m = metrics(Number(r.costPrice), Number(r.hallPrice));
      await prisma.snapshotItem.create({ data: { snapshotId: snapshot.id, menuItemId: item.id, article: item.article, name: item.name, groupName: item.groupName, priceListName: 'Зал', salePrice: Number(r.hallPrice), costPrice: Number(r.costPrice), markupPercent: m.markupPercent, marginPercent: m.marginPercent, foodCostPercent: m.food } });
    }

    if (Number(r.deliveryPrice) > 0) {
      const m = metrics(Number(r.costPrice), Number(r.deliveryPrice));
      await prisma.snapshotItem.create({ data: { snapshotId: snapshot.id, menuItemId: item.id, article: item.article, name: item.name, groupName: item.groupName, priceListName: 'Доставка', salePrice: Number(r.deliveryPrice), costPrice: Number(r.costPrice), markupPercent: m.markupPercent, marginPercent: m.marginPercent, foodCostPercent: m.food } });
    }
  }
  return NextResponse.json({ ok: true, uploadedAt: snapshot.uploadedAt });
}
