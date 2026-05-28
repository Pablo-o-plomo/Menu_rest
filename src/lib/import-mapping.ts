export type RawRow=Record<string,unknown>;
const norm=(v:unknown)=>String(v??'').toLowerCase().trim();
const pick=(r:RawRow,a:string[])=>Object.entries(r).find(([k])=>a.some(x=>norm(k)===norm(x)))?.[1];
const num=(v:unknown)=>Number(String(v??'').replace(',','.').replace(/[^\d.-]/g,''))||0;

export const mapMenu=(r:RawRow)=>({restaurantName:String(pick(r,['restaurantName','ресторан'])??''),category:String(pick(r,['category','group','группа'])??''),name:String(pick(r,['name','блюдо','название'])??''),article:String(pick(r,['article','артикул'])??''),costPrice:num(pick(r,['costPrice','себестоимость'])),salePrice:num(pick(r,['salePrice','цена']))});
export const mapSale=(r:RawRow)=>({date:String(pick(r,['date','дата'])??''),name:String(pick(r,['name','блюдо','название'])??''),quantity:num(pick(r,['quantity','количество'])),revenue:num(pick(r,['revenue','выручка']))});
