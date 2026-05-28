import { NextResponse } from 'next/server';
export async function GET(){
  const csv='restaurantName,category,itemName,costPrice,salePrice,effectiveDate\nКлёво Москва,Горячее,Борщ,150,420,2026-05-28\n';
  return new NextResponse(csv,{headers:{'content-type':'text/csv; charset=utf-8','content-disposition':'attachment; filename=prices-template.csv'}});
}
