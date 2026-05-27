import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(){return NextResponse.json(await prisma.restaurant.findMany({orderBy:{name:'asc'}}));}
export async function POST(req:Request){const b=await req.json();const r=await prisma.restaurant.create({data:{name:b.name,city:b.city,isActive:b.isActive??true}});return NextResponse.json(r);}
export async function PATCH(req:Request){const b=await req.json();const r=await prisma.restaurant.update({where:{id:b.id},data:{name:b.name,city:b.city,isActive:b.isActive}});return NextResponse.json(r);}
