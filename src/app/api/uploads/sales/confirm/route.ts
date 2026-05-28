import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req:Request){
  const b=await req.json(); if(b.critical) return NextResponse.json({error:'critical errors'},{status:400});
  const report=await prisma.salesReport.create({data:{restaurantId:b.restaurantId,startDate:new Date(b.startDate||new Date()),endDate:new Date(b.endDate||new Date()),fileName:b.fileName||'manual-sales',uploadedByUserId:'cm_admin'}});
  const unmatched:string[]=[];
  for(const r of b.rows){
    const item=await prisma.menuItem.findFirst({where:{restaurantId:b.restaurantId,name:r.itemName}});
    if(!item){unmatched.push(r.itemName);continue;}
    const latest=await prisma.snapshotItem.findFirst({where:{menuItemId:item.id},orderBy:{createdAt:'desc'}});
    const cost=latest?Number(latest.costPrice):0; const totalCost=cost*Number(r.quantity); const gross=Number(r.revenue)-totalCost;
    await prisma.salesReportItem.create({data:{salesReportId:report.id,menuItemId:item.id,article:item.article,name:item.name,groupName:r.category||item.groupName,quantitySold:Number(r.quantity),totalRevenue:Number(r.revenue),averageSalePrice:Number(r.quantity)?Number(r.revenue)/Number(r.quantity):0,costPrice:cost,totalCost,grossProfit:gross,actualFoodCostPercent:Number(r.revenue)?totalCost/Number(r.revenue)*100:0,actualMarginPercent:Number(r.revenue)?gross/Number(r.revenue)*100:0,actualMarkupPercent:totalCost?gross/totalCost*100:0}});
  }
  return NextResponse.json({ok:true,unmatched});
}
