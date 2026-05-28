import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(req:Request,{params}:{params:{id:string}}){
  const b=await req.json();
  const r=await prisma.restaurant.update({where:{id:params.id},data:{name:b.name,city:b.city,isActive:Boolean(b.isActive)}});
  return NextResponse.json(r);
}

export async function DELETE(_:Request,{params}:{params:{id:string}}){
  const id=params.id;
  const linked = await prisma.restaurant.findUnique({
    where:{id},
    include:{menuItems:true,priceSnapshots:true,salesReports:true}
  });
  if(!linked) return NextResponse.json({error:'not found'},{status:404});

  const hasLinked = linked.menuItems.length>0 || linked.priceSnapshots.length>0 || linked.salesReports.length>0;
  if(hasLinked){
    await prisma.restaurant.update({where:{id},data:{isActive:false}});
    return NextResponse.json({ok:true,softDeleted:true,message:'Ресторан отключен, так как есть связанные данные'});
  }

  await prisma.restaurant.delete({where:{id}});
  return NextResponse.json({ok:true,softDeleted:false});
}
