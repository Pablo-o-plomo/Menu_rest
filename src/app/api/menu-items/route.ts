import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
export async function GET(req:Request){const {searchParams}=new URL(req.url);const restaurantId=searchParams.get('restaurantId')||'';const rows=await prisma.menuItem.findMany({where:{restaurantId},orderBy:{name:'asc'}});return NextResponse.json(rows);}
