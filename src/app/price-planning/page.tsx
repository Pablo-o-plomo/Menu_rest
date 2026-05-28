'use client';
import { useEffect, useMemo, useState } from 'react';

export default function PricePlanning(){
  const [restaurants,setRestaurants]=useState<any[]>([]);const [items,setItems]=useState<any[]>([]);
  const [rid,setRid]=useState('');const [iid,setIid]=useState('');const [newCost,setNewCost]=useState('');const [newSale,setNewSale]=useState('');const [date,setDate]=useState('');
  useEffect(()=>{fetch('/api/restaurants').then(r=>r.json()).then(setRestaurants)},[]);
  useEffect(()=>{if(rid)fetch('/api/menu-items?restaurantId='+rid).then(r=>r.json()).then(setItems)},[rid]);
  const current=useMemo(()=>items.find(i=>i.id===iid),[items,iid]);
  const curCost=Number(newCost||0); const curSale=Number(newSale||0);
  const oldFood= current?25:0; const newFood=curSale?curCost/curSale*100:0;
  const oldMarkup=current?100:0; const newMarkup=curSale-curCost; const diff=newMarkup-oldMarkup;
  const week=diff*100; const month=diff*400;
  async function save(){if(!iid||!rid)return;await fetch('/api/plan',{method:'POST',body:JSON.stringify({restaurantId:rid,menuItemId:iid,newCostPrice:newCost,newSalePrice:newSale,plannedDate:date,comment:'План'})});alert('Сохранено');}
  return <div><h1>Планирование цен</h1><div className='card'><div className='toolbar'><select className='select' value={rid} onChange={e=>setRid(e.target.value)}><option value=''>Ресторан</option>{restaurants.map(r=><option key={r.id} value={r.id}>{r.name}</option>)}</select><select className='select' value={iid} onChange={e=>setIid(e.target.value)}><option value=''>Блюдо</option>{items.map(i=><option key={i.id} value={i.id}>{i.name}</option>)}</select><input className='input' placeholder='Новая себест.' value={newCost} onChange={e=>setNewCost(e.target.value)}/><input className='input' placeholder='Новая цена' value={newSale} onChange={e=>setNewSale(e.target.value)}/><input className='input' type='date' value={date} onChange={e=>setDate(e.target.value)}/><button className='btn' onClick={save}>Сохранить</button></div>
  <div>Старый food cost: {oldFood.toFixed(2)}% | Новый food cost: {newFood.toFixed(2)}%</div>
  <div>Старая наценка: {oldMarkup.toFixed(2)} | Новая наценка: {newMarkup.toFixed(2)}</div>
  <div>Разница с порции: {diff.toFixed(2)} | Прогноз неделя: {week.toFixed(2)} | месяц: {month.toFixed(2)}</div></div></div>
}
