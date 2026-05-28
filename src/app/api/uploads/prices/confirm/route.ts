import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req:Request){
  const b=await req.json();
  if(b.critical) return NextResponse.json({error:'critical errors'},{status:400});
  const snapshot=await prisma.priceSnapshot.create({data:{restaurantId:b.restaurantId,snapshotDate:new Date(b.snapshotDate||new Date()),fileName:b.fileName||'manual',comment:b.comment||null,uploadedByUserId:'cm_admin'}});
  for(const r of b.rows){
    const item=await prisma.menuItem.upsert({where:{restaurantId_article:{restaurantId:b.restaurantId,article:r.itemName}},update:{name:r.itemName,groupName:r.category},create:{restaurantId:b.restaurantId,article:r.itemName,name:r.itemName,groupName:r.category,priceListName:'Основной'}});
    const markupRub=Number(r.salePrice)-Number(r.costPrice); const markupPercent=Number(r.costPrice)?markupRub/Number(r.costPrice)*100:0; const marginPercent=Number(r.salePrice)?markupRub/Number(r.salePrice)*100:0; const food=Number(r.salePrice)?Number(r.costPrice)/Number(r.salePrice)*100:0;
    await prisma.snapshotItem.create({data:{snapshotId:snapshot.id,menuItemId:item.id,article:item.article,name:item.name,groupName:item.groupName,priceListName:item.priceListName,salePrice:Number(r.salePrice),costPrice:Number(r.costPrice),markupPercent,marginPercent,foodCostPercent:food}});
  }
  return NextResponse.json({ok:true});
}
