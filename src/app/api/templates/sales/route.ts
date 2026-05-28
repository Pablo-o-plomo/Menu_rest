import { NextResponse } from 'next/server';
export async function GET(){
  const csv='restaurantName,saleDate,category,itemName,quantity,revenue\nКлёво Москва,2026-05-28,Горячее,Борщ,25,10500\n';
  return new NextResponse(csv,{headers:{'content-type':'text/csv; charset=utf-8','content-disposition':'attachment; filename=sales-template.csv'}});
}
